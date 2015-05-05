/**
 * Created by Victor A. Martinez on 1/26/2015.
 */



(function (angular, undefined) {
  'use strict';

  angular.module('sentihelm')
    .factory('messageFactory', ['Session', function (Session) {
      return function (messageData) {
        if (!messageData.receiver) {
          throw Error("No receiver set, please do so.");
        }
        return {
          sender: messageData.sender || Session.user.objectId,
          receiver: messageData.receiver || undefined,
          message: messageData.message || undefined,
          dateTime: Date.now()
        };
      };
    }])
    .factory('chatSocket', ['socketFactory', 'Session', '$location', function (socketFactory, Session, $location) {

      var namespace = '/chat/' + Session.clientId,
        server = $location.host(),
        socket = socketFactory({
          ioSocket: io.connect(server + namespace) // connect to chat server
        });

      function onInit() {
        socket.emit('start', {
          username: Session.user.username,
          role: 'admin'
        });
      }

      socket.on('init', onInit);

      return socket;
    }])
    .factory('shChat', ['chatSocket', 'messageFactory', function (chatSocket, messageFactory) {
      var chatService = {};

      chatService.onMessage = function (cb) {
        chatSocket.on('new-message', cb);
      };



      chatService.sendMessage = function (plainText, to, from, options) {
        var message = messageFactory({
          sender: from,
          receiver: to,
          message: plainText
        });

        for (var key in options) {
          message[key] = options[key];
        }

        chatSocket.emit('message-sent', message);
      };

      return chatService
    }])
    .factory('shTipChat', 'shChat', '$http', function (shChat, $http) {
      var shTipChat = {};

      shTipChat.messages = [];

      return shTipChat;
    })
    .factory('tipChatService', ['chatSocket', '$http', 'Session', 'ngToast', '$location', function (chatSocket, $http, Session, ngToast, $location) {
      var password = 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@',

        chatLogsUrl = '/chat-logs/' + Session.clientId,

        tipChatService = {
          activeChats: [],
          retrieveAll: function () {
            return $http.post(chatLogsUrl + '/retrieve', {
              password: password
            }).success(function (data) {
              tipChatService.activeChats = angular.copy(data);
            });


          },
          addTipToQueue: function (tipId, id) {
            return $http.post(chatLogsUrl + '/add', {
              password: password,
              tipId: tipId,
              userObjectId: id
            })
              .then(function (dd) {
                return dd.data;
              });
          }
        };

      tipChatService.retrieveAll();

      function onNewRoom() {
        var found = false,
          tipId = arguments[3];
        if (tipId != undefined) {
          tipChatService.activeChats.forEach(function (activeChat) {
            if (activeChat.tipObjectId === tipId) {
              found = true;
            }
          });

          if (!found) {
            ngToast.create("A new room has been added!");
          }
        }
      }

      function onNewMessage(data) {
        if (data.tipId && data.sender !== Session.user.objectId && $location.path() !== '/tip-chat-logs') {
          ngToast.create("New message");
        }
      }

      chatSocket.on('new-room', onNewRoom);
      chatSocket.on('new-message', onNewMessage);

      return tipChatService;
    }])
    .controller('ChatController', ['chatSocket', 'Session', '$rootScope', '$location', '$anchorScroll', 'messageFactory',
      function (chatSocket, Session, $rootScope, $location, $anchorScroll, messageFactory) {
        var self = this;
        self.message = '';
        self.rooms = {};
        self.currentRoom = '';
        self.receiver = '';
        self.canSend = false;

        // Private
        function getUserName(id) {
          var username = '';

          Object.keys(self.rooms)
            .forEach(function (room) {
              var currentRoom = self.rooms[room];
              if (currentRoom.with.id === id) {
                username = currentRoom.with.username;
              }
            });

          return username;

        }

        // Priavate
        function getRoom(username, id) {
          var prop = username ? 'username' : (id ? 'id' : undefined),
            roomName = '',
            comparative = username || id || undefined;

          if (prop && comparative) {
            Object.keys(self.rooms)
              .forEach(function (room) {
                var currentRoom = self.rooms[room];
                if (currentRoom.with[prop] === comparative) {
                  roomName = room;
                }
              });
            return roomName;
          }

          return undefined;
        }

        // Private


        // Private
        function onConnectionSuccess() {
          console.log('We are connected to chat server');
        }

        // Private
        function onDeleteStream(event, id) {
          var roomName = getRoom(undefined, id);
          self.message = '';
          if (self.rooms.hasOwnProperty(roomName) &&
            self.rooms[roomName].messages.length > 0) {
            self.save(id);
          }
        }

        // Public
        self.send = function () {

          try {
            chatSocket.emit('message-sent', messageFactory({
              receiver: self.receiver,
              message: self.message
            }));
          } catch (e) {
            console.log(e.message);
            self.rooms[getRoom(undefined, self.receiver)].messages.push({
              dateTime: Date.now(),
              message: e.message
            });
          }

          self.message = '';
        };

        // Public
        self.onNewRoom = function (room, username, id) {
          self.rooms[room] = {
            with: {
              username: username,
              id: id
            },
            messages: []
          };
        };

        // Public
        self.onNewMessage = function (data) {
          var sender = data.sender,
            receiver = data.receiver,
            message = data.message,
            dateTime = data.dateTime,
            messageObject = {
              from: '',
              fromMe: false,
              message: message,
              dateTime: dateTime
            },
            username,
            room;

          if (sender == Session.user.objectId) {
            messageObject.from = Session.user.username;
            messageObject.fromMe = true;

            username = getUserName(receiver);
          } else {
            username = getUserName(sender);
            messageObject.from = username;
          }

          messageObject.id = 'm' + Math.round(Math.random() * 1000 + 1 + Date.now());

          room = getRoom(username);

          this.rooms[room].messages.push(messageObject);

          if (room === self.currentRoom) {
            $location.hash(messageObject.id);
            $anchorScroll();
          }
        };

        // Public
        self.changeRoom = function (id) {
          var room = getRoom(undefined, id);

          if (room) {
            self.receiver = self.rooms[room].with.id;
            self.canSend = true;

            if (self.currentRoom !== room) {
              chatSocket.emit('change-room', room);
              self.currentRoom = room;
              $location.hash('chat-bottom');
              $anchorScroll();
            }

          } else {
            // TODO implement method that requests a chat with a user if not already chatting.
            //self.requestChat(username);
            self.canSend = false;
            self.currentRoom = '';
          }
        };

        // Public
        self.save = function (id) {
          // TODO SAVE
          var room = getRoom(undefined, id);

          // remove room from memory
          delete self.rooms[room];
          self.canSend = false;
        };

        chatSocket.emit('change-space', 'video-streams');

        chatSocket.on('successful-connect', onConnectionSuccess);
        $rootScope.$on('delete-stream', onDeleteStream);
        chatSocket.on('new-message', self.onNewMessage);
        chatSocket.on('new-room', self.onNewRoom);
      }
    ]);
  /* .controller('TipChatController', ['$scope', '$controller', 'tipChatService', 'chatSocket', 'Session', '$location', '$anchorScroll', 'messageFactory', '$timeout', '$state',
   function ($scope, $controller, tipChatService, chatSocket, Session, $location, $anchorScroll, messageFactory, $timeout, $state) {
   var self = this;
   self.message = "";
   self.rooms = {};
   self.currentRoom = '';
   self.receiver = '';
   self.canSend = false;
   self.userTyping = false;

   var timeoutPromise;


   function addTipRoom(roomName, username, id, tObject) {
   self.rooms[roomName] = {
   with: {
   username: username,
   id: id
   },
   messages: [],
   controlNumber: tObject.controlNumber,
   tipObjectId: tObject.tipObjectId,
   crimeType: tObject.crimeType
   };

   }

   function getUserName(id) {
   var username = '';

   Object.keys(self.rooms)
   .forEach(function (room) {
   var currentRoom = self.rooms[room];
   if (currentRoom.with.id === id) {
   username = currentRoom.with.username;
   }
   });

   return username;

   }

   function getRoom(controlNumber, tipId) {
   for (var roomName in self.rooms) {
   if (roomName === controlNumber || self.rooms[roomName].controlNumber === controlNumber || self.rooms[roomName].tipObjectId === tipId) {
   return roomName;
   }
   }

   return undefined;
   }


   /!**
   * This gets called whenever we're done retrieving all messages from every active tip chat.
   * *!/
   function onRetrieveAllDone() {
   tipChatService.activeChats.forEach(function (tipChat) {
   if (!self.rooms.hasOwnProperty(tipChat.controlNumber)) {

   addTipRoom(tipChat.controlNumber, tipChat.tipUsername, tipChat.tipUserId, tipChat);

   console.log(self.rooms);

   tipChat.messages.forEach(function (message) {
   console.log(message);
   message.tipId = tipChat.tipObjectId;
   self.onNewMessage(message);
   });
   }
   });
   }

   self.onNewMessage = function (data) {
   var sender = data.sender,
   receiver = data.receiver,
   message = data.message,
   dateTime = data.dateTime,
   messageObject = {
   from: '',
   fromMe: false,
   message: message,
   dateTime: dateTime
   },
   username,
   room;

   if (sender == Session.user.objectId) {
   messageObject.from = Session.user.username;
   messageObject.fromMe = true;
   } else {
   username = getUserName(sender);
   messageObject.from = username;
   }

   room = getRoom(undefined, data.tipId);

   messageObject.id = Math.round(Math.random() * 1000 + 1 + Date.now())
   .toString();

   console.log(room);

   if (room) {
   self.rooms[room].messages.push(messageObject);

   if (room === self.currentRoom) {
   $location.hash(messageObject.id);
   $anchorScroll();
   }
   }
   };

   self.onNewRoom = function (roomName, username, id, tipId) {
   var found = false,
   roomObject = undefined,
   rn = "";

   //Object.keys(self.rooms).forEach(function (lookingAt) {
   //    var room = self.rooms[lookingAt];
   //    if (room.with.id === id && room.with.username === username && room.tipId === tipId) {
   //        self.rooms[roomName] = angular.copy(self.rooms[lookingAt]);
   //        delete self.rooms[lookingAt];
   //        found = true;
   //    }
   //});

   for (rn in self.rooms) {
   roomObject = self.rooms[rn];
   if (roomObject.with.id === id && roomObject.with.username === username && roomObject.tipObjectId === tipId) {
   self.rooms[roomName] = angular.copy(self.rooms[rn]);
   delete self.rooms[rn];
   found = true;
   self.rooms[roomName].hide = false;
   if (self.currentRoom === rn) {
   self.currentRoom = roomName;
   self.rooms[roomName].new = false;
   chatSocket.emit('change-room', roomName);
   } else {
   self.rooms[roomName].new = true;
   }

   break;
   }
   }


   if (!found && tipId) {
   tipChatService.addTipToQueue(tipId, id)
   .then(function (tObject) {
   var oldRoom = getRoom(tObject.controlNumber);


   addTipRoom(roomName, username, id, tObject);

   if (oldRoom) {
   delete self.rooms[oldRoom];
   }
   });

   self.rooms[roomName].new = true;
   }
   };

   self.isTyping = function () {
   if (self.currentRoom) {
   if (self.message !== '' && (typeof self.message === 'string' && !(self.message.length > 1))) {
   chatSocket.emit('user-typing');
   } else if (!self.message) {
   chatSocket.emit('user-stop-typing');
   } else {
   // nothing
   }
   }
   };

   self.changeRoom = function (controlNumber) {

   self.canSend = false;

   for (var roomName in self.rooms) {
   if (self.rooms[roomName].controlNumber === controlNumber) {
   $state.go('tip-chat', { tipId: self.rooms[roomName].tipObjectId });
   }
   }

   };

   self.getClass = function (room) {
   return {
   'new-room': room.new,
   'active-chat-item': !room.new
   }
   };

   self.send = function () {
   var m = {};

   chatSocket.emit('user-stop-typing');

   try {
   m = messageFactory({
   receiver: self.receiver,
   message: self.message
   });

   m.tipId = self.rooms[self.currentRoom].tipObjectId;
   chatSocket.emit('message-sent', m);
   } catch (e) {
   console.log(e.message);
   }

   self.message = '';
   };

   chatSocket.on('new-message', self.onNewMessage);
   chatSocket.on('new-room', self.onNewRoom);


   chatSocket.on('typing', function (room) {
   if (room === self.currentRoom) {
   self.userTyping = true;
   $location.hash('typing');
   $anchorScroll();
   }
   });

   chatSocket.on('stop-typing', function (room) {
   if (room == self.currentRoom) {
   self.userTyping = false;
   }
   });

   tipChatService.retrieveAll()
   .then(onRetrieveAllDone)
   .then(function () {
   var room;
   if ($state.params.tipId) {
   if ($state.params.tipId.length > 1) {
   room = getRoom(undefined, $state.params.tipId);
   if (room) {
   self.currentRoom = room;

   var messages = self.rooms[room].messages;
   if (messages.length > 0) {
   $location.hash(messages[messages.length - 1].id);
   }
   $anchorScroll();

   self.canSend = true;

   self.receiver = self.rooms[room].with.id;

   if (room !== controlNumber) {
   chatSocket.emit('change-room', room);
   } else {
   chatSocket.emit('change-room', null);
   }

   self.rooms[room].new = false;
   } else {

   }
   }
   }
   });
   }
   ]);*/
})(window.angular);
