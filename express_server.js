/*
*  Import required modules.
*/
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var Parse = require('parse').Parse;

/*
*  Set up parse.
*/
var APP_ID="MpDMbPnCATUEf4FvXV1IwTX6Fq9G5tE6UWjlbNdO";
var JS_KEY="0Q5ibbPcsYPyOfuslRGwKWvE6YDKiBmX23yjnqQy";
Parse.initialize(APP_ID, JS_KEY);

/*
*  Create a log file that'll be written
*  to by the 'morgan' logger - so as to
*  not write to the terminal. Set the
*  flag of the file to 'a' for appending
*  (not override).
*/
var fs = require('fs');
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
*  Add the static middleware, which allow express to serve up
*  static content in the specified directory (for CSS/JS).
*/
var app = express();
app.use(morgan({format:'default', stream:logFile}));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

/*
*  Set up routing.
*/

    //Landing/login page
app.get('/', function(request, response){
  response.sendfile(__dirname+'/public/index.html');
});

    //Login handler
app.post('/login', function(request, response){
  var username = request.body.username;
  var password = request.body.password;
  Parse.User.logIn(username, password, {
    success: function(user) {
      console.log("Succesfuly logged in: "+user.get('firstName')+" "+user.get('lastName'));
    },
    error: function(user, error) {
      console.log("ERROR: "+error);
    }
  });
});

    //Live Video stream page
app.get('/video_stream', function(request, response){
  response.sendfile(__dirname+'/public/browser_demo.html');
});

/*
*  Start the server by listening in on specified port.
*
*  (alternative: process.env.PORT, instead of hard-coded port)
*/
app.listen(8080, function(){
  console.log("Server is now listening on port 8080.");
});
