/*
*=========================================
*  IMPORTS
*=========================================
*/
//Imports for web server
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');

//Imports for web socket
var http = require('http');
var socketServer = http.createServer(app);
var io = require('socket.io').listen(socketServer);

//Others
var net = require('net');
var Parse = require('parse').Parse;
/*
*=========================================
*/


/*
*=========================================
*  ENVIRONMENT SETUP
*=========================================
*/

/*
*  Set up parse.
*/
var APP_ID="MpDMbPnCATUEf4FvXV1IwTX6Fq9G5tE6UWjlbNdO";
var JS_KEY="0Q5ibbPcsYPyOfuslRGwKWvE6YDKiBmX23yjnqQy";
Parse.initialize(APP_ID, JS_KEY);

/*
*  Create an appending log file (no overriding).
*/
var logFile = fs.createWriteStream('./logs/express.log', {flag:'a'});

/*
*  Create an express server.
*
*  Attach 'morgan' logger (logs express events) to express.
*  Set the format to default, for full detials, and route
*  the output to the write stream previously created
*  (a log file).
*
*  Attach a bodyParser in order to handle json and urlencoded
*  bodies.
*
*  Add the static middleware, which allows express to serve up
*  static content in the specified directory (for CSS/JS).
*/
var app = express();
app.use(morgan({format:'default', stream:logFile}));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
/*
*=========================================
*/


/*
*=========================================
*  SET UP ROUTING
*=========================================
*/
//Login handler
app.post('/login', function(request, response){
  //TODO Sanitize user input
  var username = request.body.username;
  var password = request.body.password;
  Parse.User.logIn(username, password, {
    success: function(user) {
      var firstName = user.get('firstName');
      var lastName = user.get('lastName');
      console.log("Succesfuly logged in: "+firstName+" "+lastName);
      response.sendfile(__dirname+'/public/browser_demo.html');
    },
    error: function(user, error) {
      console.log("Error "+error.code+": "+error.message);
      response.send(500, error);
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
/*
*=========================================
*/

/*
*=========================================
*  TCP SERVER FOR VIDEOSTREAMING
*=========================================
*
*  The function passed to 'net.createServer'
*  is the 'connection' event listener; notify
*  that client connected and set callbacks
*  for events.
*/
var tcp_server = net.createServer(function(client) {
console.log('TCP Client connected.\n');

client.write('TESTING');

client.on('data', function(data){
  console.log(data.toString());
});

client.on('end', function() {
  console.log('TCP Client disconnected.\n');
});

client.pipe(client);
});

tcp_server.listen(3000, function() {
  console.log('\nTCP Server is now listening in on port %s.', tcp_server.address().port);
});
/*
*=========================================
*/

/*
*=========================================
*  START WEB SERVER
*=========================================
*
*  Create and start the server by listening in on a port.
*  'process.env.PORT' is the default port environment,
*  in this case used for AWS; port 80 is for local
*  testing purposes. Log listening port.
*/
var server = app.listen((process.env.PORT || 80), function(){;
  console.log("Web Server is now listening in on port %s.\n", server.address().port)
});
/*
*=========================================
*/
