//=========================================
//  TIP FEED UI SETUP
//=========================================

//Connect to server side socket
var socket = io.connect('http://localhost:80');

//Catch event when new tip arrives server-side.
//Extract all tip info from received JSON
socket.on('new tip', function(newTip){
  var tip = newTip.tip;
  var name = tip.firstName +" "+tip.lastName;
  var crimeType = tip.crimeType;
  var crimeImage;
  switch(crimeType){
  case 'Assault':
    crimeImage = "http://199.85.204.123/fb_images/0.png";
    break;
  case 'Child Abuse':
    crimeImage = "http://199.85.204.123/fb_images/1.png";
    break;
  case 'Domestic Violence':
    crimeImage = "http://199.85.204.123/fb_images/2.png";
    break;
  case 'Drugs':
    crimeImage = "http://199.85.204.123/fb_images/3.png";
    break;
  case 'Murder':
    crimeImage = "http://199.85.204.123/fb_images/4.png";
    break;
  case 'Animal Abuse':
    crimeImage = "http://199.85.204.123/fb_images/5.png";
    break;
  case 'Robbery':
    crimeImage = "http://199.85.204.123/fb_images/6.png";
    break;
  case 'Rape':
    crimeImage = "http://199.85.204.123/fb_images/7.png";
    break;
  default:
    crimeImage = "http://199.85.204.123/fb_images/8.png"
  }
  var phone = tip.phone;
  var channel = tip.channel;
  var videoUrl = tip.videoUrl;
  var imageUrl = tip.imageUrl;
  var audioUrl = tip.audioUrl;
  var crimeDescription = tip.crimeDescription;
  var mapId = tip.objectId;
  var latitude = tip.latitude;
  var longitude = tip.longitude;
  //Replace HTML placeholders with extracted values
  var tipHTML = '<li class="tip"><div class="tip-header"><span>'+name+'</span></div>'+
  '<div class="tip-body"><div class="left"><img src="'+crimeImage+'"/>'+
  '<span>'+crimeType+'</span><div class="contact-info">CONTACT USER\n<span'+
  'class="contact-number">'+phone+'</span><button id="'+channel+'" class="notif'+
  'ication-button">Send Notification</button></div></div><div class="center">'+
  '<div class="attachments"><a href="'+videoUrl+'"><img src="./'+
  'resources/images/videoAtt.png"/></a><a href="'+imageUrl+'"><img' +
  ' src="./resources/images/cameraAtt.png"/></a><a href="'+audioUrl+'"><img'+
  ' src="./resources/images/audioAtt.png"/></a></div><div class="crime'+
  '-description"><span>'+crimeDescription+'</span></div></div><div id="'+mapId+
  '"class="right"></div></div></li>';
  //Add tip to top of tip feed
  $('#feed').prepend(tipHTML);
  renderMap(mapId, latitude, longitude);
  //TODO DISABLE LINKS WITH NO ATTACHMENTS
});

//=========================================
//  HELPER FUCTIONS
//=========================================
function renderMap(mapId,latitude, longitude){
  var location = new google.maps.LatLng(latitude, longitude);
  var mapCanvas = document.getElementById(mapId);
  var mapOptions = {
    center: location,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  var map = new google.maps.Map(mapCanvas, mapOptions);
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: 'User Location'
  });
}

//=========================================
//  JQUERY
//=========================================
$(document).ready(function(){

});
