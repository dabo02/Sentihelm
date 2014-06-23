//=========================================
//  TIP FEED UI SETUP
//=========================================

//Global var used to check if modal is active
var modalActive = false;
//Connect to server side socket
// var socket = io.connect('http://localhost:80');
var socket = io.connect('http://sentihelm.elasticbeanstalk.com');
//Initialize Parse
Parse.initialize("Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE", "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk");


//Catch event when new tip arrives server-side.
//Extract all tip info from received JSON
socket.on('new tip', function(newTip){
  var tip = newTip.tip;
  var objectId = tip.objectId;
  var controlNumber = tip.controlNumber;
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
  if(crimeDescription==undefined){
    crimeDescription="";
  }
  var latitude = tip.latitude;
  var longitude = tip.longitude;
  var anonymous = tip.anonymous;
  var tipHTML;
  //Replace HTML placeholders with extracted values
  if(anonymous){
    tipHTML = '<li class="tip"><div class="tip-header"><span>'+'ANONYMOUS'+'</span>'+
    '<div id="'+objectId+'" class="control-number anon">'+controlNumber+'</div>'+
    '</div><div class="tip-body"><div class="left"><img src="'+crimeImage+'"/>'+
    '<br><span>'+crimeType+'</span></div><div class="center">'+
    '<div class="attachments"><a id="videoAtt" href="'+videoUrl+'"><img src="./'+
    'resources/images/videoAtt.png"/></a><a id="imageAtt" href="'+imageUrl+'"><img' +
    ' src="./resources/images/imageAtt.png"/></a><a id="audioAtt" href="'+audioUrl+'"><img'+
    ' src="./resources/images/audioAtt.png"/></a></div><div class="crime'+
    '-description"><span>'+crimeDescription+'</span></div></div><div '+
    'class="right"></div></div></li>';
  }
  else{
    tipHTML = '<li class="tip"><div class="tip-header"><span>'+name+'</span>'+
    '<div id="'+objectId+'" class="control-number">'+controlNumber+'</div>'+
    '</div>'+'<div class="tip-body"><div class="left"><img src="'+crimeImage+'"/>'+
    '<br><span>'+crimeType+'</span><div class="contact-info">CONTACT USER\n<span '+
    'class="contact-number">'+phone+'</span><button id="'+channel+'"'+
    'class="notification-button">Send Notification</button></div></div><div class="center">'+
    '<div class="attachments"><a id="videoAtt" href="'+videoUrl+'"><img src="./'+
    'resources/images/videoAtt.png"/></a><a id="imageAtt" href="'+imageUrl+'"><img' +
    ' src="./resources/images/imageAtt.png"/></a><a id="audioAtt" href="'+audioUrl+'"><img'+
    ' src="./resources/images/audioAtt.png"/></a></div><div class="crime'+
    '-description"><span>'+crimeDescription+'</span></div></div><div '+
    'class="right"><div class="map-canvas" id="'+controlNumber+'"></div></div></div></li>';
  }
  //Add tip to top of tip feed
  $('#feed').prepend(tipHTML);
  var currentTip = $('.tip').first();
  //If tip is anonymous, edit CSS and map content
  if(anonymous){
    $(currentTip).find('.tip-header span').css("color", "#ff6600");
    $(currentTip).css("border","0.1em solid #ff6600");
    var rightDiv = $(currentTip).find('.tip-body').find('.right');
    rightDiv.html('NO LOCATION AVAILABLE');
    rightDiv.addClass("no-location");
  }
  currentTip.hide().slideDown(750, function(){
    //Only display map if user is not anonymous
    if(!anonymous){
      //Alternate method that assings unique id to each
      //map view; might be useful when dealing with tip queue
      // renderMap(mapId, latitude, longitude);
      renderMap(latitude, longitude);
      if(modalActive){
        $('.map-canvas').css("background-color","black");
        $('.map-canvas').css("opacity","0.5");
      }
    }
  });
  validateAttachments();
});


//=========================================
//  JQUERY
//=========================================
$(document).ready(function(){
  //Hide the notification modal once page loads
  $('.notification-modal').hide();

  //Open up the modal that sends push notifications to mobile users
  $('#feed').on('click', '.notification-button',function(){
    modalActive=true;
    $('.map-canvas').css("background-color","black");
    $('.map-canvas').css("opacity","0.5");
    $('.dimmer').addClass('visible');
    var userName = $(this).parent().parent().parent().siblings('.tip-header').find('span').text();
    $('.modal-title span').html('Contact '+userName);
    $('.notification-modal').slideDown(500, function(){
      $('#notification-message').focus();
    });
  });

  //Send push notification
  //TODO Display loading icon and check if notification was sent
  $('.modal-send').on('click', function(){
    var message = $('#notification-message').val();
    var userChannel = $('.notification-button').attr('id');
    var userId = $('.control-number').attr('id');
    Parse.Push.send(
      {
        channels: [ userChannel ],
        data: {
          alert: message,
          badge:"Increment",
          sound: "cheering.caf"
        }
      },
      {
        success: function() {
          var PushNotification = Parse.Object.extend("PushNotifications");
          var notification = new PushNotification();
          notification.set("userId", userId);
          notification.set("alert", message);
          notification.save(null, {
            success : function(notification){
              closeModal();
              console.log(notification);
            },
            error : function(notification, error){
              console.log(error);
            }
          });
        },
        error: function(error) {
          console.log("FAILED: "+error);
        }
      });
  });

  //On click, close push notification modal
  $('.close-modal').on('click', closeModal);

  //Change attachment image to hover state
  $('#feed').on('mouseenter','a',function(){
    var attachmentLink = $(this).attr('id');
    var attchImg = $(this).find('img');
    if(attachmentLink=='videoAtt'){
      attchImg.attr('src','./resources/images/videoAttHover.png');
    }
    else if(attachmentLink=='imageAtt'){
      attchImg.attr('src','./resources/images/imageAttHover.png')
    }
    else if(attachmentLink=='audioAtt'){
      attchImg.attr('src','./resources/images/audioAttHover.png')
    }
  });

  //Change attachment image to default state
  $('#feed').on('mouseleave','a',function(){
    var attachmentLink = $(this).attr('id');
    var attchImg = $(this).find('img');
    if(attachmentLink=='videoAtt'){
      attchImg.attr('src','./resources/images/videoAtt.png');
    }
    else if(attachmentLink=='imageAtt'){
      attchImg.attr('src','./resources/images/imageAtt.png')
    }
    else if(attachmentLink=='audioAtt'){
      attchImg.attr('src','./resources/images/audioAtt.png')
    }
  });
});


//=========================================
//  HELPER FUCTIONS
//=========================================

//Reders google map with provided coordinates
//in the rightmost division of a tip
function renderMap(latitude, longitude){
  var location = new google.maps.LatLng(latitude, longitude);
  //Might use this when building tip queue:
  //var mapCanvas = document.getElementById(mapId);
  var mapCanvas = $('.tip').first().find('.tip-body').find('.map-canvas')[0];
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

//Checks attachments to see if they are available;
//if not, disable their links
function validateAttachments(){
  var attachments = $('.tip').first().find('.center').find('.attachments');
  var videoAtt = attachments.find('#videoAtt');
  var imageAtt = attachments.find('#imageAtt');
  var audioAtt = attachments.find('#audioAtt');
  if(videoAtt.attr('href')=='#'){
    videoAtt.addClass('disabled-link');
  }
  if(imageAtt.attr('href')=='#'){
    imageAtt.addClass('disabled-link');
  }
  if(audioAtt.attr('href')=='#'){
    audioAtt.addClass('disabled-link');
  }
}

//Close push notification modal
function closeModal(){
  modalActive=false;
  $('.notification-modal').slideUp(500, function(){
    $('.map-canvas').css("background-color","transparent");
    $('.map-canvas').css("opacity","1");
    $('.dimmer').removeClass('visible');
    $('#notification-message').val('');
  });
}
