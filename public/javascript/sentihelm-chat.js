/**
 * Created by Victor A. Martinez on 1/26/2015.
 */



(function (angular, undefined) {
    'use strict';
    var User = Parse.Object.extend("User");

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
            }
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
        .factory('tipChatService', ['chatSocket', '$http', 'Session', function (chatSocket, $http, Session) {
            var password = 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@',

                chatLogsUrl = '/chat-logs/' + Session.clientId,

                tipChatService = {
                    activeChats: [],
                    retrieveAll: function (cb) {
                        return $http.post(chatLogsUrl + '/retrieve', { password: password })
                            .success(function (data) {
                                tipChatService.activeChats = angular.copy(data);
                            });


                    },
                    addTipToQueue: function (tipId, id) {
                        return $http.post(chatLogsUrl + '/add', {
                            password: password,
                            tipId: tipId,
                            userObjectId: id
                        }).then(function (dd) {
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
                }
            }

            chatSocket.on('new-room', onNewRoom);

            return tipChatService;
        }])
        .controller('ChatController', ['chatSocket', 'Session', '$rootScope', '$location', '$anchorScroll', 'messageFactory',
            function (chatSocket, Session, $rootScope, $location, $anchorScroll, messageFactory) {
                var ChatController = this;
                ChatController.message = '';
                ChatController.rooms = {};
                ChatController.currentRoom = '';
                ChatController.receiver = '';
                ChatController.canSend = false;

                // Private
                function getUserName(id) {
                    var username = '';

                    Object.keys(ChatController.rooms)
                        .forEach(function (room) {
                            var currentRoom = ChatController.rooms[room];
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
                        Object.keys(ChatController.rooms)
                            .forEach(function (room) {
                                var currentRoom = ChatController.rooms[room];
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
                    ChatController.message = '';
                    if (ChatController.rooms.hasOwnProperty(roomName) &&
                        ChatController.rooms[roomName].messages.length > 0) {
                        ChatController.save(id);
                    }
                }

                // Public
                ChatController.send = function () {

                    try {
                        chatSocket.emit('message-sent', messageFactory({
                            receiver: ChatController.receiver,
                            message: ChatController.message
                        }));
                    } catch (e) {
                        console.log(e.message);
                        ChatController.rooms[getRoom(undefined, ChatController.receiver)].messages.push({
                            dateTime: Date.now(),
                            message: e.message
                        });
                    }

                    ChatController.message = '';
                };

                // Public
                ChatController.onNewRoom = function (room, username, id) {
                    ChatController.rooms[room] = {
                        with: {
                            username: username,
                            id: id
                        },
                        messages: []
                    };
                };

                // Public
                ChatController.onNewMessage = function (data) {
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

                    if (room === ChatController.currentRoom) {
                        $location.hash(messageObject.id);
                        $anchorScroll();
                    }
                };

                // Public
                ChatController.changeRoom = function (id) {
                    var room = getRoom(undefined, id);

                    if (room) {
                        ChatController.receiver = ChatController.rooms[room].with.id;
                        ChatController.canSend = true;

                        if (ChatController.currentRoom !== room) {
                            chatSocket.emit('change-room', room);
                            ChatController.currentRoom = room;
                            $location.hash('chat-bottom');
                            $anchorScroll();
                        }

                    } else {
                        // TODO implement method that requests a chat with a user if not already chatting.
                        //ChatController.requestChat(username);
                        ChatController.canSend = false;
                        ChatController.currentRoom = '';
                    }
                };

                // Public
                ChatController.save = function (id) {
                    // TODO SAVE
                    var room = getRoom(undefined, id);

                    // remove room from memory
                    delete ChatController.rooms[room];
                    ChatController.canSend = false;
                };

                chatSocket.emit('change-space', 'video-streams');

                chatSocket.on('successful-connect', onConnectionSuccess);
                $rootScope.$on('delete-stream', onDeleteStream);
                chatSocket.on('new-message', ChatController.onNewMessage);
                chatSocket.on('new-room', ChatController.onNewRoom);
            }
        ])
        // TipChatController extends ChatController
        .controller('TipChatController', ['$scope', '$controller', 'tipChatService', 'chatSocket', 'Session', '$location', '$anchorScroll', 'messageFactory',
            function ($scope, $controller, tipChatService, chatSocket, Session, $location, $anchorScroll, messageFactory) {
                var TipChatController = this;
                TipChatController.message = '';
                TipChatController.rooms = {};
                TipChatController.currentRoom = '';
                TipChatController.receiver = '';
                TipChatController.canSend = false;


                function addTipRoom(roomName, username, id, tObject) {
                    TipChatController.rooms[roomName] = {
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

                    Object.keys(TipChatController.rooms)
                        .forEach(function (room) {
                            var currentRoom = TipChatController.rooms[room];
                            if (currentRoom.with.id === id) {
                                username = currentRoom.with.username;
                            }
                        });

                    return username;

                }

                function getRoom(controlNumber, tipId) {
                    for (var roomName in TipChatController.rooms) {
                        if (roomName === controlNumber || TipChatController.rooms[roomName].controlNumber === controlNumber || TipChatController.rooms[roomName].tipObjectId === tipId) {
                            return roomName;
                        }
                    }

                    return undefined;
                }


                /**
                 * This gets called whenever we're done retrieving all messages from every active tip chat.
                 * */
                function onRetrieveAllDone() {
                    tipChatService.activeChats.forEach(function (tipChat) {
                        if (!TipChatController.rooms.hasOwnProperty(tipChat.controlNumber)) {

                            addTipRoom(tipChat.controlNumber, tipChat.tipUsername, tipChat.tipUserId, tipChat);

                            console.log(TipChatController.rooms);

                            tipChat.messages.forEach(function (message) {
                                console.log(message);
                                message.tipId = tipChat.tipObjectId;
                                TipChatController.onNewMessage(message);
                            });
                        }
                    });
                }

                TipChatController.onNewMessage = function (data) {
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

                    messageObject.id = Math.round(Math.random() * 1000 + 1 + Date.now()).toString();

                    console.log(room);

                    if (room) {
                        TipChatController.rooms[room].messages.push(messageObject);

                        if (room === TipChatController.currentRoom) {
                            $location.hash(messageObject.id);
                            $anchorScroll();
                        }
                    }
                };

                TipChatController.onNewRoom = function (roomName, username, id, tipId) {
                    var found = false,
                        roomObject = undefined,
                        rn = "";

                    //Object.keys(TipChatController.rooms).forEach(function (lookingAt) {
                    //    var room = TipChatController.rooms[lookingAt];
                    //    if (room.with.id === id && room.with.username === username && room.tipId === tipId) {
                    //        TipChatController.rooms[roomName] = angular.copy(TipChatController.rooms[lookingAt]);
                    //        delete TipChatController.rooms[lookingAt];
                    //        found = true;
                    //    }
                    //});

                    for (rn in TipChatController.rooms) {
                        roomObject = TipChatController.rooms[rn];
                        if (roomObject.with.id === id && roomObject.with.username === username && roomObject.tipObjectId === tipId) {
                            TipChatController.rooms[roomName] = angular.copy(TipChatController.rooms[rn]);
                            delete TipChatController.rooms[rn];
                            found = true;
                            TipChatController.rooms[roomName].hide = false;
                            if (TipChatController.currentRoom === rn) {
                                TipChatController.currentRoom = roomName;
                            }
                            break;
                        }
                    }


                    if (!found && tipId) {
                        tipChatService.addTipToQueue(tipId, id)
                            .then(function (tObject) {

                                addTipRoom(roomName, username, id, tObject);
                            });
                    }
                };

                TipChatController.changeRoom = function (controlNumber) {

                    TipChatController.canSend = false;

                    for (var roomName in TipChatController.rooms) {
                        if (TipChatController.rooms[roomName].controlNumber === controlNumber) {
                            TipChatController.currentRoom = roomName;
                            var messages = TipChatController.rooms[roomName].messages;
                            if (messages.length > 0) {
                                $location.hash(messages[messages.length - 1].id);
                            }
                            $anchorScroll();

                            TipChatController.canSend = true;

                            TipChatController.receiver = TipChatController.rooms[roomName].with.id;

                            if (roomName !== controlNumber) {
                                chatSocket.send('change-room', roomName);
                            }

                            break;
                        }
                    }
                };

                TipChatController.send = function () {
                    var m = {};

                    try {
                        m = messageFactory({
                            receiver: TipChatController.receiver,
                            message: TipChatController.message
                        });

                        m.tipId = TipChatController.rooms[TipChatController.currentRoom].tipObjectId;
                        chatSocket.emit('message-sent', m);
                    } catch (e) {
                        console.log(e.message);
                    }

                    TipChatController.message = '';
                };

                chatSocket.on('new-message', TipChatController.onNewMessage);
                chatSocket.on('new-room', TipChatController.onNewRoom);

                tipChatService.retrieveAll().then(onRetrieveAllDone);
            }
        ])
    ;
})(window.angular);