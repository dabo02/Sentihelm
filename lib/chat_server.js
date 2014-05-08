var socketio = require('socket.io');
var io;
var currentRoom = {};
var mobileClient;
var officerClient;

/*Export 'listen' function:

  When a connection is triggered, add that
  user to the "Lobby" room and assign a message
  handler for that connection.*/
exports.listen = function(server){
  //TODO ADD LOGIC FOR DISTINGUISHING CLIENTS
  io = socketio.listen(server);
  io.set('log level', 1);
  io.sockets.on('connection', function (socket){
    //TODO ADD LOGIC TO ADD CLIENTS TO NEW ROOMS
    // AND LET OFFICERS DECIDE WHAT ROOM TO GO TO
    joinRoom(socket,'Lobby');
    handleMessaging(socket);
  });
}


//HELPER FUNCTIONS

/*When a message is sent, broadcast it to
  everyone in the room.*/
function handleMessaging(socket){
  socket.on('message', function(message){
    socket.broadcast.to(message.room).emit('message', {
      text: "Person: "+message.text
    });
  });
}

/*Allow users to join/create rooms.*/
function handleRoomJoining(socket){
  socket.on('join', function (room){
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  })
}

/*Alert the room that the client has left the
  conversation.*/
function alertClientDisconnect(socket, room){
  socket.on('disconnect', function(){
    socket.broacast.to(room).emit('message', {
      text: "PERSON has left the conversation."
    });
  });
}

/*Join a room and broadcast the event to
  said room.*/
function joinRoom(socket, room){
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', {room:room});
  socket.broadcast.to(room).emit('message', {
    text: "PERSON has joined the conversation."
  });
}
