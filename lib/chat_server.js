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
module.exports = function (io, Parse, Client, User, app) {
    'use strict';

    var chatServer = io,
        ChatLog = Parse.Object.extend('ChatLog'),
        TipChatLog = Parse.Object.extend('ChatLog'),
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

                /**
                 * Reconnects admin socket to it's previous rooms if the rooms haven't been terminated yet.
                 * */
                function reconnect() {
                    Object.keys(chatEndpoints[ns].rooms).forEach(function (roomName) {
                        var room = chatEndpoints[ns].rooms[roomName],
                            args = ['new-room'];
                        if (room.admin === username) {

                            args.push(roomName);
                            args.push(room.with.username);
                            args.push(room.with.id);
                            args.push(room.tipId || null);

                            socket.join(roomName);
                            socket.emit.apply(socket, args);
                        }
                    });
                }

                if (admin !== true) {
                    socket.emit('no-access', {
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

                    // reconnect the admin socket to it's previous chats if it didn't disconnect gracefully
                    setTimeout(reconnect, 2000);

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

                                    chatEndpoints[ns].rooms[room] = {
                                        admin: adminSocket.username,
                                        with: {
                                            username: username,
                                            id: id
                                        },
                                        log: []
                                    };

                                    if (data.tipId) {
                                        args.push(data.tipId);
                                        chatEndpoints[ns].rooms[room].tipId = data.tipId;
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
                var saveObject = {
                    dateTime: data.dateTime,
                    sender: data.sender,
                    receiver: data.receiver,
                    message: message.toString()
                };
                try {
                    socket.emit('new-message', data);
                    chatEndpoints[ns].rooms[room].log.push(data);
                    socket.to(room).emit('new-message', saveObject);

                    if (data.tipId) {
                        var controlNumber = '',
                            tipReportQuery = new Parse.Query(Parse.Object.extend('TipReport')),
                            chatLogQuery = new Parse.Query(TipChatLog);

                        console.log(chatLogQuery);

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
                                        var chatLog = {},
                                            oId = ns.split('/')[2];
                                        if (chatLogs[0] != undefined) {
                                            chatLog = chatLogs[0];
                                            return chatLog;
                                        } else {
                                            chatLog = new TipChatLog();

                                            chatLog
                                                .set('active', true)
                                                .set('tipId', {
                                                    __type: 'Pointer',
                                                    className: 'TipReport',
                                                    objectId: tip.id
                                                })
                                                .set('controlNumber', tip.id + tip.get('controlNumber'))
                                                .set('clientId', {
                                                    __type: 'Pointer',
                                                    className: 'Client',
                                                    objectId: oId
                                                })
                                                .save();

                                            return chatLog;
                                        }
                                    }, function (error) {
                                        sendError(error);
                                    })
                                    .then(function (chatLog) {
                                        var save = {};

                                        if (socket.admin === true) {
                                            save = saveObject;
                                        } else {
                                            save = data;
                                        }

                                        chatLog
                                            .add('logs', save)
                                            .save({
                                                success: function () {
                                                    console.log('saved');
                                                }, error: function (e) {
                                                    console.log(e.message);
                                                }
                                            });
                                    });
                            }, function (error) {
                                sendError(error.message);
                            });
                    }

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
                ChatLog = Parse.Object.extend('ChatLog'),
                chatLog = {},
                log = '';
            if (room && admin && sessionId) {
                chatLog = new ChatLog();
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
            var index = -1;

            if (socket.admin === true) {

                // leave each room the admin socket is associated with.
                socket.rooms.forEach(function (room) {
                    socket.leave(room);
                    socket.room = null;
                });

                // remove admin from active admins list
                index = chatEndpoints[ns].activeAdmins.indexOf(socket);
                chatEndpoints[ns].activeAdmins.splice(index, 1);

                console.log('Admin %s has disconnected', socket.username);
            } else {
                socket.leave(socket.room);
                try {
                    // try to get the admin socket associated with the client socket's room and alert them
                    // that the client has disconnected and then leave the room.
                    chatEndpoints[ns].activeAdmins.forEach(function (adminSocket) {
                        if (adminSocket.username === chatEndpoints[ns].rooms[socket.room].admin) {
                            adminSocket.leave(socket.room);
                            adminSocket.emit('leave-room', socket.room);
                        }
                    });
                    delete chatEndpoints[ns].rooms[socket.room];
                } catch (e) {
                    console.log(e.message);
                }
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

        function onGetLog(tipId) {
            new Parse.Query(TipChatLog)
                // get the log associated with the specified tipId
                .equalTo('tipId', {
                    __type: "Pointer",
                    className: "TipReport",
                    objectId: tipId
                })
                .first() // get only the first object
                .then(function (tipChatInfo) {
                    var messages = [],
                        temp;

                    // check if the tipChatInfo parse object is defined, if so
                    // copy over the messages array.
                    if (tipChatInfo) {
                        temp = tipChatInfo.get('logs');
                        if (temp) {
                            messages = temp;
                        }
                    }
                    return messages;

                }, function (err) {
                    socket.emit('request-messages-error', {
                        status: 503,
                        error: 'Not Found',
                        content: 'Something went wrong while looking up at the database.'
                    });
                })
                .then(function (messages) {
                    // alert the requesting socket of the resulting array.
                    socket.emit('request-messages-result', messages);
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

    app.route('/get-all-logs/:ns')
        .post(function (req, res) {
            var password = req.body.password,
                ns = req.params.ns;
            if (password === 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
                new Parse.Query(TipChatLog)
                    .equalTo('clientId', {
                        __type: 'Pointer',
                        className: 'Client',
                        objectId: ns
                    })
                    .equalTo('active', true)
                    .find()
                    .then(function (logs) {
                        var allLogs = [];

                        logs.forEach(function (log, logIndex, logArray) {
                            var tip = log.get('tipId'),
                                tipObjectId = tip.id,
                                controlNumber = log.get('controlNumber'),
                                encryptedMessages = log.get('logs');

                            if (encryptedMessages) {
                                new Parse.Query(Parse.Object.extend('TipReport'))
                                    .include('user')
                                    .get(tipObjectId)
                                    .then(function (tipObject) {
                                        if (tipObject) {
                                            var username = tipObject.get('user').get('username'),
                                                userId = tipObject.get('user').id,
                                                messages = [];
                                            encryptedMessages.forEach(function (encryptedMessage) {
                                                var password = passwordGenerator.generatePassword(username);
                                                encryptedMessage.message = encryptionManager.decrypt(password, encryptedMessage.message);
                                                messages.push(encryptedMessage);
                                            });

                                            allLogs.push({
                                                controlNumber: controlNumber,
                                                tipObjectId: tipObjectId,
                                                tipUsername: username,
                                                tipUserId: userId,
                                                messages: messages
                                            });

                                            if (allLogs.length == logs.length) {
                                                res.send(allLogs);
                                            }
                                        } else {
                                            res.send([]);
                                        }
                                    });
                            } else {
                                res.send([]);
                            }

                        });

                    }, function (error) {

                        res.send(503, error.message);

                    });
            }
            else {
                res.send(401);
            }
        }
    );

    app.route('/add-tip-to-queue/:ns')
        .post(function (req, res) {
            var password = req.body.password,
                tipId = req.body.tipId,
                ns = req.params.ns,
                userObjectId = req.body.userObjectId,
                chatLog = {};

            if (password === 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
                new Parse.Query(Parse.Object.extend('TipReport'))
                    .get(tipId)
                    .then(function (tip) {
                        var controlNumber;
                        if (tip) {
                            controlNumber = userObjectId + tip.get('controlNumber');

                            new Parse.Query(TipChatLog)
                                .equalTo('controlNumber', controlNumber)
                                .find()
                                .then(function (results) {
                                    if (results.length > 0) {
                                        chatLog = results[0];
                                    } else {
                                        chatLog = new TipChatLog();
                                    }

                                    chatLog.set('controlNumber', controlNumber)
                                        .set('clientId', {
                                            __type: 'Pointer',
                                            className: 'Client',
                                            objectId: ns
                                        })
                                        .set('tipId', {
                                            __type: 'Pointer',
                                            className: 'TipReport',
                                            objectId: tip.id
                                        })
                                        .set('active', true)
                                        .save()
                                        .then(function (logObject) {
                                            var id = tip.id;
                                            res.json({
                                                tipId: id,
                                                controlNumber: logObject.get('controlNumber')
                                            });
                                        }, function (error) {
                                            console.log(error.message);
                                            res.status(503).send(error.message);
                                        });
                                }, function (err) {

                                });
                        } else {
                            res.status(402).send("Bad Request");
                        }
                    }, function (error) {
                        res.satus(503).send(error.message);
                    });
            } else {
                res.send(401);
            }

        });


// create client namespaces example: '/chat/otF8BLkDg8'

};
