/*
  Chat class.

  Provides a client side interface that allows
  messages to be sent to the server and back.

  @param socket: a Socket.IO socket on which to act

*/

var Chat = function(socket){
  this.socket = socket;
};


/*
  Sends a message.

  @param room: the room to send the message to
  @param text: the body of the message
*/
Chat.prototype.sendMessage = function(room, text){
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
}

/*
  Allows the user to switch rooms (client chats).

  @param room: the room to switch to
*/
Chat.prototype.changeRoom = function(room){
  this.socket.emit('join', {
    newRoom: room
  });
}
