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
                    server = $location.host();

                return socketFactory({
                    ioSocket: io.connect(server + namespace)  // connect to chat server
                });
        }])
        .controller('ChatController', ['chatSocket', 'Session', '$rootScope', '$location', '$anchorScroll', 'messageFactory',
            function (chatSocket, Session, $rootScope, $location, $anchorScroll, messageFactory) {
                var ChatController = this;
                this.message = '';
                this.rooms = {};
                this.currentRoom = '';
                this.receiver = '';
                this.canSend = false;

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

                function onNewRoom(room, username, id) {
                    ChatController.rooms[room] = {
                        with: {
                            username: username,
                            id: id
                        },
                        messages: []
                    };
                }

                function connectionSuccess() {
                    console.log('We are connected to chat server');
                }

                this.send = function () {

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

                this.receive = function (data) {
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

                this.changeRoom = function (id) {
                    var room = getRoom(undefined, id);

                    if (room) {
                        ChatController.receiver = this.rooms[room].with.id;
                        ChatController.canSend = true;

                        if (ChatController.currentRoom !== room) {
                            chatSocket.emit('change-room', room);
                            ChatController.currentRoom = room;
                            $location.hash('chat-bottom');
                            $anchorScroll();
                        }

                    } else {
                        // TODO implement method that requests a chat with a user if not already chatting.
                        //this.requestChat(username);
                        ChatController.canSend = false;
                        ChatController.currentRoom = '';
                    }
                };

                this.save = function (id) {
                    // TODO SAVE
                    var room = getRoom(undefined, id);

                    // remove room from memory
                    delete ChatController.rooms[room];
                    ChatController.canSend = false;
                };

                $rootScope.$on('delete-stream', function (event, id) {
                    ChatController.message = '';
                    if (ChatController.rooms[getRoom(undefined, id)].messages.length > 0) {
                        ChatController.save(id);
                    }
                });

                chatSocket.on('new-message', ChatController.receive);
                chatSocket.on('new-room', onNewRoom);
                chatSocket.on('successful-connect', connectionSuccess);

                chatSocket.on('init', function () {
                    chatSocket.emit('start', {
                        username: Session.user.username,
                        role: 'admin'
                    });
                });

            }
        ])
    ;
})
(window.angular);
