var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());


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

app.listen(8080, function(){
  console.log("Server is now listening on port 8080.");
});
