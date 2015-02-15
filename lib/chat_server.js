/**
 * Created by Victor A. Martinez on 1/26/2015.
 */

var EncryptionManager = require('./EncryptionManager.js');
var PasswordGenerator = require('./PasswordGenerator.js');

//Generates the password for the encription manager.
var passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
var encryptionManager = new EncryptionManager();

/**
 * Creates the chat server and the various endpoints
 *
 * @param io {Server} A socket.io server instance.
 * @param Parse {Parse} for data management
 * @param Client {Parse.Object}
 * @param User {Parse.Object}
 * */
module.exports = function ChatServer(io, Parse, Client, User) {
    'use strict';


    var chatServer = io,
        chatEndpoints = {},
        second = 1000;

    chatServer.heartbeatTimeout = 60 * second;

    // helper methods

    // check to see weather a specific user has admin permissions
    function hasAdmin(username, callback) {

        (new Parse.Query(User))
            .include('clientId')
            .include('roles')
            .equalTo('username', username)
            .find()
            .then(function (results) {
                var user = results[0].attributes,
                    admin = false;

                if (user) {
                    admin = user.roles.indexOf('admin') !== -1;

                    admin ? callback(null, true) : callback(null, false);
                } else {
                    callback(new Error('User not found'));
                }


            }, function (error) {
                callback(error);
            });
    }

    function getObjectId(username, callback) {
        (new Parse.Query(User))
            .include('objectId')
            .equalTo('username', username)
            .find()
            .then(function (results) {
                console.log("Getting id for %s it's %s", username, results[0].id);
                callback(null, results[0].id);
            }, function (err) {
                callback(err);
            });
    }

    function getClientNames(callback) {
        var oneDay = 8.64 * Math.pow(10, 7),
            q = new Parse.Query(Client),
            clients = [];

        q.include('objectId')
            .find()
            .then(function (results) {
                for (var i in results) {
                    clients.push(results[i].id.toString());
                    //console.log(results[i].id);
                }
                callback(null, clients);
            }, function (error) {
                console.error(error.message);
                callback(error);
            });


        // setTimeout(setEndpoints, oneDay);  // iterate 24 hours.
    }

    /**
     * Manages chats for each namespace.
     *
     * */
    function chatManager(socket) {

        var ns = this.name;

        console.info('socket: %s connected', socket.id);
        console.log(this.name);
        socket.emit('init', 'some string');
        // event handlers


        /**
         *
         * */
        function connect(data) {
            var username,
                askingAdmin,
                currentAdmin,
                adminSocket,
                room;

            //console.log(data);
            if (data) {

                username = data.username;
                askingAdmin = data.role === 'admin';
            }

            console.log('user connecting');

            function handle(error, admin) {
                if (admin !== true) {
                    socket.emit('error', {
                        status: 401,
                        error: 'Unauthorized',
                        content: "User " + username + " doesn't have access to this action"
                    });
                } else if (admin === true) {
                    socket.emit('successful-connect');
                    socket.username = data.username;

                    chatEndpoints[ns].activeAdmins.push(socket);
                    console.log('An admin has connected');
                } else {
                    socket.emit('error', {
                        status: 500,
                        error: 'Internal Server Error',
                        content: 'There was an unknown action performed that gave an unknown result'
                    });
                }
            }

            // non-strict check for null and undefined and strict check for type of 'string'
            if (username != null && typeof username === 'string') {
                if (askingAdmin) {
                    hasAdmin(username, handle);
                } else {
                    // TODO since this is a user, connect user to an available admin
                    room = Math.round(Math.random() * 1000 + 1) + '' + Date.now();

                    if (chatEndpoints[ns].nextAdmin > chatEndpoints[ns].activeAdmins.length - 1) {
                        chatEndpoints[ns].nextAdmin = 0;
                    }

                    currentAdmin = chatEndpoints[ns].nextAdmin++;
                    adminSocket = chatEndpoints[ns].activeAdmins[currentAdmin];

                    if (adminSocket) {
                        adminSocket.join(room, function (err) {
                            if (err) {

                            }

                            adminSocket.room = room;
                            getObjectId(username, function (error, id) {
                                if (error) {

                                } else {
                                    adminSocket.emit('new-room', room, username, id);
                                }
                            });
                            socket.join(room);
                            socket.room = room;
                            socket.username = username;

                            console.log("Creating new room: %s", room);
                            getObjectId(adminSocket.username, function (error, id) {
                                if (!error) {
                                    socket.emit('successful-connect', id);
                                } else {
                                    socket.emit('no-admin');
                                }
                            });

                            chatEndpoints[ns].rooms[room] = {
                                log: []
                            };
                        });

                    } else {
                        socket.emit('no-admin');
                    }


                }
            } else {
                socket.emit('error:400', {
                    status: 400,
                    error: 'Bad Request',
                    content: 'Username not defined.'
                });
            }
        }

        function routeMessage(data) {
            var room = socket.room,
                admin = false,
                passPhrase = '';
            if (room) {
                data.dateTime = Date.now();

                admin = chatEndpoints[ns].activeAdmins.indexOf(socket) !== -1;

                if (admin) {
                    // Encrypt the admins message.
                    try {
                        socket.emit('new-message', data);
                        passPhrase = passwordGenerator.generatePassword(data.receiver);
                        data.message = encryptionManager.encrypt(passPhrase, data.message);
                        socket.to(room).emit('new-message', data);
                        chatEndpoints[ns].rooms[room].log.push(data);
                    } catch (e) {
                        console.warn(e.message);
                    }
                } else {
                    try {
                        socket.emit('new-message', data);
                        chatEndpoints[ns].rooms[room].log.push(data);
                        passPhrase = passwordGenerator.generatePassword(data.sender);
                        data.message = encryptionManager.decrypt(passPhrase, data.message);
                        socket.to(room).emit('new-message', data);
                    } catch (e) {
                        console.warn(e.message);
                    }
                }


            }
        }

        function changeRoom(room) {
            var admin = chatEndpoints[ns].activeAdmins.indexOf(socket) !== -1;

            if (admin) {
                socket.room = room;
                socket.emit('room-changed');
            }
        }

        function save(sessionId) {
            var room = socket.room,
                admin = chatEndpoints[ns].activeAdmins.indexOf(socket) !== -1,
                ChatLogs = Parse.Object.extend('ChatLogs'),
                chatLog = {},
                log = '';
            if (room && admin && sessionId) {
                chatLog = new ChatLogs();
                log = JSON.stringify(chatEndpoints[ns].rooms[room].log);

                chatLog.set('sessionId', sessionId)
                    .set('messages', log)
                    .save()
                    .then(function () {
                        socket.leave(room);
                        delete chatEndpoints[ns].rooms[room];
                    }, function (err) {
                        socket.emit('saved-failed');
                    });

            } else {
                socket.emit('saved-failed');
            }
        }

        function disconnectChat() {
            var index = chatEndpoints[ns].activeAdmins.indexOf(socket),
                admin = index !== -1;

            if (admin) {
                socket.rooms.forEach(function (room) {
                    socket.leave(room);
                    socket.room = null;
                });

                // remove admin from active admins list
                chatEndpoints[ns].activeAdmins.splice(index, 1);

                console.log('An admin has disconnected');
            } else {
                socket.leave(socket.room);
            }
        }

        /**
         * Performs connection test
         * @param data {JSON}
         * */
        function test(data) {
            'use strict';
            var response = typeof data === 'string' ? "To access the EventEmitter class, require('events').EventEmitter." +
                " When an EventEmitter instance experiences an error, the typical action is to emit an 'error' event. " +
                "Error events are treated as a special case in node. If there is no listener for it, then the default" +
                " action is to print a stack trace and exit the program." : data,
                count = 1,
                timeout;
            console.info("socket: %s sent %s sending it back", socket.id, data);

            function respond() {
                socket.emit('test-back', response + ' ' + count);

                if (count === 10) {
                    return;
                }

                console.log("sending %s to %s for the %sth time", response, socket.id, count);
                count += 1;
            }

            respond();
        }

        function userTyping(data) {
            var room = socket.room;

            if (room) {
                socket.to(room).emit('typing', data.username);
            }
        }

        // bind events to functions
        socket
            .on('start', connect)
            .on('message-sent', routeMessage)
            .on('change-room', changeRoom)
            //.on('test', test)
            .on('save', save)
            //.on('typing', userTyping)
            .on('disconnect', disconnectChat);
    }

    getClientNames(function gettingNames(error, clients) {
        console.info("\nRegistering endpoints:");
        for (var i in clients) {
            var clientId = clients[i],
                endpoint = '/chat/' + clientId;

            console.info("\t\t %s", endpoint);

            chatEndpoints[endpoint] = {
                activeAdmins: [],
                rooms: {},
                nextAdmin: 0
            };

            chatServer
                .of(endpoint)
                .on('connection', chatManager);
        }
    });

    // create client namespaces example: '/chat/otF8BLkDg8'

};