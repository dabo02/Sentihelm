/*
  MobileClient class.

  Represents the smart phone that connects to the
  video streaming service.

  @param socket: the TCP connection on which to communicate.

*/

var MobileClient = function(client, socket, callback){
  for(var key in client){
    this[key] = tempClient[key];
  }
  this.socket = socket;
  if(!this.secret){
    //TODO need to match 'secret' with my key ("!this.secret || this.secret!='key'")
    //TODO return false since not a valid client
    //(spoofing)
    //throw an error since key was not present/valid
    throw new Error("Key was not valid.");
  }
  if(!this.sessionId){
    //No session present.
    //Tell the callback you have none and it
    //should return the new session ID.
    this.sessionId = callback(null);
  }
  else{
    //A session is present.
    //Pass the session ID to the callback
    //so it can save it server side.
    callback(this.sessionId);
  }
};


// /*
//   Sends a message.
//
//   @param room: the room to send the message to
//   @param text: the body of the message
// */
// Chat.prototype.sendMessage = function(room, text){
//   var message = {
//     room: room,
//     text: text
//   };
//   this.socket.emit('message', message);
// }

/*
  Export the class for global (package only) use.
*/
module.exports = MobileClient;
