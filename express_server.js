/*
*  Import required modules
*/
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

/*
*  Create an express server.
*
*  Attach 'morgan' object - a logger (log express events).
*  Might want to remove it, or pipe it to file.
*
*  Attach a bodyParser in order to handle json and urlencoded
*  bodies.
*
*  Add the static middleware, which allow express to serve up
*  static content in the specified directory (for CSS/JS).
*/
var app = express();
app.use(morgan());
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
  console.log("Username: "+username="\nPassword: "+password);
});

//TESTING: CHANGE TO SENTINEL LIVE VIDEO STREAM
app.get('/opentok', function(request, response){
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
