// This is the chat server for Sentiguard. The workflow of this chat is
// described visually in the repository wiki
(function () {
  'use strict';

  var util = require('./util');
  var usersModel = require('../models/users');
  var db = require('./db');
  var ChatLog = db.Object.extend('ChatLog');


  // Starts the chat server using the passed in socket.io instance on new namespaces corresponding
  // to client ids on the system.
  function startServer(io, sessionMiddleware) {

    // Creates a connection function object that knows the specific client id it's
    // tied to.
    var createConnection = function (clientId) {
      return function onConnection(socket) {
        socket.session = socket.handshake.session;


        // Saves a message object into a ChatLog object.
        var saveToLog = function (message, chatId) {
          // Just create a new log if non already existed.
          var createLog = function () {
            var log = new ChatLog();
            log.set('chatId', chatId);
            log.set('clientId', {
              __type: 'Pointer',
              className: 'Client',
              objectId: socket.clientId
            });
            // Make sure logs is an array.
            log.set('logs', []);
            log.save();

            return log;
          };

          // Query the database for a log.
          new db.Query(ChatLog)
            .equalTo('chatId', chatId)
            .first()
            .then(function (log) {
              // Here we check it the log already exists, if not we create one.
              if (!log) {
                log = createLog();
              }

              return log;
            }, function (error) {
              console.warn(error.message);
              var log = createLog();
              return db.Promise.as(log);
            })
            .then(function (log) {
              // Just add the message to the log array.
              log.add('logs', message);
              log.save();
            });
        };

        socket.clientId = clientId;

        // Gets called by mobile client using the 'start' message
        var mobileStart = function (data) {
          // If we have a session object with a user object, then we have a lodged in officer.
          var encPassword = util.passwordGenerator.generatePassword(data.username);
          var decPassword = util.encryptionManager.decrypt(encPassword, data.password);

          if(decPassword === data.username) {
            var User = db.Object.extend('_User');
            var userQuery = new db.Query(User);
            userQuery.equalTo('username', data.username);
            userQuery.find({
              success: function (users) {
                socket.mobileSession = users[0].toJSON();
                socket.mobileSession.chatId = data.chatId;
                socket.join(socket.mobileSession.chatId + '-mobile');
                socket.session.user = users[0].toJSON();
                var message = {
                  sender: socket.session.user.objectId,
                  receiver: socket.mobileSession.objectId,
                  message: 'una barbaridad'
                };
                routeMessage(message, socket.mobileSession.chatId);
              },
              error: function (error) {
                return error;
              }
            });
          }
          /*
          util.logIn(data.username, data.password)
            .then(function (mobileUser) {
              if (mobileUser) {
                // Create a temporary mobile user session.
                socket.mobileSession = mobileUser.toJSON();
                socket.mobileSession.chatId = data.chatId;
                socket.join(socket.mobileSession.chatId + '-mobile');
                routeMessage('una barbaridad', socket.mobileSession.chatId);
                socket.emit('connected');
              } else {
                Q.reject(Error("No user!"));
              }
            })
            .then(null, function (reason) {
            });
            */
        };

        // Routes the message around the system, the message gets encrypted if the sender was an officer and it gets decrypted for an officer if the sender was mobile client.
        var routeMessage = function (message, chatId) {
          // When the user is an admin then encode the message
          if (socket.session) {
            if (socket.session.user) {
              usersModel.getUsername(message.receiver)
                .then(function (username) {
                  var password = util.passwordGenerator.generatePassword(username);
                  var encryptedmessage = {
                    sender: socket.session.user.objectId,
                    receiver: message.receiver,
                    message: util.encryptionManager.encrypt(password, message.message),
                    date: Date.now()
                  };

                  // chatId is only sent by an officer client
                  if (chatId ) {
                    // Send encrypted message to mobile client
                    //socket.to(chatId + '-mobile')

                    socket.broadcast.emit('new-message', encryptedmessage);
                    // Send un-encrypted message to officers.
                    socket.to(chatId + '-officer')
                      .emit('new-message', message, chatId);
                    saveToLog(encryptedmessage, chatId);
                  }

                }, function (error) {
                  // TODO Handle error case.
                });
            }
          }

          // When it's a mobile session let's decrypt for the officers and re-send the encrypted one to the mobile users.
          if (socket.mobileSession) {
            var password = util.passwordGenerator.generatePassword(socket.mobileSession.username);

            // The decrypted message for the officers client
            var decryptedMessage = {
              sender: socket.mobileSession.objectId,
              receiver: socket.clientId,
              message: util.encryptionManager.decrypt(password, message.message),
              date: Date.now()
            };

            // Make sure to save the date for the server
            message.date = decryptedMessage.date;

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

          // TODO maybe add push notifications here on two way??
        };

        // puts an officer inside a room listening for messages on the specified chat id
        var officerEnterChatWithId = function (chatId) {
          if (socket.session) {
            if (socket.session.user) {
              socket.join(chatId + '-officer');

              // Send old messages to the officer as well.
              new db.Query(ChatLog)
                .equalTo('chatId', chatId)
                .first()
                .then(function (log) {
                  if (log) {
                    var messages = log.get('logs');
                    messages.forEach(function (message) {
                      // Get to objectId required to get the username for decryption
                      var objectId = message.sender === socket.session.user.objectId ?
                        message.receiver : message.sender;

                      usersModel.getUsername(objectId)
                        .then(function (username) {
                          // Start decrypting message
                          var password = util.passwordGenerator.generatePassword(username);

                          message.message = util.encryptionManager.decrypt(password, message.message);

                          // Send each message as they decrypt.
                          socket.emit('new-message', message);
                        });

                    });
                  }
                }, function (error) {

                });
            }
          }
        };

        // removes the offier from a chat
        var officerLeaveChatWithId = function (chatId) {
          socket.leave(chatId + '-officer');
        };

        // Sends a typing message to user on opposite spectrum.
        var userTyping = function (chatId) {
          if (socket.mobileSession) {
            socket.to(socket.mobileSession.chatId + '-officer')
              .emit('typing');
          }

          if (socket.session.user) {
            socket.to(chatId + '-mobile')
              .emit('typing');
          }
        };

        // Sends a stopped typing message to user on opposite spectrum.
        var userStopTyping = function () {
          if (socket.mobileSession) {
            socket.to(socket.mobileSession.chatId + '-officer')
              .emit('stop-typing');
          }

          if (socket.session.user) {
            socket.to(chatId + '-mobile')
              .emit('stop-typing');
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
            .use(sessionMiddleware)
            .on('connection', createConnection(clientId));
        });
      }, function thereIsAnError(error) {
        console.error(error.message);
      });
  }

  module.exports = startServer;
})();
