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
                retrieveAll: function () {
                    return $http.post('/get-all-logs/' + Session.clientId, {password: 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@'})
                        .then(function (data) {
                            tipChatService.activeChats = angular.copy(data);
                        });


                },
                addTipToQueue: function (tipId) {
                    return $http.post('add-tip-to-log', {tip: tipId})
                        .then(function (tipInfo) {
                            tipChatService.activeChats.push(tipInfo);
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
        .factory('Chat', ['chatSocket', '$http', function ChatService(chatSocket, $http) {

            var Chat = {
                rooms: {},
                getUsername: function (id) {
                    var username = '';

                    Object.keys(Chat.rooms)
                        .forEach(function (room) {
                            var currentRoom = Chat.rooms[room];
                            if (currentRoom.with.id === id) {
                                username = currentRoom.with.username;
                            }
                        });

                    return username;

                },
                getRoom: function (username, id) {
                    var prop = username ? 'username' : (id ? 'id' : undefined),
                        roomName = '',
                        comparative = username || id || undefined;

                    if (prop && comparative) {
                        Object.keys(Chat.rooms)
                            .forEach(function (room) {
                                var currentRoom = Chat.rooms[room];
                                if (currentRoom.with[prop] === comparative) {
                                    roomName = room;
                                }
                            });
                        return roomName;
                    }

                    return undefined;
                },
                sendMessage: function (messageObject) {
                    chatSocket.emit('message-sent', messageObject);
                },
                onNewMessage: function (data) {
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

                        username = Chat.getUsername(receiver);
                    } else {
                        username = Chat.getUsername(sender);
                        messageObject.from = username;
                    }

                    room = Chat.getRoom(username);

                    Chat.rooms[room].messages.push(messageObject);
                },
                onNewRoom: function (room, username, id, otherProperties) {
                    Chat.rooms[room] = {
                        with: {
                            username: username,
                            id: id
                        },
                        messages: []
                    };

                    if (typeof otherProperties === 'object') {
                        Object.keys(otherProperties).forEach(function (key) {
                            Chat.rooms[room][key] = angular.copy(otherProperties[key]);
                        });
                    }
                },
                requestChat: function () {

                },
                save: function (id) {
                    // TODO SAVE
                    var room = Chat.getRoom(undefined, id);

                    // remove room from memory
                    delete Chat.rooms[room];
                }
            };

            return Chat;
        }])
        .controller('ChatController', ['chatSocket', 'Session', '$rootScope', '$location', '$anchorScroll', 'messageFactory', 'Chat',
            function (chatSocket, Session, $rootScope, $location, $anchorScroll, messageFactory, Chat) {
                var ChatController = this;
                ChatController.message = '';
                ChatController.currentRoom = '';
                ChatController.receiver = '';
                ChatController.canSend = false;

                // Private


                // Private
                function onConnectionSuccess() {
                    console.log('We are connected to chat server');
                }

                // Private
                function onDeleteStream(event, id) {
                    var roomName = Chat.getRoom(undefined, id);
                    ChatController.message = '';
                    if (Chat.rooms.hasOwnProperty(roomName) &&
                        Chat.rooms[roomName].messages.length > 0) {
                        Chat.save(id);
                        ChatController.canSend = false;
                    }
                }

                // Public
                ChatController.send = function () {

                    try {
                        Chat.sendMessage(messageFactory({
                            receiver: this.receiver,
                            message: this.message
                        }));
                    } catch (e) {
                        console.log(e.message);
                    }

                    ChatController.message = '';
                };

                // Public
                ChatController.onNewRoom = function () {
                    Chat.onNewRoom(room, username, id);
                };

                // Public
                ChatController.onNewMessage = function (data) {
                    Chat.onNewMessage(data);
                };

                // Public
                ChatController.changeRoom = function (id) {
                    var room = Chat.getRoom(undefined, id);

                    if (room) {
                        this.receiver = id;
                        this.canSend = true;

                        if (this.currentRoom !== room) {
                            chatSocket.emit('change-room', room);
                            this.currentRoom = room;
                            $location.hash('chat-bottom');
                            $anchorScroll();
                        }

                    } else {
                        // TODO implement method that requests a chat with a user if not already chatting.
                        //Chat.requestChat(username);
                        this.canSend = false;
                        this.currentRoom = '';
                    }
                };

                chatSocket.emit('change-space', 'video-streams');

                chatSocket.on('successful-connect', onConnectionSuccess);
                $rootScope.$on('delete-stream', onDeleteStream);
                chatSocket.on('new-message', ChatController.onNewMessage);
                chatSocket.on('new-room', ChatController.onNewRoom);
            }
        ])
        // TipChatController extends ChatController
        .controller('TipChatController', ['$scope', '$controller', 'tipChatService', 'chatSocket', 'Chat',
            function ($scope, $controller, tipChatService, chatSocket, Chat) {
                var Base = $controller('ChatController', {$scope: $scope}),
                    TipChatController = this;

                TipChatController.rooms[];

                /**
                 * This gets called whenever we're done retrieving all messages from every active tip chat.
                 * */
                function onRetrieveAllDone() {
                    tipChatService.activeChats.forEach(function (tipChat) {
                        if (Chat.rooms.hasOwnProperty(tipChat.controlNumber) !== true) {

                            Chat.onNewRoom(tipChat.controlNumber, tipChat.tipUsername, tipChat.userObjectId, {
                                controlNumber: tipChat.controlNumber,
                                tipObjectId: tipChat.tipObjectId,
                                messages: angular.copy(tipChat.messages),
                                tip: true,
                                show: true
                            });
                        }
                    });

                    Object.keys(Chat.rooms).forEach(function (roomName) {
                        var room = Chat.rooms[roomName];

                        if (room.tip === true) {
                            TipChatController.rooms[roomName] = angular.copy(room);
                        }
                    });
                }

                TipChatController.onNewMessage = function (data) {
                    Chat.onNewMessage(data);
                };

                TipChatController.onNewRoom = function (roomName, username, id) {
                    var found = false,
                        tipId = undefined;

                    if (arguments.length > 3) {
                        tipId = arguments[3];
                    }
                    Object.keys(Chat.rooms).forEach(function (theRoom) {
                        var room = Chat.rooms[theRoom];
                        if (room.with.id === id && room.with.username === username && room.controlNumber) {
                            TipChatController.rooms[roomName] = angular.copy(Chat.rooms[theRoom]);
                            delete Chat.rooms[theRoom];
                            found = true;
                        }
                    });

                    if (!found && tipId) {
                        tipChatService.addTipToQueue(tipId).then(function () {
                            tipChatService.retrieveAll().then(onRetrieveAllDone);
                        });
                    }
                };

                TipChatController.changeRoom = function (controlNumber, userId) {
                    // TODO: Override changeRoom functionality

                    //var pushNotificationObject = {},
                    //    pushTries = 0;
                    //
                    //function sendPush() {
                    //    return Parse.Push.send(pushNotificationObject)
                    //        .then(function () {
                    //            console.log('Successfully sent push notification to user %s', pushNotificationObject.channels[0]);
                    //            return "success";
                    //        }, function (error) {
                    //            if (pushTries < 5) {
                    //                pushTries += 1;
                    //                console.log(error.message);
                    //                return sendPush();
                    //            } else {
                    //                return this.reject(Error("Couldn't sent push"));
                    //            }
                    //        });
                    //}
                    //
                    //
                    //if (Chat.rooms.hasOwnProperty(controlNumber)) {
                    //    if (TipChatController.rooms[id].controlNumber === controlNumber) {
                    //        pushNotificationObject = {
                    //            channels: ['user_' + TipChatController.rooms[controlNumber].with.id],
                    //            data: {
                    //                type: 'chat',
                    //                tipObjectId: TipChatController.rooms[controlNumber].tipObjectId
                    //            }
                    //        };
                    //
                    //        sendPush().then(function () {
                    //            TipChatController.rooms[id].hide = true;
                    //        }, function (error) {
                    //
                    //        });
                    //
                    //    }
                    //} else if (Chat) {
                    //
                    //} else {
                    //
                    //}
                 };

                chatSocket.on('new-message', TipChatController.onNewMessage);
                chatSocket.on('new-room', TipChatController.onNewRoom);

                $scope.$watchCollection(tipChatService.activeChats, function () {
                    onRetrieveAllDone();
                });

                tipChatService.retrieveAll().then(onRetrieveAllDone);
            }]);
})(window.angular);
