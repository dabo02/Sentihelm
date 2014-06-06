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

//Import/Initialize socket.io
var io = require('socket.io')(server);

//Other imports
var net = require('net');
var Parse = require('parse').Parse;
var OpenTok = require('opentok');
var MobileClient = require('./lib/mobileclient');

//=========================================
//  ENVIRONMENT SETUP
//=========================================

//Set up parse.
var APP_ID="MpDMbPnCATUEf4FvXV1IwTX6Fq9G5tE6UWjlbNdO";
var JS_KEY="0Q5ibbPcsYPyOfuslRGwKWvE6YDKiBmX23yjnqQy";
Parse.initialize(APP_ID, JS_KEY);


//Create an appending log file (no overriding).
var logFile = fs.createWriteStream('./logs/express.log', {flag:'a'});

//Attach 'morgan' logger (logs express events) to express.
//Set the format to default, for full detials, and route
//the output to the write stream previously created
//(a log file).

//Attach a bodyParser in order to handle json and urlencoded
//bodies.

//Add the static middleware, which allows express to serve up
//static content in the specified directory (for CSS/JS).
app.use(morgan({format:'default', stream:logFile}));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));


//Set OpenTok key and secret. Create a new opentok object,
//which is used to manage sessions and tokens.
var otKey = '44755992';
var otSecret = '66817543d6b84f279a2f5557065b061875a4871f';
var opentok = new OpenTok.OpenTokSDK(otKey, otSecret);

//=========================================
//  SET UP ROUTING
//=========================================

//Login handler
app.post('/login', function(request, response){
  //TODO Sanitize user input
  var username = request.body.username;
  var password = request.body.password;
  Parse.User.logIn(username, password, {
    success: function(user) {
      var firstName = user.get('firstName');
      var lastName = user.get('lastName');
      response.sendfile(__dirname+'/public/streams.html');
    },
    error: function(user, error) {
      console.log("Error "+error.code+": "+error.message); //DEBUG
      response.send(200,error);
    }
  });
});

//Live Video stream page
app.get('/video_stream', function(request, response){
  response.sendfile(__dirname+'/public/browser_demo.html');
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
  console.log('TCP Client connected.\n');

  socket.on('data', function(data){
    console.log("RECIEVED FROM CLIENT:\n"+data.toString()+"\n");
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
          console.log("CREATED SESSION: "+sessionId+"\n");
          // Once session has been created, finalize the setup.
          finalizeConnection(client);
        });
      });
    }
    catch(error){
      console.log("ERROR: "+error);
      //TODO
      //DATA WAS NOT A JSON OBJECT,
      //OR INVALID KEY
    }
  });

  socket.on('end', function() {
    console.log('TCP Client disconnected.\n');
  });
});

tcpServer.listen(3000, function() {
  console.log('\nTCP Server is now listening in on port %s.', tcpServer.address().port);
});

//=========================================
//  START WEB SERVER
//=========================================

//Create and start the server by listening in on a port.
//'process.env.PORT' is the default port environment,
//in this case used for AWS; port 80 is for local
//testing purposes. Log listening port.

server.listen((process.env.PORT || 80), function(){;
  console.log("Web Server is now listening in on port %s.\n", server.address().port)
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
  console.log("CREATED CLIENT TOKEN:\n"+token+"\n");
  var answer = JSON.stringify({sessionId : client.sessionId, token : token});
  client.socket.write(answer);
  console.log("SESSION SENT: "+client.sessionId+"\n"+
  "\nCLIENT TOKEN SENT:\n"+token+"\n");
  var modToken = opentok.generateToken(client.sessionId, {
    role :'moderator',
    expireTime :(new Date().getTime()/1000)+(3600),
    data : client.username
  });
  //Duplicate the client to another object in order
  //to attach the moderator token and API key the
  //web app will use
  var connection = {};
  for(var key in client){
    connection[key] = client[key];
  }
  connection.modToken = modToken;
  conncetion.apiKey = otKey;
  io.emit('new stream', {connection : connection});
  console.log("MODERATOR TOKEN CREATED AND EMITTED:\n"+connection.modToken+"\n");
}
