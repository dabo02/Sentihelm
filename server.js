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

//Import and initialize socket.io
var io = require('socket.io')(server);

//Other imports
var clc = require('cli-color');
var net = require('net');
var Parse = require('parse').Parse;
var OpenTok = require('opentok');
var MobileClient = require('./lib/mobileclient');


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

//Set up parse.
var APP_ID="Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE";
var JS_KEY="021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk";
Parse.initialize(APP_ID, JS_KEY);

//Set up Parse classes for queries
var TipReport = Parse.Object.extend("TipReport");
var Client = Parse.Object.extend("Client");
var VideoSession = Parse.Object.extend("VideoSession");

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

    //Get filtering values: by clientId, date
    //and tips after or before given date
    var clientId = data.clientId
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

    //Execute query
    tipQuery.find({
      success: function(tips){
        var totalTips = 0;

        //Reverse the array if the tips are in ascending
        //order(oldest to newest)
        if (isAfterDate) {
          tips.reverse();
        }

        //Loop over the array to prepare the tip objects
        //for the front end
        for(var i = 0; i < tips.length; i++) {

          //Get the user from the tip. This works
          //because we are using tipQuery.include('user').
          //It doesn't need to reconnect to the database
          //to retreive the user that submitted the tip.
          var tipUser = tips[i].get('user');

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
            tips[i].firstName = tipUser.attributes.firstName;
            tips[i].lastName = tipUser.attributes.lastName;
            tips[i].phone = tipUser.attributes.phoneNumber;
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
          tips[i].center = {latitude: tips[i].crimePositionLatitude, longitude: tips[i].crimePositionLongitude};
          tips[i].controlNumber = tips[i].objectId;
          var tempDate = (new Date(tips[i].createdAt));
          tempDate = tempDate.toDateString() + ' - ' + tempDate.toLocaleTimeString();
          tips[i].date = tempDate;
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
    }, function(videoSession, error){
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
//  TCP SERVER FOR VIDEOSTREAMING
//=========================================

//The function passed to 'net.createServer'
//is the 'connection' event listener; notify
//that client connected and set callbacks
//for events.

//A stringified JSON object is recieved, parsed,
//then passed to a MobileClient object - along
//with the active socket and a callback to handle
//session generation - in order to create the
//object representation of that mobile client.

//If the string recieved is not a valid stringified
//JSON, or the secret handshaking key is invalid, an
//error is thrown.

var tcpServer = net.createServer(function(socket){
  //Client has connected.
  console.log(yellow("TCP") +" : "+green("CLIENT CONNECTED\n"));

  socket.on('data', function(data){
    console.log(notice("RECIEVED FROM CLIENT\n")+data.toString()+"\n");
    try{
      var tempClient = JSON.parse(data.toString());
      var client = new MobileClient(tempClient, socket, function(){
        var token = '';
        var modToken = '';
        //The session will attempt to transmit streams directly between clients.
        //If clients cannot connect, the session uses the OpenTok TURN server
        opentok.createSession({mediaMode:"relayed"},function(error, sessionId){
          if (error) {
            throw new Error("Session creation failed.");
          }
          //Created session will be asigned to this MobileClient's instance
          //sessionId parameter.
          client.sessionId = sessionId;
          console.log(notice("CREATED SESSION\n")+sessionId+"\n");
          // Once session has been created, finalize the setup.
          finalizeConnection(client);
        });
      });
    }
    catch(error){
      console.log(red("ERROR - ")+maroon(error)+"\n");
      //TODO
      //DATA WAS NOT A JSON OBJECT,
      //OR INVALID KEY
    }
  });

  socket.on('end', function() {
    console.log(yellow("TCP") +" : "+red("CLIENT DISCONNECTED\n"));
  });
});

tcpServer.listen(3000, function() {
  console.log(notice('TCP SERVER RUNNING ON PORT %s\n'), tcpServer.address().port);
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

//Generate both client and moderator tokens,
//create and send a stringified JSON answer
//which will contain the client's token and
//session Id. Tokens will be valid for 1 hour
//only. Log all events and save connection.

function finalizeConnection(client){
  var token = opentok.generateToken(client.sessionId, {
    role :'publisher',
    expireTime :(new Date().getTime()/1000)+(3600),
    data : client.username
  });
  console.log(notice("CREATED CLIENT TOKEN\n")+token+"\n");
  var answer = JSON.stringify({sessionId : client.sessionId, clientToken : token});
  client.socket.write(answer);
  console.log(notice("SESSION SENT\n")+client.sessionId+"\n");
  console.log(notice("CLIENT TOKEN SENT\n")+token+"\n");
  var modToken = opentok.generateToken(client.sessionId, {
    role :'moderator',
    expireTime :(new Date().getTime()/1000)+(3600),
    data : client.username
  });

  //Create a new object which will contain needed info
  //for front end app
  var connection = {};
  connection.username = client.username;
  connection.latitude = client.latitude;
  connection.longitude = client.longitude;
  connection.sessionId = client.sessionId;
  connection.modToken = modToken;
  connection.apiKey = otKey;
  io.sockets.emit('new stream', {connection : connection});
  console.log(notice("MODERATOR TOKEN CREATED AND EMITTED:\n")+connection.modToken+"\n");
}
