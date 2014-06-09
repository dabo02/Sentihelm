//=========================================
//  STREAMS UI SETUP
//=========================================
var session;
var videoStreams = [];
var activeStream = $('active-stream');
var socket = io('http://localhost:80');
socket.on('new stream', function (connection) {
  console.log(connection);
  //Get actual stream object
  var stream = connection.connection;
  //Initialize session
  var session = OT.initSession(stream.apiKey, stream.sessionId);
  //Once connected, add an event listener for when the web
  //app connects to the session; give it a callback to call
  //one the event triggers - sessionConnectedHandler(), which
  //subscribes to the mobile client, the only other user in the session
  session.addEventListener('sessionConnected', sessionConnectedHandler);
  session.connect(stream.modToken, function(error){
    if(error){
      //TODO
      //HANDLE ERROR WHEN UNABLE
      //TO CONNECT TO SESSION
      console.log(error);
    }
    else{
      //TODO
      //CONNECTED SUCCESFULY
      //COULD ADD EXTRA FUNCTIONALITY HERE
    }
  });
  //Add the username to the top of the active streams list
  $('#streams-list').prepend('<li>'+stream.username+'</li>');
});
//Load client location map
google.maps.event.addDomListener(window, 'load', initializeMap);

//=========================================
//  HELPER FUNCTIONS
//=========================================

//Launched once the web app has succesfully connected
//to the session; subscribes to the mobile client
//publishing to the active session
function sessionConnectedHandler(event){
  var activeStream = $('#active-stream');
  session.subscribe(event.streams[0], activeStream);
}

//Initialize the google map that shows the client's location
function initializeMap() {
  var lat;
  var long;
  var location = new google.maps.LatLng(18,-66);
  var mapOptions = {
    zoom: 14,
    center: location
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: 'Client Location'
  });
}

//=========================================
//  JQUERY
//=========================================

$(document).ready(function(){
  //Once a chat message is sent, write it to the
  //socket, append the message to the chat-log,
  //wipe the input field and scroll to bottom
  $('#send-button').on('click',function(event){
    event.preventDefault();
    var log = $('#messages');
    var message = $('#message-text').val();
    var newMessage = '<li>'+message+'</li>'
    if(message!=null){
      //TODO SEND MESSAGE VIA SOCKET
      log.append(newMessage);
      $('#message-text').val('');
      $("#chat-log").animate({scrollTop: $('#chat-log').offset().top-30});
    }
  });
});
