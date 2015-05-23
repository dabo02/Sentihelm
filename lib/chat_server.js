(function () {
  'use strict';

  var util = require('./util');
  var usersModel = require('../models/users');
  var db = require('./db');
  var ChatLog = db.Object.extend('ChatLog');


  // Starts the chat server using the passed in socket.io instance on new namespaces corresponding
  // to client ids on the system.
  function startServer(io) {

    // Creates a connection function object that knows the specific client id it's
    // tied to.
    var createConnection = function (clientId) {
      return function onConnection(socket) {

        // Saves a message object into a ChatLog object.
        var saveToLog = function (message, chatId) {
          new db.Query(ChatLog)
            .equalTo('chatId', chatId)
            .first()
            .then(function (log) {
              if (!log) {
                log = new ChatLog();
                log.set('chatId', chatId);
                log.set('clientId', {
                  __type: 'Pointer',
                  className: 'Client',
                  objectId: socket.clientId
                });
                log.set('logs', []);
                log.save();
              }

              log.add('logs', message);

            }, function (error) {

            });
        };

        socket.clientId = clientId;

        // Gets called by mobile client using the 'start' message
        var mobileStart = function (data) {
          // If we have a session object with a user object, then we have a lodged in officer.
          util.logIn(data.username, data.password)
            .then(function (mobileUser) {
              if (mobileUser) {
                // Create a temporary mobile user session.
                socket.mobileSession = mobileUser.toJSON();
                socket.mobileSession.chatId = data.chatId;
                socket.join(socket.mobileSession.chatId + '-mobile');
              } else {
                Q.reject(Error("No user!"));
              }
            })
            .then(null, function (reason) {

            });
        };

        // Routes the message around the system, the message gets encrypted if the sender was an officer and it gets decrypted for an officer if the sender was mobile client.
        var routeMessage = function (message, chatId) {
          // When the user is an admin then encode the message
          if (socket.session.user) {
            usersModel.getUsername(message.receiver)
              .then(function (username) {
                var password = util.passwordGenerator(username);
                var encryptedmessage = {
                  sender: socket.session.user.objectId,
                  receiver: message.receiver,
                  message: util.encryptionManager.encrypt(password, message.message),
                  date: Date.now()
                };

                // chatId is only sent by an officer client
                if (chatId) {
                  // Send encrypted message to mobile client
                  socket.to(chatId + '-mobile')
                    .emit('new-message', encryptedmessage);
                  // Send un-encrypted message to officers.
                  socket.to(chatId + '-officer')
                    .emit('new-message', message, chatId);
                  saveToLog(encryptedmessage, chatId);
                }

              }, function (error) {

              });
          }

          // When it's a mobile session let's decrypt for the officers and re-send the encrypted one to the mobile users.
          if (socket.mobileSession) {
            var password = util.passwordGenerator(socket.mobileSession.username);

            // The decrypted message for the officers client
            var decryptedMessage = {
              sender: socket.mobileSession.objectId,
              receiver: socket.clientId,
              message: util.encryptionManager.decrypt(password, message.message),
              date: Date.now()
            };

            // chatId is only sent by an officer client, for a mobile user we use the one set during the start phase.
            if (socket.mobileSession.chatId) {
              // Send encrypted message to mobile client
              socket.to(socket.mobileSession.chatId + '-mobile')
                .emit('new-message', message);
              // Send un-encrypted message to officers.
              socket.to(socket.mobileSession.chatId + '-officer')
                .emit('new-message', decryptedMessage, socket.mobileSession.chatId);
              saveToLog(message, socket.mobileSession.chatId);
            }
          }
        };

        // puts an officer inside a room listening for messages on the specified chat id
        var officerEnterChatWithId = function (chatId) {
          socket.join(chatId + '-officer');
          
          new db.Query(ChatLog)
            .equalTo('chatId', chatId)
            .first()
            .then(function (log) {
              if (log) {
                var messages = log.get('logs');
                var m;
                messages.forEach(function (message) {
                  // TODO Decrypt.
                });

                return m;
              }
            }, function (error) {
              
            });
        };

        // removes the offier from a chat
        var officerLeaveChatWithId = function (chatId) {
          socket.leave(chatId + '-officer');
        };

        // Sends a typing message to user on opposite spectrum.
        var userTyping = function (chatId) {
          if (socket.mobileSession) {
            socket.to(socket.mobileSession.chatId + '-officer')
              .emit('');
          }

          if (socket.session.user) {
            socket.to(chatId + '-mobile')
              .emit();
          }
        };

        // Sends a stopped typing message to user on opposite spectrum.
        var userStopTyping = function () {
          if (socket.mobileSession) {
            socket.to(socket.mobileSession.chatId + '-officer')
              .emit('');
          }

          if (socket.session.user) {
            socket.to(chatId + '-mobile')
              .emit();
          }
        };

        // This one only gets called by the mobile client. It should return an ArrayList of encrypted messages
        var onGetLog = function () {
          new db.Query(ChatLog)
            .equalTo('chatId', socket.mobileSession.chatId)
            .first()
            // let's just dump all the logs in the list
            .then(function (log) {
              if (log) {
                return log.get('logs') || [];
              }

              return [];
            })
            .then(function (logs) {
              socket.emit('request-messages-result', logs);
            });
        };

        // set-up the messages the server can respond to.
        socket
          .on('start', mobileStart)
          .on('message-sent', routeMessage)
          .on('officer-enter-chat', officerEnterChatWithId)
          .on('officer-leave-chat', officerLeaveChatWithId)
          .on('user-typing', userTyping)
          .on('user-stop-typing', userStopTyping)
          .on('request-messages', onGetLog);
      };
    };

    // Get the client names and start the namespaces
    util.getClientIds()
      .then(function whenWeHaveClients(clients) {
        clients.forEach(function (clientId) {
          io
            // creates and starts the namespaces.
            .of('/chat/' + clientId)
            .on('connection', createConnection(clientId));
        });
      }, function thereIsAnError(error) {
        console.error(error.message);
      });
  }

  module.exports = startServer;
})();
