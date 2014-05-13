/*
*  Import required modules.
*/
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var Parse = require('parse').Parse;

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
      var errorMessage = "Invalid login parameters";
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
*  Start the server by listening in on specified port.
*
*  (alternative: process.env.PORT, instead of hard-coded port)
*/
app.listen((process.env.PORT || 80), function(){
  console.log("Server is now listening on port 80.");
});
