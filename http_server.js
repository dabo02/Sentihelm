var http = require('http');
var chatServer = require('./lib/chat_server.js');
var fs = require('fs');
var path = require ('path');
var mime = require('mime');
var cache = {};

/*Throws a 404 error code, along with a readable
message, indicating resource was not found.*/
function send404(response){
  response.writeHead(404, {'Content-Type' : 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

/*Send file, along with 200 status code (OK) and
  'content-type'.*/
function sendFile(response, filePath, fileContents){
  response.writeHead(200, {'Content-Type' : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

/*Returns a file if it's cached; otherwise,
  fetches it from disk and then serves it.

  Throws a 404 error code if file does not
  exist.*/
function serverStatic(response, cache, absPath){
  if(cache[absPath]){
    sendFile(response, absPath, cache[absPath]);
  }
  else{
    fs.exists(absPath, function(exists){
      if(exists){
        fs.readFile(absPath, function(error, data){
          if(error){
            send404(response);
          }
          else{
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      }
      else{
        send404(response);
      }
    });
  }
}

/*Create an http server that loads the
  corresponding page.*/
var server = http.createServer(function(request, response){
  var filePath = false;
  if(request.url=='/'){
    filePath = 'public/index.html';
  }
  else{
    filePath = 'public'+request.url;
  }
  var absPath = './'+filePath;
  serverStatic(response, cache, absPath);
});

/*Start listening in on port 3000.*/
server.listen(3000, function(){
  console.log("Server listening on port 3000.");
});

/*Start socket.io server.*/
chatServer.listen(server);
