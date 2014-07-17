//=========================================
//  TIP FEED UI SETUP
//=========================================

//Global var used to check if modal is active
var modalActive = false;

//Global var used to check if push notification
//file has been selected
var modalFileSelected = false;

//Connect to server side socket
var socket = io.connect('http://sentihelm.elasticbeanstalk.com');

//Initialize Parse (keys are for BastaYa4.0 PROD)
Parse.initialize("Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE", "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk");

//Catch event when new tip arrives server-side.
//Extract all tip info from received JSON
socket.on('new tip', function(data){
  var tip = data.tip;
  var name = tip.firstName +" "+tip.lastName;
  var crimeImage = "http://199.85.204.123/fb_images/"+tip.crimeListPosition+".png";
  var crimeDescription = tip.crimeDescription;
  if(crimeDescription==undefined){
    crimeDescription="";
  }
  var tipHTML;
  //Create tip HTML
  if(tip.anonymous){
    tipHTML = '<li class="tip"><div class="tip-header"><span>'+'ANONYMOUS'+'</span>'+
    '<div class="control-number anon">'+tip.controlNumber+'</div>'+
    '</div><div class="tip-body"><div class="left"><img src="'+crimeImage+'"/>'+
    '<br><span>'+tip.crimeType+'</span></div><div class="center">'+
    '<div class="attachments"><a id="videoAtt" href="'+tip.videoUrl+'"><img src="./'+
    'resources/images/videoAtt.png"/></a><a id="imageAtt" href="'+tip.imageUrl+'"><img' +
    ' src="./resources/images/imageAtt.png"/></a><a id="audioAtt" href="'+tip.audioUrl+'"><img'+
    ' src="./resources/images/audioAtt.png"/></a></div><div class="crime'+
    '-description"><span>'+crimeDescription+'</span></div></div><div '+
    'class="right"></div></div></li>';
  }
  else{
    tipHTML = '<li class="tip"><div class="tip-header"><span>'+name+'</span>'+
    '<div class="control-number">'+tip.controlNumber+'</div>'+
    '</div>'+'<div class="tip-body"><div class="left"><img src="'+crimeImage+'"/>'+
    '<br><span>'+tip.crimeType+'</span><div class="contact-info">CONTACT USER\n<span '+
    'class="contact-number">'+tip.phone+'</span><button '+
    'class="notification-button">Send Notification</button></div></div><div class="center">'+
    '<div class="attachments"><a id="videoAtt" href="'+tip.videoUrl+'"><img src="./'+
    'resources/images/videoAtt.png"/></a><a id="imageAtt" href="'+tip.imageUrl+'"><img' +
    ' src="./resources/images/imageAtt.png"/></a><a id="audioAtt" href="'+tip.audioUrl+'"><img'+
    ' src="./resources/images/audioAtt.png"/></a></div><div class="crime'+
    '-description"><span>'+crimeDescription+'</span></div></div><div '+
    'class="right"><div class="map-canvas" id="'+tip.controlNumber+'"></div></div></div></li>';
  }
  //Insert tip into feed
  insertTip(tip, tipHTML);
});

//=========================================
//  JQUERY
//=========================================

$(document).ready(function(){
  //--------------------
  //  ON PAGE LOAD
  //--------------------

  //Hide the notification modal
  $('.notification-modal').hide();

  //--------------------
  //  TIP RELATED
  //--------------------

  //Change attachment image to hover state
  $('#tip-feed').on('mouseenter','a',function(){
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
  $('#tip-feed').on('mouseleave','a',function(){
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

  //--------------------
  //  MODAL RELATED
  //--------------------

  //Opens up the modal that sends push notifications to mobile users
  $('#tip-feed').on('click', '.notification-button', function(){
    //Get values
    var selectedTip = $(this).closest('.tip');
    var userName = selectedTip.data("userName");
    var controlNumber = selectedTip.data("controlNumber");
    var userChannel = selectedTip.data("userChannel");

    //Set modal to active
    modalActive = true;

    //Dim background and maps
    $('.map-canvas').css("background-color","black");
    $('.map-canvas').css("opacity","0.5");
    $('.dimmer').addClass('visible');

    //Set user's Name on tip header
    $('.modal-title span').html('Contact '+userName);

    //Bind data to HTML element (for later use);
    var modal = $('.notification-modal');
    modal.data("controlNumber",controlNumber);
    modal.data("userChannel", userChannel);

    //Show control number on tip and on notification title
    $('#notification-title').val("Regarding Tip #"+controlNumber);

    //Show modal
    modal.slideDown(500, function(){
      $('#notification-message').focus();
    });
  });

  //When a notification attachment is selected, change color and name
  $('#notification-att').change(function(){
    if($(this).val()!=""){
      modalFileSelected = true;
      $('.modal-attachment').css("background-color","#3bc63f");
      var fileName = $(this).val().substring(12);
      $('.modal-attachment span').html(fileName);
    }
  });

  //Send push notification
  $('.modal-send').on('click', function(){
    //If no message was entered, display message and return
    if($('#notification-message').val()==""){
      var error = $('.notification-alert');
      error.find('span').text('Please enter a message to send to the user');
      error.animate({bottom:"20%"},600);
      $('#notification-message').css("background","rgba(198, 45, 45, 0.28)");
      $('#notification-message').focus();
      return;
    }
    //Otherwise, substitute "Send" with spinner,
    //indicating sending is in progress
    $(this).text('');
    $(this).html('<div class="spinner">'+
    '<div class="bounce1"></div>'+
    '<div class="bounce2"></div>'+
    '<div class="bounce3"></div>'+
    '</div>');
    saveAndPushNotification($(this));
  });

  //Reset notification message field and hide notification error
  $('#notification-message').on('keypress', resetNotificationMessage);

  //On click, close push notification modal
  $('.close-modal').on('click', closeModal);
});

//=========================================
//  HELPER FUCTIONS
//=========================================

//Insert received tip into tip feed with appropiate
//modifications: both anonymous and non-anonymous,
//binds data to HTML (used for push notifications),
//renders map when needed and checks if links are
//available
function insertTip(tip, tipHTML){
  //Add tip to top of tip feed
  $('#tip-feed').prepend(tipHTML);
  var currentTip = $('.tip').first();
  currentTip.hide();

  //If tip is anonymous, edit CSS and map content
  if(tip.anonymous){
    $(currentTip).find('.tip-header span').css("color", "#ff6600");
    $(currentTip).css("border","0.1em solid #ff6600");
    var rightDiv = $(currentTip).find('.tip-body').find('.right');
    rightDiv.html('NO LOCATION AVAILABLE');
    rightDiv.addClass("no-location");
  }
  else{
    //Set tip to hold data for notifications
    currentTip.data("userChannel", tip.channel);
    currentTip.data("userName", tip.firstName+" "+tip.lastName);
    currentTip.data("controlNumber", tip.controlNumber);
  }

  //Show tip with animation
  currentTip.slideDown(750, function(){
    //Only display map if user is not anonymous
    if(!tip.anonymous){
      //Alternate method that assings unique id to each
      //map view; might be useful when dealing with tip queue
      // renderMap(controlNumber, tip.latitude, tip.longitude);
      renderMap(tip.latitude, tip.longitude);
      if(modalActive){
        $('.map-canvas').css("background-color","black");
        $('.map-canvas').css("opacity","0.5");
      }
    }

    //Check links
    validateAttachments();
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

//Reset notification message field and hide notification error
function resetNotificationMessage(){
  $('.notification-alert').animate({bottom:"-6%"});
  $('#notification-message').css("background","#f7f7f7");
}

//Close push notification modal and reset all its content
function closeModal(){
  resetNotificationMessage();
  $('.notification-modal').slideUp(500, function(){
    //Remove dimmer
    $('.map-canvas').css("background-color","transparent");
    $('.map-canvas').css("opacity","1");
    $('.dimmer').removeClass('visible');

    //Resest notification message field
    $('#notification-message').val('');

    //Reset notification attachment and CSS
    $('#notification-att').val('');
    $('.modal-attachment').css("background-color","#ff6600");
    $('.modal-attachment span').html("Attach Image or Video");

    //Hide spinner, show send
    $('.modal-send').html('');
    $('.modal-send').text('Send');
    modalActive = false;
    modalFileSelected = false;
  });
}

//Saves the push notification sent to Parse, along with
//extra data for logging/extracting
function saveAndPushNotification(tip){
  //Get values that will be sent/saved
  var title = $('#notification-title').val();
  var message = $('#notification-message').val();
  var userChannel = tip.parent().data("userChannel");
  var controlNumber = tip.parent().data("controlNumber");
  var userId = userChannel.substring(5);

  var PushNotification = Parse.Object.extend("PushNotifications");
  var notification = new PushNotification();
  if(modalFileSelected){
    var fileData = $('#notification-att')[0].files[0];
    var attachment = new Parse.File("attachment", fileData);
    if(fileData.type.match('image.*')){
      notification.set("image", attachment);
    }
    else{
      notification.set("video", attachment);
    }
  }
  notification.set("userId", userId);
  notification.set("tipId", controlNumber);
  notification.set("title", title);
  notification.set("message", message);

  notification.save(null, {
    success : function(notification){
      var notificationId = notification.id;
      Parse.Push.send({
        channels: [ userChannel ],
        data: {
          alert: message,
          badge: "Increment",
          sound: "cheering.caf",
          title: title,
          pushId: notificationId
        }
      },
      {
        success: function(){},
        error: function(error) {
          console.log("FAILED: "+error);
        }
      });
      closeModal();
    },
    error : function(notification, error){
      var error = $('.notification-alert');
      error.find('span').text('An error occurred. The notification could not be sent. Please try again.');
      error.animate({bottom:"20%"},600);
      console.log("FAILED: "+error);
    }
  });
}
