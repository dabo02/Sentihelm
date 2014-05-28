/*
  MobileClient class.

  Represents the smart phone that connects to the
  video streaming service.

  @param socket: the TCP connection on which to communicate.

*/
//TODO swap "bahamut" with actual secret key
var secretKey="bahamut";

var MobileClient = function(client, socket, callback){
  this.socket = socket;
  for(var key in client){
    this[key] = client[key];
  }
  if(!this.secret || this.secret!=secretKey){
    //throw error since not a valid client
    //(spoofing)
    //throw an error since key was not present/valid
    throw new Error("Key is not valid.");
  }
  if(!this.sessionId){
    //No session present.
    //Create a session instance field,
    //call the callback with false
    //in order to get a new session.
    //===========DEBUG==========
    console.log("NO SESSION AVAILABLE. GENERATING SESSION.\n");
    //==========================
    this.sessionId = '';
    callback(false);
  }
  else{
    //A session is present.
    //Pass the session ID to the callback
    //so it can save it server side.
    //===========DEBUG==========
    console.log("SESSION AVAILABLE. SESSION_ID: "+this.sessionId);
    //==========================
    callback(true);
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
