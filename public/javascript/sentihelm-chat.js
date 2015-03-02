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
            var tipChatService = {
                activeChats: [],
                retrieveAll: function (cb) {
                    $http.post('/get-all-logs/' + Session.clientId, { password: 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@' })
                        .success(function (data) {
                            tipChatService.activeChats = angular.copy(data);
                            if (typeof cb === 'function') {
                                cb();
                            }
                         });


                },
                addTipToQueue: function (tipId, cb) {
                    chatSocket.emit('add-tip-to-logs', tipId);
                    chatSocket.on('add-tip-to-log-success', function (tipInfo) {
                        tipChatService.activeChats.push(tipInfo);
                        if (typeof cb === 'function') {
                            cb(null, tipInfo);
                        }
                    });
                }
            };

            tipChatService.retrieveAll();

            function onNewRoom(roomName, username, id, tipId) {
                var found = false;
                if (tipId != undefined) {
                    tipChatService.activeChats.forEach(function (activeChat) {
                        if (activeChat.tipObjectId === tipId) {
                            found = true;
                        }
                    });

                    if (!found) {
                        tipChatService.addTipToQueue(tipId);
                    }
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
        .controller('TipChatController', ['$scope', '$controller', 'tipChatService', 'chatSocket',
            function ($scope, $controller, tipChatService, chatSocket) {
                var Base = $controller('ChatController', {$scope: $scope}),
                    TipChatController = this;

                angular.extend(Base, TipChatController);

                TipChatController.rooms = {};

                /**
                 * This gets called whenever we're done retrieving all messages from every active tip chat.
                 * */
                function onRetrieveAllDone() {
                    tipChatService.activeChats.forEach(function (tipChat) {
                        if (TipChatController.rooms.hasOwnProperty(tipChat.controlNumber) !== true) {
                            TipChatController.rooms[tipChat.controlNumber] = {
                                with: {
                                    username: tipChat.tipUsername,
                                    id: tipChat.userObjectId
                                },
                                messages: [],
                                controlNumber: tipChat.controlNumber,
                                tipObjectId: tipChat.tipObjectId
                            }

                            tipChat.messages.forEach(function (message) {
                                TipChatController.onNewMessage(message);
                            });
                        }
                    });
                }

                TipChatController.onNewMessage = function (data) {
                    Base.onNewMessage.call(TipChatController, data);
                };

                TipChatController.onNewRoom = function (roomName, username, id) {
                    var found = false,
                        tipId = undefined;

                    if (arguments.length > 3) {
                        tipId = arguments[3];
                    }
                    Object.keys(TipChatController.rooms).forEach(function (lookingAt) {
                        var room = TipChatController.rooms[lookingAt];
                        if (room.with.id === id && room.with.username === username) {
                            TipChatController.rooms[roomName] = angular.copy(TipChatController.rooms[lookingAt]);
                            delete TipChatController.rooms[lookingAt];
                            found = true;
                        }
                    });

                    if (!found && tipId) {
                        tipChatService.addTipToQueue(tipId, function (tipChatInfo) {
                            Base.onNewRoom.call(TipChatController, roomName, username, id);
                            TipChatController.rooms[roomName].controlNumber = tipChatInfo.controlNumber;
                            TipChatController.rooms[roomName].tipObjectId = tipId;
                        });
                    }
                };

                TipChatController.changeRoom = function (controlNumber, userId) {
                    var pushNotificationObject = {},
                        pushTries = 0;

                    function sendPush() {
                        return Parse.Push.send(pushNotificationObject)
                            .then(function () {
                                console.log('Successfully sent push notification to user %s', pushNotificationObject.channels[0]);
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


                    if (TipChatController.rooms.hasOwnProperty(controlNumber)) {
                        if (TipChatController.rooms[id].controlNumber === controlNumber) {
                            pushNotificationObject = {
                                channels: ['user_' + TipChatController.rooms[controlNumber].with.id],
                                data: {
                                    type: 'chat',
                                    tipObjectId: TipChatController.rooms[controlNumber].tipObjectId
                                }
                            };

                            sendPush().then(function () {
                                TipChatController.rooms[id].hide = true;
                            }, function (error) {

                            });

                        } else {
                            Base.changeRoom.call(TipChatController, userId);
                        }
                    }
                };

                chatSocket.on('new-message', TipChatController.onNewMessage);
                chatSocket.on('new-room', TipChatController.onNewRoom);

                $scope.$watchCollection(tipChatService.activeChats, function () {
                    onRetrieveAllDone();
                });

                tipChatService.retrieveAll(onRetrieveAllDone);
            }]);
})(window.angular);
