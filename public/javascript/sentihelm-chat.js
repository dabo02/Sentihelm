/**
 * Created by Victor A. Martinez on 1/26/2015.
 */



(function (angular, undefined) {
    'use strict';
    var User = Parse.Object.extend("User");

    angular.module('sh.chat', ['btford.socket-io'])
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
                    ioSocket: io.connect(server + namespace)  // connect to chat server
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

                    Object.keys(ChatController.rooms).forEach(function (room) {
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
                        Object.keys(ChatController.rooms).forEach(function (room) {
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

                    room = getRoom(username);

                    ChatController.rooms[room].messages.push(messageObject);

                    if (room === ChatController.currentRoom) {
                        $location.hash('chat-bottom');
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

                chatSocket.on('successful-connect', onConnectionSuccess);
                $rootScope.$on('delete-stream', onDeleteStream);
                chatSocket.on('new-message', ChatController.onNewMessage);
                chatSocket.on('new-room', ChatController.onNewRoom);
            }
        ]);
})
(window.angular);
