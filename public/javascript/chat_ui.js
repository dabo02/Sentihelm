/*Sanitize user input and places it
  in a <div> element.*/
function divEscapedContentElement(message){
  return $('<div></div>)').text(message);
}

/*Displays system (trusted) content */
function divSystemContentElement(message){
  return $('<div></div>').html('<i>'+message+'</i>');
}

/*Sanitize message, send to it to the server,
  add it to the messages div and reset message
  field.
  */
function processMessages(chatApp, socket){
  var message = $(#message-text).val();
  chatApp.sendMessage($('#room-list').first().text(), message); //SEND TO FIRST ITEM IN CHAT LIST
  $('messages').append(divEscapedContentElement(message));
  $('messages').scrollTop($('#messages').prop('scrollHeight'));
  $('#message-text').val('');
}
