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
        TipReport = Parse.Object.extend('TipReport'),
        TipChatLog = Parse.Object.extend('ChatLog'),
        chatEndpoints = {},
        second = 1000,
        usernames = {},
        ids = {},
        userQueue = [];

    chatServer.heartbeatTimeout = 60 * second;

    // helper methods

    function makeRoomName() {
        function randomString(length, chars) {
            var mask = '';
            if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (chars.indexOf('#') > -1) mask += '0123456789';
            if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
            var result = '';

            for (var i = length; i > 0; --i) {
                result += mask[Math.round(Math.random() * (mask.length - 1))];
            }

            return result;
        }

        return randomString(10, 'AS3$$#');
    }

    // check to see weather a specific user has admin permissions
    function hasAdmin(username) {

        return new Parse.Query(User)
            .include('clientId')
            .include('roles')
            .equalTo('username', username)
            .find()
            .then(function (results) {
                var user = results[0].attributes,
                    admin = false;

                if (user) {
                    admin = user.roles.indexOf('admin') !== -1;

                    return admin;
                } else {
                    return Parse.Promise.error('User not found');
                }


            }, function (error) {
                return Parse.Promise.error(error);
            });
    }

    function getObjectId(username) {
        if (ids[username]) {
            return Parse.Promise.as(ids[username]);
        } else {
            return new Parse.Query(User)
                .include('objectId')
                .equalTo('username', username)
                .find()
                .then(function (results) {
                    return results[0].id;
                }, function (err) {
                    return err;
                });
        }

    }

    function getUsername(clientId) {
        if (usernames[clientId]) {
            return Parse.Promise.as(usernames[clientId]);
        }

        return new Parse.Query(User)
            .equalTo('objectId', clientId)
            .find()
            .then(function (results) {
                var username = '';
                if (results[0] && typeof results[0].get === 'function') {
                    username = results[0].get('username');

                    if (username) {
                        usernames[clientId] = username;

                        return username;
                    } else {
                        return Parse.Promise.error('Unkonwn error');
                    }
                } else {
                    return Parse.Promise.error('Failed to get Username');
                }
            }, function (err) {
                console.warn(err);
            })
            .then(null, function (err) {
                console.warn(err);
            });
    }

    function getClientNames() {
        var oneDay = 8.64 * Math.pow(10, 7),
            q = new Parse.Query(Client),
            clients = [];

        return q.include('objectId')
            .find()
            .then(function (results) {
                if (results.length >= 1) {
                    results.forEach(function (result) {
                        clients.push(result.id);
                    });

                    return clients;
                } else {
                    return Parse.Promise.error('no ids');
                }
            }, function (error) {
                console.error(error.message);
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


        function addRoom(room, adminSocket, username, id) {
            chatEndpoints[ns].rooms[room] = {
                admin: adminSocket.username,
                with: {
                    username: username,
                    id: id
                },
                log: []
            };
        }

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

            function handle(admin) {

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

                function connectUserFromQueue() {
                    var userSocket = userQueue.pop(),
                        newRoom = makeRoomName(),
                        args = ['new-room', newRoom];

                    if (userSocket) {
                        userSocket.room = newRoom;
                        userSocket.join(newRoom);
                        socket.join(newRoom);
                        if (userSocket.tipId) {
                            args.push(userSocket.username, userSocket.userObjectId, userSocket.tipId);
                            addRoom(newRoom, socket, userSocket.username, userSocket.userObjectId);
                            chatEndpoints[ns].rooms[newRoom].tipId = userSocket.tipId;
                            socket.emit.apply(socket, args);

                            getObjectId(socket.username)
                                .then(function (id) {
                                    userSocket.emit('successful-connect', id);
                                }, function (err) {
                                    console.warn(err);
                                    userSocket.emit('no-admin');
                                });
                        }
                    }
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
                    getObjectId(socket.username).then(function (id) {
                        socket.userObjectId = id;
                    }, function (err) {
                        console.warn(err);
                    });

                    chatEndpoints[ns].activeAdmins.push(socket);

                    // reconnect the admin socket to it's previous chats if it didn't disconnect gracefully
                    setTimeout(reconnect, 2000);
                    setTimeout(connectUserFromQueue, 2000);

                    console.log('An admin has connected');
                } else {
                    socket.emit('error', {
                        status: 500,
                        error: 'Internal Server Error',
                        content: 'There was an unknown action performed that gave an unknown result'
                    });
                }
            }

            function connectUserAndAdmin(adminSocket, id) {
                var args = ['new-room', room, username, id];

                addRoom(room, adminSocket, username, id);

                if (socket.tipId) {
                    args.push(data.tipId);
                    chatEndpoints[ns].rooms[room].tipId = socket.tipId;
                }

                adminSocket.emit.apply(adminSocket, args);

                getObjectId(adminSocket.username)
                    .then(function (id) {
                        socket.emit('successful-connect', id);
                    }, function (er) {
                        console.log(er);
                    });

            }

            // non-strict check for null and undefined and strict check for type of 'string'
            if (username != null && typeof username === 'string') {
                if (askingAdmin) {
                    hasAdmin(username).then(handle);
                } else {
                    // TODO since this is a user, connect user to an available admin
                    room = makeRoomName();

                    if (chatEndpoints[ns].nextAdmin > chatEndpoints[ns].activeAdmins.length - 1) {
                        chatEndpoints[ns].nextAdmin = 0;
                    }

                    currentAdmin = chatEndpoints[ns].nextAdmin++;
                    adminSocket = chatEndpoints[ns].activeAdmins[currentAdmin];

                    socket.username = username;

                    getObjectId(username).then(function (id) {
                        socket.userObjectId = id;
                    }, function (e) {
                        console.log(e);
                    });

                    if (data.tipId) {
                        socket.tipId = data.tipId;
                    }

                    if (adminSocket) {
                        adminSocket.join(room, function (err) {


                            adminSocket.room = room;
                            getObjectId(username)
                                .then(function (id) {
                                    return Parse.Promise.as(adminSocket, id);
                                }, function (er) {
                                    console.warn(er);
                                })
                                .then(connectUserAndAdmin, null);
                            socket.join(room);
                            socket.room = room;

                            console.log("Creating new room: %s", room);

                        });

                    } else {
                        userQueue.push(socket);
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
                passPhrase = '',
                pushNotificationObject = {};

            function sendError(error) {
                socket.emit('errorMessage', {
                    status: 503,
                    error: 'Internal Server Error',
                    message: error
                });
            }

            function sendPush(pObject) {
                return Parse.Push.send(pObject)
                    .then(function () {
                        console.log('Successfully sent push notification to user %s', pObject.channels[0]);
                        return "success";
                    }, function (error) {
                        if (pushTries < 5) {
                            pushTries += 1;
                            console.log(error.message);
                            return sendPush();
                        } else {
                            return this.reject(Error("Couldn't sent push"));
                        }
                    });
            }

            function sendMessage(message) {

                var saveObject = {
                    dateTime: data.dateTime,
                    sender: data.sender,
                    receiver: data.receiver,
                    message: message.toString(),
                    tipId: data.tipId || undefineds
                };

                function pphHandleTipChatLog(chatLogs, tip) {
                    var chatLog = {},
                        oId = ns.split('/')[2];


                    if (chatLogs[0] != undefined) {
                        chatLog = chatLogs[0];
                        return Parse.Promise.as(chatLog, saveObject);
                    } else {
                        chatLog = new TipChatLog();

                        return chatLog
                            .set('active', true)
                            .set('tipId', {
                                __type: 'Pointer',
                                className: 'TipReport',
                                objectId: tip.id
                            })
                            .set('controlNumber', tip.id + '-' + tip.get('controlNumber'))
                            .set('clientId', {
                                __type: 'Pointer',
                                className: 'Client',
                                objectId: oId
                            })
                            .save()
                            .then(function (chatLog) {
                                return Parse.Promise.as(chatLog, saveObject);
                            });
                    }
                }

                function pphAddToTipChatLog(chatLog, saveObject) {
                    var save = {};

                    if (socket.admin === true) {
                        save = saveObject;
                    } else {
                        save = data;
                    }

                    return chatLog
                        .add('logs', save)
                        .save();
                }

                function pphHandleTipReportQuery(tip) {
                    return chatLogQuery
                        .equalTo('tipId', {
                            __type: 'Pointer',
                            className: 'TipReport',
                            objectId: data.tipId
                        })
                        .limit(1)
                        .find()
                        .then(function (chatLogs) {
                            return Parse.Promise.as(chatLogs, tip);
                        });
                }

                function logSuccess(chatLog) {
                    console.log("Saved %s chat log", chatLog.get('controlNumber'));
                }

                try {
                    socket.emit('new-message', data);
                    try {
                        chatEndpoints[ns].rooms[room].log.push(data);
                    } catch (e) {
                        console.warn(e.message);
                    }
                    try {
                        socket.to(room).emit('new-message', saveObject);
                    } catch (e) {
                        console.log(e.message);
                    }

                    if (data.tipId) {
                        var controlNumber = '',
                            tipReportQuery = new Parse.Query(TipReport),
                            chatLogQuery = new Parse.Query(TipChatLog);
                        tipReportQuery.get(data.tipId)
                            .then(pphHandleTipReportQuery, function (error) {
                                sendError(error.message);
                            })
                            .then(pphHandleTipChatLog)
                            .then(pphAddToTipChatLog, function (error) {
                                sendError(error);
                            })
                            .then(logSuccess);
                    }

                } catch (e) {
                    console.warn(e.message);
                    sendError(e);
                }
            }

            if (data.tipId && socket.admin === true && socket.room == undefined) {
                pushNotificationObject = {
                    channels: ['user_' + data.receiver],
                    data: {
                        alert: "An officer is trying to followup regarding this tip: " + data.tipId,
                        badge: "Increment",
                        sound: "cheering.caf",
                        title: "Chat",
                        tipId: data.tipId,
                        type: "chat"
                    }
                };

                sendPush(pushNotificationObject).then(function () {
                    getUsername(data.receiver)
                        .then(function (u) {
                            passPhrase = passwordGenerator.generatePassword(u);
                            sendMessage(encryptionManager.encrypt(passPhrase, data.message));
                            new Parse.Query(TipReport)
                                .get(data.tipId)
                                .then(function (tip) {
                                    if (tip) {
                                        tip.set('chatSeenByUser', false);
                                        tip.save();
                                    }
                                });
                        });
                });


            } else {
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

                if (data.tipId) {
                    new Parse.Query(TipReport)
                        .get(data.tipId)
                        .then(function (tip) {
                            if (tip) {
                                tip.set('chatSeenByUser', true);
                                tip.save();
                            }
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
                if (socket.rooms.indexOf(room) === -1 && room != undefined) {
                    socket.join(room);
                }
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
            } else {
                socket.emit('saved-failed');
            }
        }

        /**
         * Takes the current socket and removes it from it's current rooms and
         * runs other disconnect logic.
         */
        function disconnectChat() {
            var index = -1;


            function cFindAdminSetInactiveLog(adminSocket) {
                if (adminSocket.username === chatEndpoints[ns].rooms[socket.room].admin) {
                    adminSocket.leave(socket.room);
                    adminSocket.emit('leave-room', socket.room);

                    if (adminSocket.room === socket.room) {
                        adminSocket.room = null;
                    }

                    // since it's the user that disconnected, attempt to set it's chat log to inactive
                    new Parse.Query(TipChatLog)
                        .equal('tipId', {
                            __type: 'Pointer',
                            className: 'TipReport',
                            objectId: chatEndpoints[ns].rooms[socket.room].tipId
                        })
                        .first()
                        .then(function (chatLog) {
                            if (chatLog) {
                                return Parse.Promise.as(chatLog);
                            } else {
                                return Parse.Promise.error('couldn\'t find');
                            }
                        }, null)
                        .then(function (chatLog) {
                            chatLog
                                .set('active', false)
                                .save();
                        }, function (e) {
                            console.info(e.message);
                        });

                }
            }

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
                    chatEndpoints[ns].activeAdmins.forEach(cFindAdminSetInactiveLog);

                    new Parse.Query(TipReport)
                        .get(chatEndpoints[ns].rooms[socket.room].tipId)
                        .then(function (tip) {
                            if (tip) {
                                tip.set('chatSeenByUser', true);
                                tip.save().then(function () {
                                    delete chatEndpoints[ns].rooms[socket.room];
                                });
                            }
                        });

                } catch (e) {
                    console.log(e.message);
                }
            }
        }

        function userTyping() {
            var room = socket.room;

            if (room) {
                socket.to(room).emit('typing', room);
            }
        }

        function userStopTyping() {
            var room = socket.room;

            if (room) {
                socket.to(room).emit('stop-typing', room);
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
            .on('user-typing', userTyping)
            .on('user-stop-typing', userStopTyping)
            .on('disconnect', disconnectChat)
            .on('request-messages', onGetLog);
    }

    function gettingNames(clients) {
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
    }

    getClientNames().then(gettingNames, function (er) {
        console.error(er);
    });

    function nsParam(req, res, next) {
        req.ns = req.params.ns;
        next();
    }

    function auth(req, res, next) {
        if (req.body.password === 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
            next();
        } else {
            res.send(401);
        }
    }

    app
        .route('/chat-logs/:ns/retrieve')
        .post(auth, function (req, res) {
            var ns = req.params.ns;

            function ppHandleTipRerpotQuery(tipObject, allLogs, logArray, encryptedMessages, controlNumber) {
                if (tipObject) {
                    var username = tipObject.get('user').get('username'),
                        userId = tipObject.get('user').id,
                        messages = [],
                        raw_crime = tipObject.get('crimeType').base64,
                        crimeType = encryptionManager.decrypt(passwordGenerator.generatePassword(username), raw_crime);

                    if (encryptedMessages) {
                        encryptedMessages.forEach(function (encryptedMessage) {
                            var password = passwordGenerator.generatePassword(username);
                            encryptedMessage.message = encryptionManager.decrypt(password, encryptedMessage.message);
                            messages.push(encryptedMessage);
                        });
                    }

                    addLog(controlNumber, tipObject.id, username, userId, messages, crimeType, logArray, allLogs);

                    return Parse.Promise.as(allLogs, logArray);
                } else {
                    res.send([]);
                }
            }


            function addLog(controlNumber, tipObjectId, username, userId, messages, crimeType, logArray, allLogs) {
                allLogs.push({
                    controlNumber: controlNumber,
                    tipObjectId: tipObjectId,
                    tipUsername: username,
                    tipUserId: userId,
                    messages: messages,
                    crimeType: crimeType
                });
            }

            function ppHandleChatLogQuery(logs) {
                var allLogs = [];


                function checkIfListIsFullyDecrypted(decryptedArray, encryptedArray) {
                    if (decryptedArray.length === encryptedArray.length) {
                        res.send(decryptedArray);
                    }
                }

                function iterateOverEncryptedLogs(log, logIndex, logArray) {
                    var tip = log.get('tipId'),
                        tipObjectId = tip.id,
                        controlNumber = log.get('controlNumber'),
                        encryptedMessages = log.get('logs');

                    new Parse.Query(TipReport)
                        .include('user')
                        .get(tipObjectId)
                        .then(function (tip) {
                            return Parse.Promise.as(tip, allLogs, logArray, encryptedMessages, controlNumber);
                        })
                        .then(ppHandleTipRerpotQuery, function (er) {
                            console.warn(er);
                        }).then(checkIfListIsFullyDecrypted);
                }

                logs.forEach(iterateOverEncryptedLogs);

            }

            function orSendError(error) {
                res.send(503, error.message);
            }

            new Parse.Query(TipChatLog)
                .equalTo('clientId', {
                    __type: 'Pointer',
                    className: 'Client',
                    objectId: ns
                })
                .equalTo('active', true)
                .find()
                .then(ppHandleChatLogQuery, orSendError);
        });
    app
        .route('/chat-logs/:ns/add')
        .post(auth, function (req, res) {
            var tipId = req.body.tipId,
                ns = req.params.ns;

            function pphHandleTipQueryStep1(tip) {
                if (tip) {
                    return Parse.Promise.as(tip);
                } else {
                    return Parse.Promise.error('TipNotFound');
                }
            }

            function pphHandleTipQueryStep2(tip) {
                return new Parse.Query(TipChatLog)
                    .equalTo('controlNumber', tip.id + '-' + tip.get('controlNumber'))
                    .first()
                    .then(function (chatLog) {
                        if (chatLog) {
                            return Parse.Promise.as(chatLog, tip);
                        } else {
                            return Parse.Promise.error(tip);
                        }
                    }, null);
            }


            function pphSetChatLogActive(chatLog, tipInfo) {
                return chatLog.set('active', true).save().then(function (chatLog) {
                    return Parse.Promise.as(chatLog, tipInfo);
                }, null);
            }

            function pphCreateChatLog(tipInfo) {
                if (tipInfo) {
                    return new TipChatLog()
                        .set('clientId', {
                            __type: 'Pointer',
                            className: 'Client',
                            objectId: ns
                        })
                        .set('tipId', {
                            __type: 'Pointer',
                            className: 'TipReport',
                            objectId: tipInfo.id
                        })
                        .set('controlNumber', tipInfo.id + '-' + tipInfo.get('controlNumber'))
                        .save()
                        .then(function (chatLog) {
                            return Parse.Promise.as(chatLog, tipInfo)
                        })
                        .then(pphSetChatLogActive, null);
                } else {
                    return Parse.Promise.error('Something went wrong, we don\'t know what.');
                }
            }

            function pphSendSuccess(chatLog, tipInfo) {
                var userId = tipInfo.get('user').id;

                new Parse.Query(User)
                    .get(userId)
                    .then(function (user) {
                        if (user) {
                            return user.get('username');
                        } else {
                            return Parse.Promise.error("Can't get username");
                        }
                    }, null)
                    .then(function (username) {
                        try {
                            var password = passwordGenerator.generatePassword(username);
                            var crimeTypeEncrypted = tipInfo.get('crimeType').base64;
                            var crimeType = encryptionManager.decrypt(password, crimeTypeEncrypted);

                            res.status(200).json({
                                controlNumber: chatLog.get('controlNumber'),
                                tipObjectId: tipInfo.id,
                                crimeType: crimeType
                            });

                            return Parse.Promise.as('Successfully added tip with controlNumber %s to chat queue', chatLog.get('controlNumber'));
                        } catch (e) {
                            console.warn(e.message);
                            return Parse.Promise.error(e.message);
                        }

                    }, null)
                    .then(function (message) {
                        console.info(message);
                    }, function (error) {
                        console.info(error.message);
                        res.send(503, error.message);
                    });

            }

            function pphHandleError(e) {
                console.error(e.message);

                res.send(503, e.message);
            }

            new Parse.Query(TipReport)
                .get(tipId)
                .then(pphHandleTipQueryStep1)
                .then(pphHandleTipQueryStep2, pphHandleError)
                .then(pphSetChatLogActive, pphCreateChatLog)
                .then(pphSendSuccess, pphHandleError);

        });


// create client namespaces example: '/chat/otF8BLkDg8'

};
