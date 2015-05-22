/**
 * Created by Victor A. Martinez on 1/26/2015.
 */

(function () {
  'use strict';

  angular.module('sentihelm')
    .factory('chatSocket', ['socketFactory', 'Session', '$location', function (socketFactory, Session, $location) {

      var namespace = '/chat/' + Session.clientId,
        server = $location.host(),
        socket = socketFactory({
          ioSocket: io.connect(server + namespace) // connect to chat server
        });

      return socket;
    }])
    // Service that manages the nitty gritty
    .factory('shChat', ['chatSocket', '$q', 'Session', function (chatSocket, $q, Session) {

      // Memory store for the connected rooms.
      var connectedRooms = {};

      // Listen for new messages on joined rooms.
      chatSocket.on('new-message', function (message, chatId) {
        connectedRooms[chatId].push(message);
      });

      return {
        // Join a room that is listening to messages on the specified chat id.
        enterChat: function (chatId) {
          connectedRooms[chatId] = {
            messages: []
          };
          chatSocket.emit('officer-enter-chat', chatId);
        },

        // Leave a room listening for messages on a specific chat.
        leaveChat: function (chatId) {
          delete connectedRooms[chatId];
          chatSocket.emit('officer-leave-chat', chatId);
        },

        // Send a message to all users listening to a chat identified by a specific id.
        send: function (message, chatId, receiver) {
          chatSocket.emit('message-sent', {
            receiver: receiver,
            message: message,
            sender: null
          }, chatId);

        },
        messages: function (chatId) {
          return connectedRooms[chatId].messages || [];
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
    .directive('shChatterbox', ['shChat', '$location', '$anchorScroll', function (shChat, $location, $anchorScroll) {
      return {
        restrict: 'E',
        scope: {
        },
        templateUrl: '/chat.html',
        link: function ($scope, _, attrs) {

          // Send a message and reset the message text box
          $scope.sendMessage = function () {
            shChat.send($scope.messageText,
              attrs.chatId,
              attrs.mobileUserId);
            // reset form
            $scope.messageText = '';
          };

          // Get all messages for a this chat.
          $scope.messages = function () {
            var messages = shChat.messages(attrs.chatId) || [];

            // Order by date.
            messages.sort(function (a, b) {
              if (a.dateTime < b.dateTime) {
                return -1
              }
              if (a.dateTime > b.dateTime) {
                return 1;
              }

              return 0;
            });

            $location.hash(messages[messages.length - 1].dateTime);
            $anchorScroll();

            return messages;
          };


          shChat.enterChat(attrs.chatId);
        }
      }
    }]);
})();
