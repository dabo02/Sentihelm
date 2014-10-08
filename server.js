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
// var RNCryptor = require('./lib/rncryptor.js');
// var sjcl = require('sjcl');
// var crypto = require('crypto');
var AesUtil = require('./lib/AesUtil.js');


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


//Set OpenTok key and secret. Create a new opentok object,
//which is used to manage sessions and tokens.
var otKey = '44755992';
var otSecret = '66817543d6b84f279a2f5557065b061875a4871f';
var opentok = new OpenTok.OpenTokSDK(otKey, otSecret);

//Array that holds all current tips
var tipArray = [];

//Setup socket.io that communicates with front end
io.on('connect', function(socket){

  //Front-end requested a new batch of tips;
  //get query data and fetch
  socket.on('request-batch', function(data){

    //********************TESTING ENCRYPTION Get Message from Parse********************************************/



    // var TestingEncryption = Parse.Object.extend("TestingEncryption");
    // var query = new Parse.Query(TestingEncryption);
    // query.get("LUm1XE6w7G", {
    //   success: function(object) {
    //     // The object was retrieved successfully.
    //     var code = JSON.parse(JSON.stringify(object)).dataObject;
    //
    //     var hashes = crypto.getHashes();
    //
    //     var AESCrypt = {};
    //
    //     AESCrypt.decrypt = function(cryptkey, iv, encryptdata) {
    //         var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv);
    //         return Buffer.concat([
    //             decipher.update(encryptdata),
    //             decipher.final()
    //         ]);
    //     };
    //
    //     AESCrypt.encrypt = function(cryptkey, iv, cleardata) {
    //         var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv);
    //         return Buffer.concat([
    //             encipher.update(cleardata),
    //             encipher.final()
    //         ]);
    //     };
    //
    //     var cryptkey = crypto.createHash('sha256').update('Nixnogen').digest(),
    //     iv = new Buffer('a2xhcgAAAAAAAAAA'),
    //     // buf = new Buffer("Here is some data for the encrypt"), // 32 chars
    //     buf = new Buffer("hello"), // 32 chars
    //     enc = AESCrypt.encrypt(cryptkey, iv, buf);
    //
    //     var test = "AwHnUKnDtUI+5B+BsWujFeLd9oeq/I+AynoonStWeE8jz09fwwEjkzAxcLovA0ARbm+sgUlt8Yk+g4k95iPqjzHeQhmw0SJn1Aj9LZEgF/hxww=="
    //     var test2 = new Buffer(code.base64, 'base64');
    //     // var buf = new Buffer('aGVsbG8=', 'base64');
    //     var dec = AESCrypt.decrypt(cryptkey, iv, test2);
    //
    //     console.log("encrypt length: ", enc.length);
    //     console.log("encrypt in Base64:", enc.toString('base64'));
    //     console.log("decrypt all: " + dec.toString('utf8'));
    //
    //
    //   },
    //   error: function(object, error) {
    //     // The object was not retrieved successfully.
    //     // error is a Parse.Error with an error code and message.
    //   }
    // });


    //********************TESTING ENCRYPTION #1 RNCryptor ***********************************/

    // var message = "thepassword";
    // var decryptionTest = function(vector) {
    //   var a = sjcl.random.randomWords(2, 0);
    //   var b = sjcl.random.randomWords(2, 0);
    //   var c = sjcl.random.randomWords(4, 0);
    //   var ciphertext = RNCryptor.Encrypt("helloworld",
    //                                      sjcl.codec.hex.toBits(message),
    //                                      {});
    //
    //   var str = sjcl.codec.hex.fromBits(ciphertext);
    //
    //   var plaintext = RNCryptor.Decrypt("helloworld",
    //                                     sjcl.codec.hex.toBits(str),
    //                                      {});
    //
    //   var decodedText = sjcl.codec.hex.fromBits(plaintext);
    //   if(decodedText === message) {
    //     console.log("*Encryption/decryption succesfull!!!");
    //   }
    // };

    // var decryptionTest = function(vector) {
    //   var ciphertext = RNCryptor.Encrypt(vector["password"],
    //                                      sjcl.codec.hex.toBits(vector["plaintext_hex"].replace(/\s/g,'')),
    //                                      { "encryption_salt": sjcl.codec.hex.toBits(vector["enc_salt_hex"].replace(/\s/g,'')),
    //                                        "hmac_salt": sjcl.codec.hex.toBits(vector["hmac_salt_hex"].replace(/\s/g,'')),
    //                                        "iv": sjcl.codec.hex.toBits(vector["iv_hex"].replace(/\s/g,''))
    //                                      });
    //
    //   var ciphertext_hex = sjcl.codec.hex.fromBits(ciphertext);
    //   if (ciphertext_hex === vector["ciphertext_hex"].replace(/\s/g,'')) {
    //     console.log('Encoding succesfull.');
    //   }
    //
    //   var plaintext = RNCryptor.Decrypt(vector["password"],
    //                                     vector["ciphertext_hex"].replace(/\s/g,''),
    //                                      { "encryption_salt": sjcl.codec.hex.toBits(vector["enc_salt_hex"].replace(/\s/g,'')),
    //                                        "hmac_salt": sjcl.codec.hex.toBits(vector["hmac_salt_hex"].replace(/\s/g,'')),
    //                                        "iv": sjcl.codec.hex.toBits(vector["iv_hex"].replace(/\s/g,''))
    //                                      });
    //
    //   var decodedText = sjcl.codec.hex.fromBits(plaintext);
    //   if(decodedText === vector["plaintext_hex"].replace(/\s/g,'')) {
    //     console.log("*Encryption/decryption succesfull!!!");
    //   }
    // };

    // var vector = {"title":"Exactly one block","version":"3","password":"thepassword","enc_salt_hex":"0102030405060700","hmac_salt_hex":"0203040506070801","iv_hex":"030405060708090a0b0c0d0e0f000102","plaintext_hex":"0123456789abcdef","ciphertext_hex":"03010102 03040506 07000203 04050607 08010304 05060708 090a0b0c 0d0e0f00 01020e43 7fe80930 9c03fd53 a475131e 9a1978b8 eaef576f 60adb8ce 2320849b a32d7429 00438ba8 97d22210 c76c35c8 49df"};
    // var vector = {"title":"Short password","version":"3","password":"thepassword","salt_hex":"0203040506070801","key_hex":"0ea84f52 52310dc3 e3a7607c 33bfd1eb 580805fb 68293005 da21037c cf499626"};
    // var vector = {"title":"More than one block","version":"3","password":"thepassword","enc_salt_hex":"0203040506070001","hmac_salt_hex":"0304050607080102","iv_hex":"0405060708090a0b0c0d0e0f00010203","plaintext_hex":"0123456789abcdef 01234567","ciphertext_hex":"0301020304050607000103040506070801020405060708090a0b0c0d0e0f00010203e01bbda5df2ca8adace38f6c588d291e03f951b78d3417bc2816581dc6b767f1a2e57597512b18e1638f21235fa5928c"};
    // decryptionTest(vector);


    //********************TESTING ENCRYPTION #3 ********************************************/

    // var plainText = 'AwEndQgaWN3YtajG9FmC/1ojIouGFka6NPNkD+PVLLs3mOt+lliLdJ2iCPw5EaY8UiXlKj3Ni4ANAtPeX9XLYMcK4LQRM/3MvFz/yD7+PGPW7A==';
  /*  var plainText = 'hola pepe';
    var pass = 'helloworld'; // helloworld in base64: aGVsbG93b3JsZA==
    var cipher1 = crypto.createCipher('aes-256-cbc', pass);
    var cipherText1 = cipher1.update(plainText, 'ascii','base64');
    cipherText1 += cipher1.final('binary');

    console.log('plainText:' + plainText);
    console.log('cipherText length:' + cipherText1.length);
    console.log("cipherText:" + cipherText1);

    var decipher1 = crypto.createDecipher('aes-256-cbc', pass);
    var result1 = decipher1.update(cipherText1, 'base64', 'ascii');
    // var result1 = decipher1.update(plainText, 'base64', 'ascii');
    result1 += decipher1.final('ascii');

    console.log('result:' + result1);

    */
    //*************************************************************************************/
    // var iv = "F27D5C9927726BCEFE7510B1BDD3D137";
    // var salt = "3FF2EC019C627B945225DEBAD71A01B6985FE84C95A70EB132882F88C0A59A55";
    // var plainText = "hola pepe";
    // // var plainText = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy "
    // //   + "eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed "
    // //   + "diam voluptua. At vero eos et accusam et justo duo dolores et ea "
    // //   + "rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem "
    // //   + "ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur "
    // //   + "sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et "
    // //   + "dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam "
    // //   + "et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea "
    // //   + "takimata sanctus est Lorem ipsum dolor sit amet.";
    // var keySize = 256;
    // var iterations = iterationCount = 10000;
    // var passPhrase = "helloworld";
    //
    // var aesUtil = new AesUtil(keySize, iterationCount);
    // var encrypt = aesUtil.encrypt(salt, iv, passPhrase, plainText);
    //
    // // var areEqual = encrypt === cipherText;
    //
    // // var aesUtil = new AesUtil(keySize, iterationCount)
    // var decrypt = aesUtil.decrypt(salt, iv, passPhrase, encrypt);
    //
    // areEqual = decrypt === plainText;



    //*************************************************************************************/
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

        //TODO REMOVE
        //Log how many tips have been found
          console.log(tips.length + " tips found.");

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

          // //Copy media url if available.
          // !!tips[i].attachmentVideo? tips[i].videoUrl = tips[i].attachmentVideo.url: undefined;
          // !!tips[i].attachmentAudio? tips[i].audioUrl = tips[i].attachmentAudio.url: undefined;
          // !!tips[i].attachmentPhoto? tips[i].imageUrl = tips[i].attachmentPhoto.url: undefined;
        }

        console.log('Total tips for client: '+totalTips);
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
          // user.attributes.homeClient = client;
          response.send(200, answer);
        },
        error: function(object, error){
          response.send(400,error);
        }
      });
      // response.send(200, user);
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

// //Recieve tips from Parse
// app.post('/tips', function(request, response){
//   var tip = request.body;
//   var pass = tip.pass;
//   if(pass=='bahamut'){
//     tipArray.unshift(tip);
//     io.sockets.emit('new tip', {tip : tip});
//     response.send(200);
//   }
// });

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
        //A The session will attempt to transmit streams directly between clients.
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

tcpServer.listen(3030, function() {
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
  var answer = JSON.stringify({sessionId : client.sessionId, token : token});
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
