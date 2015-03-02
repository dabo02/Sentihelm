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
module.exports = function (io, Parse, Client, User) {
    'use strict';

    var chatServer = io,
        ChatLog = Parse.Object.extend('ChatLog'),
        chatEndpoints = {},
        second = 1000,
        usernames = {},
        ids = {};

    chatServer.heartbeatTimeout = 60 * second;

    // helper methods

    // check to see weather a specific user has admin permissions
    function hasAdmin(username, callback) {

        new Parse.Query(User)
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
        if (ids[username]) {
            callback(null, ids[username]);
        } else {
            new Parse.Query(User)
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

    }

    function getUsername(clientId) {
        if (usernames[clientId]) {
            return {
                then: function (s) {
                    s(usernames[clientId]);
                }
            }
        }

        return new Parse.Query(User)
            .equalTo('objectId', clientId)
            .find()
            .then(function (results) {
                var username = results[0].attributes.username;

                usernames[clientId] = username;

                return username;
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
         * This should be the first function that runs as a new socket connects,
         * run directly as a result of the 'start' message
         * @param {JSON Object} data contains the socket's user info; username: {String} and role: {String}.
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
                    socket.username = username;
                    socket.admin = true;
                    getObjectId(socket.username, function (err, id) {
                        if (!err && id) {
                            socket.userObjectId = id;
                        }
                    });

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
                                var args = ['new-room', room, username, id];
                                if (error) {

                                } else {

                                    if (data.tipId) {
                                        args.push(data.tipId);
                                    }

                                    adminSocket.emit.apply(adminSocket, args);
                                    socket.userObjectId = id;
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

        /**
         * parses each message to be sent, it either decrypts it if it comes from
         * a mobile client or encrypts it if it's comming from sentihelm.
         * @param {Message} data contains all the message metadata.
         */
        function routeMessage(data) {
            var room = socket.room,
                message = "",
                passPhrase = '';

            function sendError(error) {
                socket.emit('errorMessage', {
                    status: 503,
                    error: 'Internal Server Error',
                    message: error.message
                });
            }

            function sendMessage(message) {
                try {
                    socket.emit('new-message', data);
                    chatEndpoints[ns].rooms[room].log.push(data);
                    socket.to(room)
                        .emit('new-message', {
                            dateTime: data.dateTime,
                            sender: data.sender,
                            receiver: data.receiver,
                            message: message
                        });
                } catch (e) {
                    console.warn(e.message);
                    sendError(e);
                }
            }

            if (room) {
                data.dateTime = Date.now();

                if (chatEndpoints[ns].activeAdmins.indexOf(socket) !== -1) {
                    getUsername(data.receiver)
                        .then(function (u) {
                            passPhrase = passwordGenerator.generatePassword(u);
                            sendMessage(encryptionManager.encrypt(passPhrase, data.message));
                        });
                } else {
                    getUsername(data.sender)
                        .then(function (u) {
                            passPhrase = passwordGenerator.generatePassword(u);
                            sendMessage(encryptionManager.decrypt(passPhrase, data.message));
                        });
                }

            }

            if (data.tipId) {
                var controlNumber = '',
                    tipReportQuery = new Parse.Query(Parse.Object.extend('TipReport')),
                    chatLogQuery = new Parse.Query(ChatLog);


                tipReportQuery.get(data.tipId)
                    .then(function (tip) {
                        chatLogQuery
                            .equalTo('tipId', {
                                __type: 'Pointer',
                                className: 'TipReport',
                                objectId: tip.id
                            })
                            .limit(1)
                            .find()
                            .then(function (chatLogs) {
                                var chatLog = {};
                                if (chatLogs[0] != undefined) {
                                    chatLog = chatLogs[0];
                                    return chatLog;
                                } else {
                                    chatLog = new ChatLog();

                                    chatLog
                                        .set('tipId', {
                                            __type: 'Pointer',
                                            className: 'TipReport',
                                            objectId: tip.id
                                        })
                                        .set('controlNumber', tip.id + tip.controlNumber)
                                        .set('client', {
                                            __type: 'Pointer',
                                            className: 'Client',
                                            objectId: ns
                                        })
                                        .save();

                                    return chatLog;
                                }
                            }, function (error) {
                                sendError(error);
                            })
                            .then(function (chatLog) {
                                chatLog
                                    .add('logs', {
                                        sender: data.sender,
                                        receiver: data.receiver,
                                        message: data.message,
                                        dateTime: Date.now()
                                    })
                                    .save();
                            });
                    }, function (error) {
                        sendError(message);
                    });
            }
        }

        /**
         * This function changes the room of an admin's socket to the one they want
         * @param {String} room The name of the room they requested.
         */
        function changeRoom(room) {
            if (socket.admin === true) {
                socket.room = room;
                socket.emit('room-changed');
            }
        }

        /**
         * Saves the chat session's log file to a table in parse.
         * @param  {String} sessionId The name associtated with the chat's log
         * @param  {String} room      The room to save with the sessionId
         * @return {void}
         */
        function save(sessionId, room) {
            var admin = chatEndpoints[ns].activeAdmins.indexOf(socket) !== -1,
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

                socket.emit('saved-failed');
            } else {
            }
        }

        /**
         * Takes the current socket and removes it from it's current rooms and
         * runs other disconnect logic.
         */
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

        function userTyping(data) {
            var room = socket.room;

            if (room) {
                socket.to(room)
                    .emit('typing', data.username);
            }
        }

        /**
         * Start Tip Chat Specific Code.
         * */

        function onGetAllLogs(password) {
            console.log('In get all logs');
            if (password === 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@' && socket.admin === true) {
                new Parse.Query(ChatLog)
                    .equalTo('client', {
                        __type: 'Pointer',
                        className: 'Client',
                        objectId: ns
                    })
                    .find()
                    .then(function (logs) {
                        var allLogs = [];

                        logs.forEach(function (log, logIndex, logArray) {
                            var tip = log.get('tip'),
                                tipObjectId = tip.get('objectId'),
                                user = tip.get('user'),
                                username = user.get('username'),
                                userId = user.get('objectId'),
                                controlNumber = log.get('controlNumber'),
                                encryptedMessages = log.get('logs'),
                                messages = [],
                                passwords = {};

                            encryptedMessages.forEach(function (encryptedMessage, messageIndex, messageArray) {
                                var prop = encryptedMessage.sender === socket.userObjectId ? 'receiver' : 'sender',
                                    password = '';

                                function decrypt(prop, cb) {
                                    if (passwords[encryptedMessage[prop]]) {
                                        password = passwords[encryptedMessage[prop]];

                                        var message = encryptionManager.decrypt(password, encryptedMessage.message);

                                        cb(message);
                                    } else {
                                        getUsername(encryptedMessage[prop], function (username) {
                                            password = passwordGenerator.generatePassword(username);
                                            passwords[encryptedMessage[prop]] = password;
                                            cb(encryptionManager.decrypt(password, message));
                                        });
                                    }
                                }


                                decrypt(prop, function (message) {
                                    messages.push(message);

                                    if (messageArray.length === messageIndex + 1) {
                                        // sorts messaging in ascending order depending on dateTime
                                        messages.sort(function (a, b) {
                                            return a.dateTime < b.dateTime ? -1 : (a.dateTime > b.dateTime ? 1 : 0);
                                        });

                                        allLogs.push({
                                            controlNumber: controlNumber,
                                            tipObjectId: tipObjectId,
                                            tipUsername: username,
                                            tipUserId: userId,
                                            messages: messages
                                        });
                                    }

                                });

                            });
                        });

                        return allLogs;

                    }, function (error) {

                        socket.emit('get-all-logs-error', new Error("Nothing to get"));

                    })
                    .then(function (allLogs) {
                        socket.emit('get-all-logs-result', allLogs);
                    });
            } else {
                socket.emit('error', {
                    status: 401,
                    error: "No Access",
                    content: "You are not authorized to access this data."
                });
            }
        }

        function onAddTipToLog(tipId) {

        }

        function onAddMessageToLog(controlNumber, tipId) {

        }


        function onGetLog(tipId) {
            new Parse.Query(ChatLog)
                .equalTo('tipId', {
                    __type: 'Pointer',
                    className: 'TipReport',
                    objecId: tipId
                })
                .find()
                .then(function (results) {
                    if (results.length > 0) {
                        var tipChatInfo = results[0],
                            controlNumber = tipChatInfo.get('controlNumber'),
                            tip = tipChatInfo.get('tipId'),
                            tipObjectId = tip.get('objectId'),
                            tipUser = tip.get('user'),
                            username = tipUser.get('username'),
                            userId = tipUser.get('objectId'),
                            messages = tipChatInfo.get('logs'),
                            tipChatObject = {
                                controlNumber: controlNumber,
                                tipObjectId: tipObjectId,
                                tipUsername: username,
                                tipUserId: userId,
                                messages: messages
                            },
                            options = {},
                            decryptedMessages = [],
                            passwords = [];

                        if (arguments.length > 1) {
                            options = arguments[1];
                            if (options.decrypt === true
                                && socket.admin === true
                                && options.password === 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {


                                tipChatObject.messages.forEach(function (message, index, array) {


                                    function decrypt(prop, cb) {
                                        var password = '';
                                        if (passwords[message[prop]]) {
                                            password = passwords[message[prop]];

                                            var message = encryptionManager.decrypt(password, message.message);

                                            cb(message);
                                        } else {
                                            getUsername(message[prop], function (username) {
                                                password = passwordGenerator.generatePassword(username);
                                                passwords[message[prop]] = password;
                                                cb(encryptionManager.decrypt(password, message));
                                            });
                                        }
                                    }

                                    decrypt(message.sender === socket.userObjectId ? 'receiver' : 'sender', function (decryptedMessage) {
                                        message.message = decryptedMessage;
                                        decryptedMessages.push(message);
                                    });

                                    if (index == array.length - 1) {
                                        tipChatObject.messages = decryptedMessages;
                                        return tipChatObject;
                                    }
                                });
                            } else {
                                socket.emit('error', {
                                    status: 401,
                                    error: 'unauthorized access',
                                    content: 'You are not authorized to use this feature'
                                })
                            }
                        } else {
                            return tipChatObject;
                        }

                    } else {
                        socket.emit('error', {
                            status: 404,
                            error: 'Not Found',
                            content: 'You resource not found, no logs'
                        })
                    }
                }, function (err) {
                    socket.emit('error', {
                        status: 503,
                        error: 'Not Found',
                        content: 'Something went wrong while looking up at the database.'
                    })
                })
                .then(function (tipChatObject) {
                    socket.emit('get-log-result', tipChatObject);
                });
        }

        /**
         * End Tip Chat Specific Code.
         * */

            // bind events to functions
        socket
            .on('start', connect)
            .on('message-sent', routeMessage)
            .on('change-room', changeRoom)
            //.on('test', test)
            .on('save', save)
            //.on('typing', userTyping)
            .on('disconnect', disconnectChat)
            .on('get-all-logs', onGetAllLogs)
            .on('request-messages', onGetLog);
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
