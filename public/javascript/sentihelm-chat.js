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
                function onInit() {
                    chatSocket.emit('start', {
                        username: Session.user.username,
                        role: 'admin'
                    });
                }

                // Private
                function onConnectionSuccess() {
                    console.log('We are connected to chat server');
                }

                // Private
                function onDeleteStream(event, id) {
                    ChatController.message = '';
                    if (ChatController.rooms[getRoom(undefined, id)].messages.length > 0) {
                        ChatController.save(id);
                    }
                }

                // Public
                this.send = function () {

                    try {
                        chatSocket.emit('message-sent', messageFactory({
                            receiver: this.receiver,
                            message: this.message
                        }));
                    } catch (e) {
                        console.log(e.message);
                        this.rooms[getRoom(undefined, this.receiver)].messages.push({
                            dateTime: Date.now(),
                            message: e.message
                        });
                    }

                    this.message = '';
                };

                // Public
                this.onNewRoom = function (room, username, id) {
                    this.rooms[room] = {
                        with: {
                            username: username,
                            id: id
                        },
                        messages: []
                    };
                };

                // Public
                this.onNewMessage = function (data) {
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

                    this.rooms[room].messages.push(messageObject);

                    if (room === this.currentRoom) {
                        $location.hash('chat-bottom');
                        $anchorScroll();
                    }
                };

                // Public
                this.changeRoom = function (id) {
                    var room = getRoom(undefined, id);

                    if (room) {
                        this.receiver = this.rooms[room].with.id;
                        this.canSend = true;

                        if (this.currentRoom !== room) {
                            chatSocket.emit('change-room', room);
                            this.currentRoom = room;
                            $location.hash('chat-bottom');
                            $anchorScroll();
                        }

                    } else {
                        // TODO implement method that requests a chat with a user if not already chatting.
                        //this.requestChat(username);
                        this.canSend = false;
                        this.currentRoom = '';
                    }
                };

                // Public
                this.save = function (id) {
                    // TODO SAVE
                    var room = getRoom(undefined, id);

                    // remove room from memory
                    delete this.rooms[room];
                    this.canSend = false;
                };

                chatSocket.on('init', onInit);
                chatSocket.on('successful-connect', onConnectionSuccess);
                $rootScope.$on('delete-stream', onDeleteStream);
                chatSocket.on('new-message', this.onNewMessage);
                chatSocket.on('new-room', this.onNewRoom);
            }
        ]);
})
(window.angular);
