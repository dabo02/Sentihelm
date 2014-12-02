//=========================================
//  IMPORTS
//=========================================

//Imports for web server
//Create an express server (app)
//then pass along to http server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var http = require('http');

//Import and initialize socket.io
var io = require('socket.io')(server);

//Other imports
var clc = require('cli-color');
var net = require('net');
var Parse = require('parse').Parse;
var OpenTok = require('opentok');
var MobileClient = require('./lib/mobileclient');
var EncryptionManager = require('./lib/EncryptionManager.js');
var PasswordGenerator = require('./lib/PasswordGenerator.js');

//=========================================
//  ENVIRONMENT SETUP
//=========================================

//Define colors for log
var cyan = clc.cyanBright;
var green = clc.greenBright;
var yellow = clc.yellowBright;
var red = clc.redBright;
var notice = clc.magentaBright;
var maroon = clc.red;

////************************** User Encryption*****************************************/
var APP_ID_2 = "csvQJc5N6LOCQbAnzeBlutmYO0e6juVPwiEcW9Hd";
var JS_KEY_2 = "T9wCcLw0g1OBtlVg0s2gQoGITog5a0p77Pg3CIor";
Parse.initialize(APP_ID_2, JS_KEY_2);

//Set up parse.
//var APP_ID = "Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE";
//var JS_KEY = "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk";
//Parse.initialize(APP_ID, JS_KEY);

//Set up Parse classes for queries
var TipReport = Parse.Object.extend("TipReport");
var Client = Parse.Object.extend("Client");
var VideoSession = Parse.Object.extend("VideoSession");
var PushNotification = Parse.Object.extend("FollowUpNotifications");

//Generates the password for the encription manager.
var passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
var encryptionManager = new EncryptionManager();

//Set OpenTok key and secret. Create a new opentok object,
//which is used to manage sessions and tokens.
var otKey = '44755992';
var otSecret = '66817543d6b84f279a2f5557065b061875a4871f';
var opentok = new OpenTok(otKey, otSecret);

//Create an non-overriding log file and feed it
//to an express logger with default settings
var logFile = fs.createWriteStream('./logs/express.log', {flag:'a'});
app.use(morgan({format:'default', stream:logFile}));

//Attach a bodyParser in order to handle json and urlencoded
//bodies.
app.use(bodyParser());

//Add the static middleware: allows express to serve up
//static content in the specified directory (for CSS/JS).
app.use(express.static(__dirname + '/public'));

//Setup socket.io that communicates with front end
io.on('connect', function(socket){

  //Front-end requested a new batch of tips;
  //get query data and fetch
  socket.on('request-batch', function(data){

    //**************************Testing Encryption*****************************************/
    //Get filtering values: by clientId, date
    //and tips after or before given date
    var clientId = data.clientId;
    var date = data.lastTipDate ? new Date(data.lastTipDate) : new Date();
    var isAfterDate = data.isAfterDate;

    //Create query
    var tipQuery = new Parse.Query(TipReport);

    //Filter by clientId
    tipQuery.equalTo('clientId', {
      __type: "Pointer",
      className: "Client",
      objectId: clientId
    });

    //Filter by date (before or after given date)
    isAfterDate ? tipQuery.greaterThan("createdAt", date) :
                  tipQuery.lessThan("createdAt", date);

    //If isAfterDate is false, query tips before said date in
    //descending order (newest to oldest, earliest date first);
    //otherwise, query tips after date in ascending order, but
    //reverse final results array or tips will be incorrectly
    //displayed from oldest to newest (tips in page 1 will be tips
    //corresponding to page 10, and vice versa)
    if (!isAfterDate) {
      tipQuery.descending("createdAt");
    }

    //Tell parse to include the user and client objects
    //instead of just passing the pointers.
    tipQuery.include('user');
    tipQuery.include('clientId');

    tipQuery.limit(10);

    if(!!data.tipsToSkip) {
      tipQuery.skip(data.tipsToSkip);
    }

    //Execute query
    tipQuery.find({
      success: function(tips){
        var totalTips = 0;

        //Reverse the array if the tips are in ascending
        //order(oldest to newest)
        if (isAfterDate) {
          tips.reverse();
        }

        var start = new Date().getTime();
        //Loop over the array to prepare the tip objects
        //for the front end
        for(var i = 0; i < tips.length; i++) {

          //Get the user from the tip. This works
          //because we are using tipQuery.include('user').
          //It doesn't need to reconnect to the database
          //to retreive the user that submitted the tip.
          var tipUser = tips[i].get('user')

          var passPhrase = passwordGenerator.generatePassword((!!tipUser? tipUser.attributes.username: tips[i].attributes.anonymousPassword), !tipUser);

          //Get the client object from the first tip to be
          //able to get the total tip count later on (all
          //tips have the same client).
          if(i===0) {
            totalTips = tips[i].get('clientId').attributes.totalTipCount;
          }
          //Convert tip from Parse to Javascript object
          tips[i] = JSON.parse(JSON.stringify(tips[i]));
          //If not an anonymous tip, get user information
          if(!!tipUser) {
            tips[i].firstName = encryptionManager.decrypt(passPhrase, tipUser.attributes.firstName.base64);
            tips[i].lastName = encryptionManager.decrypt(passPhrase, tipUser.attributes.lastName.base64);
            tips[i].username = tipUser.attributes.username;
            tips[i].phone = encryptionManager.decrypt(passPhrase, tipUser.attributes.phoneNumber.base64);
            tips[i].anonymous = false;
            tips[i].channel = "user_" + tipUser.id;
          }
          else {
            //Set tip to anonymous if the user was not found
            tips[i].firstName = "ANONYMOUS";
            tips[i].lastName = "";
            tips[i].anonymous = true;
          }

          //Prepare tip object with the values needed in
          //the front end; coordinates for map, tip control
          //number, and formatted date
          tips[i].center = {latitude: encryptionManager.decrypt(passPhrase, tips[i].crimePositionLatitude.base64), longitude: encryptionManager.decrypt(passPhrase, tips[i].crimePositionLongitude.base64)};
          tips[i].controlNumber = tips[i].objectId;
          var tempDate = (new Date(tips[i].createdAt));
          tempDate = tempDate.toDateString() + ' - ' + tempDate.toLocaleTimeString();
          tips[i].date = tempDate;
          tips[i].crimeDescription = tips[i].crimeDescription? encryptionManager.decrypt(passPhrase, tips[i].crimeDescription.base64): "";
          tips[i].crimeType = encryptionManager.decrypt(passPhrase, tips[i].crimeType.base64);
          tips[i].crimeListPosition = tips[i].crimeListPosition;
          tips[i].markers = [{
            id: tips[i].objectId,
            latitude: tips[i].center.latitude,
            longitude: tips[i].center.longitude,
            options: {
              draggable: false,
              title: "Crime Location",
              visible: true
            }
          }];
        }

        //Send the tips to the front end
        socket.emit('response-batch', {tips : tips, totalTipCount : totalTips});
      },
      error: function(error){
        //Tip fetching failed, emit response error
        //along with error object
        socket.emit('response-error', {error: error});
      }
    });

  });

  socket.on('request-media-url', function(data){

    //Get parseFile
    var parseFile = data.parseFile;
    //Generate password for decryption
    var passPhrase = passwordGenerator.generatePassword(data.passPhrase, data.anonymous);

    var url = parseFile.url;
    var filepath = parseFile.name;

    //Download file to server
    var file = fs.createWriteStream(filepath);
    var request = http.get(url, function(response) {
     response.pipe(file);
     file.on('finish', function() {
       //File finished downloading. Read file.
       fs.readFile(filepath, function(err, dataBuf){

         //Select the correct extension depending on file type.
         if(data.type === 'IMG') {
           filepath = '/temp/file.jpg';
         }
         else if(data.type === 'VID'){
            filepath = '/temp/file.mpg4';
         }
         else {
            filepath = '/temp/file.aac';
         }

         //Convert to base64 and decrypt.
         var fileB64 = dataBuf.toString('base64');
         var decrypt = encryptionManager.decrypt(passPhrase, fileB64);

         //Create buffer and write the decrypted file.
         var decodedFile = new Buffer(decrypt, 'base64');
         fs.writeFile('./public'+filepath, decodedFile, function(err) {
           //Delete the downloaded and encrypted file.
           fs.unlinkSync(parseFile.name);
         });

         //Send file url to front-end
         socket.emit('response-media-url', filepath);
       });
     });
    });
  });
  //Encrypt and send follow-up.
  socket.on('new-follow-up-notif', function(data){
    saveAndPushNotification(data.notificationData);
  });
});

//=========================================
//  SET UP ROUTING
//=========================================

//Login handler
app.post('/login', function(request, response){
  //TODO Sanitize user input
  var userId = request.body.userId;
  var password = request.body.password;
  Parse.User.logIn(userId, password, {
    success: function(user) {
      //Get Client to which user belongs to
      var clientQuery = new Parse.Query(Client);
      clientQuery.include("regions");
      clientQuery.include("mostWantedList");
      clientQuery.get(user.attributes.homeClient.id, {
        success: function(client){
          var answer = [];
          answer.push(user);
          answer.push(client);
          answer.push(client.get('regions'));
          response.send(200, answer);
        },
        error: function(object, error){
          response.send(400,error);
        }
      });
    },
    error: function(user, error) {
      response.send(400,error);
    }
  });
});

//Recieve new-tip event form Parse,
//and pass it along to front-end
app.post('/new-tip', function(request, response){
  var tip = request.body;
  var pass = tip.pass;
  if(pass=='bahamut'){
    io.sockets.emit('new-tip', {tip : tip});
    response.send(200);
  }
});

//Recieve a request for a video stream connection;
//get data form mobile client, save session info in
//Parse and pass on to front-end
app.post('/request-video-connection', function(request, response){

  //Check if password is valid
  if(request.body.password!=="bahamut"){
    return;
  }

  //Get data representing the mobile client
  var connection = JSON.parse(request.body.data);

  //Create OpenTok session
  opentok.createSession({mediaMode:"routed"}, function(error, session){

    //TODO
    //Handle Error when session could not be created
    if(error){
      response.send(400,error);
      return;
    }

    //Create the token that will be sent to the mobile client
    var clientToken = opentok.generateToken(session.sessionId, {
      role: 'publisher',
      expireTime: ((new Date().getTime()) + 36000),
      data: JSON.stringify(connection)
    });

    //Create the token that officer will use to connect via web
    var webToken = opentok.generateToken(session.sessionId, {
      role: 'moderator',
      data: JSON.stringify(connection.currentClientId)
    });

    //Prepare video session object
    var videoSession = new VideoSession();
    videoSession.set('status', 'pending');
    videoSession.set('sessionId', session.sessionId);
    videoSession.set('mobileClientToken', clientToken);
    videoSession.set('webClientToken', webToken);
    videoSession.set('latitude', connection.latitude);
    videoSession.set('longitude', connection.longitude);
    videoSession.set('mobileUser', {
      __type:"Pointer",
      className:"User",
      objectId:connection.userObjectId
    });
    videoSession.set('client', {
      __type:"Pointer",
      className:"Client",
      objectId:connection.currentClientId
    });

    //Save video session, respond to
    //mobile client with sessionId and token,
    //and pass connection on to front-end
    videoSession.save().then(function(videoSession){
      var stream = connection;
      stream.sessionId = session.sessionId;
      stream.connectionId = videoSession.id;
      stream.webClientToken = webToken;
      response.send(200, {
        objectId: videoSession.id,
        sessionId: session.sessionId,
        token: clientToken
      });
      io.sockets.emit('new-video-stream', {stream: stream});
    }, function(error, videoSession){
      //TODO
      //Handle error when couldn't save video session
      var err = error;
    });

  });

});

//Landing/login page
app.get('/', function(request, response){
  response.sendfile(__dirname+'/public/index.html');
});

//Base-case where page was not found, send 404 error
app.get('*', function(request, response){
  response.send(404,"Error 404: Not Found");
});

//=========================================
//  START WEB SERVER
//=========================================

//Start the server by listening in on a port.
//process.env.PORT is the default port environment,
//in this case used for AWS; port 80 is for local
//testing purposes. Log listening port.

server.listen((process.env.PORT || 80), function(){;
  console.log(notice('WEB SERVER RUNNING ON PORT %s\n'), server.address().port)
});

//=========================================
//  HELPER FUNCTIONS
//=========================================

function saveAndPushNotification(notificationData){
  var passPhrase = "";
  var query = new Parse.Query(Parse.User);
  query.get(notificationData.userId).

  then(function(user){
    var username = user.attributes.username;
    passPhrase = passwordGenerator.generatePassword(username);

    var notification = new PushNotification();
    notification.set("userId", notificationData.userId);
    notification.set("tipId", notificationData.controlNumber);

    notification.set('title', {
        __type: "Bytes",
        base64: encryptionManager.encrypt(passPhrase, notificationData.title)
    });

    notification.set('message', {
        __type: "Bytes",
        base64: encryptionManager.encrypt(passPhrase, notificationData.message)
    });

    if(notificationData.attachment){
      var encryptedFile = encryptionManager.encrypt(passPhrase, notificationData.attachment);
      var attachment = new Parse.File('file', {base64: encryptedFile});
      notification.set(notificationData.attachmentType, attachment);
    }

    return notification.save();
  }).

  then(function(notification){
    return pushNotification(notification);
  }, function(error){
    var err = error;
  }).

  then(function(){
    io.sockets.emit('follow-up-notif-sent');
  }, function(error){
    var err = error;
  });

};

//Sends the already saved notification to the user; if pushing
//failed, tries to revert save or continues as partial success
function pushNotification(notification){

  var pushChannels = ['user_'+notification.attributes.userId];
  return Parse.Push.send({
    channels: pushChannels,
    data: {
      alert: "New Follow-up Notification Available",
      badge:"Increment",
      sound: "cheering.caf",
      title: "Notification",
      pushId: notification.id,
      type:"follow-up"
    }
  });

};
