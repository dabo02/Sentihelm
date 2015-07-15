/**
 * Created by Victor A. Martinez on 1/26/2015.
 */

(function () {
  'use strict';

  angular.module('sentihelm')
    .factory('chatSocket', ['socketFactory', 'Session', '$location', function (socketFactory, Session, $location) {

      var namespace = '/chat/' + Session.user.homeClient.objectId,
        server = $location.protocol() + '://' + $location.host() + ':' + $location.port(),
        socket = socketFactory({
          ioSocket: io.connect(server + namespace) // connect to chat server
        });
      console.log('socket connected to: ' + server + '' + namespace);

      return socket;
    }])
    // Service that manages the nitty gritty
    .factory('shChat', ['chatSocket', '$q', function (chatSocket, $q) {

      // Memory store for the connected rooms.
      var connectedRooms = {};

      // Listen for new messages on joined rooms.
      chatSocket.on('new-message', function (message, chatId) {
        if (!connectedRooms[chatId]) {
          connectedRooms[chatId] = {
            messages: []
          };
        }
        connectedRooms[chatId].messages.push(message);
      });

      // Listen for new messages on joined rooms.
      chatSocket.on('mobile-disconnect', function (chatId) {
        stopChat(chatId);
      });

      return {
        // Join a room that is listening to messages on the specified chat id.
        enterChat: function (chatId) {
          //leave current room
          connectedRooms[chatId] = {
            messages: []
          };
          console.log('Entered chat : ' + chatId);

          chatSocket.emit('officer-enter-chat', chatId);
        },

        stopChat: function(chatId){
          delete connectedRooms[chatId];
        },

        // Leave a room listening for messages on a specific chat.
        leaveChat: function (chatId) {
          chatSocket.emit('officer-leave-chat',chatId);
          stopChat(chatId);
        },

        // Send a message to all users listening to a chat identified by a specific id.
        send: function (message, chatId, sender, receiver) {
          chatSocket.emit('message-sent', {
            receiver: receiver,
            message: message,
            sender: null
          }, chatId);

        },
        messages: function (chatId) {
          return connectedRooms[chatId] ? connectedRooms[chatId].messages : [];
        }
      }
    }])
    // Custom directive for containing a chat. The only requirement is to pass in a string to identify the chat. This gets used internally in the system
    //
    // Example usage:
    // ```html
    // <sh-chatterbox chat-id="xyz.." mobile-user-id="...">
    // </sh-chatterbox>
    // ```
    .directive('shChatterbox', ['shChat', '$location', '$anchorScroll', 'Session', '$q', function (shChat, $location, $anchorScroll, Session, $q) {
      return {
        restrict: 'E',
        scope: false/*{
          chatId: '=',
          mobileUserId: '='
        }*/,
        templateUrl: '/chat.html',
        link: function (scope, attrs) {

          scope.joinChat = function (chatId, mobileUserId){
            if(scope.chatId){
              scope.leaveChat().then(function(){
                shChat.enterChat(chatId, scope.Session.user.objectId, mobileUserId);
              });
            }
            else{
              shChat.enterChat(chatId, scope.Session.user.objectId, mobileUserId);
            }
            scope.chatId = chatId;
            scope.mobileUserId = mobileUserId;
          };

          scope.stopChat = function(){
            shChat.stopChat(scope.chatId);
            scope.chatId = null;
            scope.mobileUser = null;
          };

          scope.leaveChat = function (){
            var deferred = $q.defer();
            shChat.leaveChat(scope.chatId, scope.Session.user.objectId, scope.mobileUserId);
            scope.chatId = null;
            scope.mobileUserId = null;
            deferred.resolve();

            return deferred.promise;
          };

          scope.Session = Session;

          // Send a message and reset the message text box
          scope.sendMessage = function () {
            console.log(scope.Session);
            shChat.send(scope.messageText,
              scope.chatId,
              scope.Session.user.objectId,
              scope.mobileUserId);
            // reset form
            scope.messageText = '';
          };

          // Get all messages for a this chat.
          scope.messages = function () {
            var messages = shChat.messages(scope.chatId);

            // Order by date.
            messages.sort(function (a, b) {
              if (a.date < b.date) {
                return -1
              }
              if (a.date > b.date) {
                return 1;
              }

              return 0;
            });
            /*
            if (messages.length >= 1) {
              $location.hash(messages[messages.length - 1].date || '');
              $anchorScroll();
            }
            */
            return messages;
          };
        }
      }
    }]);
})();
