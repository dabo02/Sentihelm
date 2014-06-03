/*
  MobileClient class.

  Represents the smart phone that connects to the
  video streaming service.
*/

//TODO swap "bahamut" with actual secret key
//Secret key; used to verify authenticity of connecting clients
var secretKey = "bahamut";

/*
  CONSTRUCTOR
  -----------

  @param client: the JSON object passed in the initial communication;
                 MobileClient iterates over this object and copies all
                 variables and values.

  @param socket: the TCP connection on which to communicate.

  @param callback: the callback defined when an instance is created;
                   handles the sessionId creation and/or saving that
                   session to the server.

*/
var MobileClient = function(client, socket, callback){
  this.socket = socket;
  for(var key in client){
    this[key] = client[key];
  }
  //!!!DEBUG!!!
  console.log("\nTESTING:\n"+this.sessionId+"\n");
  //!!!!!!!!!!!
  if(!this.secret || this.secret!=secretKey){
    //throw error since not a valid client (spoofing)
    throw new Error("Key is not valid.");
  }
  if(!this.sessionId){
    //No session present.
    //Create a session instance field,call the callback
    //with false in order to get a new session.
    console.log("NO SESSION AVAILABLE. GENERATING NEW SESSION.\n");
    this.sessionId = '';
    callback(false);
  }
  else{
    //A session is present.
    //Execute the callback with true
    //so it can save it server side.
    console.log("SESSION AVAILABLE. SESSION_ID: "+this.sessionId);
    callback(this);
  }
};


/*
  Sends a message via the client's socket.

  @param message: the message to send.
*/
MobileClient.prototype.sendMessage = function(message){
  this.socket.write(message);
}

//Export the class for global (package only) use.
module.exports = MobileClient;
