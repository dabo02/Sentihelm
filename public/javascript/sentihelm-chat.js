/**
 * Created by Victor A. Martinez on 1/26/2015.
 */

/**
 * @class Message
 * @param messageData {object} is of format { 'sender': '', 'receiver': '', 'message': '', 'dateTime': 1234567890 }
 * @throws Error
 * @return new Instance of message
 * */

var Message = (function () {
    function Message(messageData) {
        var self = this;
        this.sender = messageData.sender || Session.user.clientId;
        this.receiver = messageData.receiver || null;
        this.message = messageData.message || null;
        this.dateTime = 123;

        /**
         * Iterates over all the properties of the message, checking if they're all set.
         * */
        for (var item in Object.keys(this)) {
            if (this.hasOwnProperty(item) && this[item] == null) {
                throw new Error("Can't create message. Property: " + item + " has not been set.");
            }
        }
    }

    Message.prototype.toJSONObject = function () {
        var m = {
            sender: this.sender,
            receiver: this.receiver,
            message: this.message,
            dateTime: this.dateTime
        };

        return m;
    };

    return Message;
})();

(function (angular, undefined) {
    'use strict';
    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory, Session) {

            var namespace = '/chat/' + Session.clientId,
                server = 'http://localhost:80';

            return socketFactory({
                ioSocket: io.connect(server + namespace)  // connect to chat server
            });
        })
        .controller('ChatController', ['chatSocket', 'Session', function (chatSocket, Session) {
            var ChatController = this;
            this.message = '';
            this.rooms = [];
            this.currentRoom = '';
            this.receiver = '';
            this.canSend = false;

            function getUserName(id) {
                var username = null;
                ChatController.rooms.forEach(function (room) {
                    if (room.with.id === id) {
                        username = room.with.username;
                    }
                });

                return username;
            }

            function getRoom(username) {
                var roomName = '';
                if (ChatController.rooms.length > 0) {
                    ChatController.rooms.forEach(function (room, index) {
                        if (room.with === username) {
                            roomName = Object.keys(room)[index];
                        }
                    });
                    ChatController.canSend = true;
                    return roomName;
                } else {
                    ChatController.canSend = false;
                    return null;
                }


            }

            function onNewRoom(room, username) {
                new Parse.Query(User)
                    .include('objectId')
                    .equalTo('username', username)
                    .find()
                    .then(function (results) {
                        ChatController.rooms[room] = {
                            with: {
                                username: username,
                                id: results[0].clientId
                            },
                            messages: []
                        };
                    });
            }

            function connectionSuccess() {
                console.log('We are connected to chat server');
            }

            this.send = function () {
                //chatSocket.emit('test', {
                //    clientId: Session.clientId,
                //    message: ChatController.message,
                //    dateTime: +new Date()
                //});

                var message = new Message({
                    sender: Session.user.objectId,
                    receiver: this.receiver,
                    message: this.message
                });

                chatSocket.emit('message-sent', message.toJSONObject());

                this.message = '';
            };

            this.receive = function (data) {
                var sender = data.sender,
                    receiver = data.reciever,
                    message = data.message,
                    dateTime = data.dateTime,
                    messageObject = {
                        from: '',
                        fromMe: false,
                        message: message,
                        dateTime: dateTime
                    },
                    username;

                if (sender == Session.user.objectId) {
                    messageObject.from = Session.user.username;
                    messageObject.fromMe = true;

                    username = getUserName(receiver);
                } else {
                    username = getUserName(sender);
                    messageObject.from = username;
                }

                this.rooms[getRoom(username)].messages.push(messageObject);
            };

            this.changeRoom = function (username) {
                this.currentRoom = getRoom(username);
                if (typeof this.currentRoom === 'string') {
                    this.receiver = this.rooms[this.currentRoom].with.id;
                } else {
                    // TODO implement method that requests a chat with a user if not already chatting.
                    //this.requestChat(username);
                }
            };

            chatSocket.on('new-message', ChatController.receive);
            chatSocket.on('new-room', onNewRoom);
            chatSocket.on('successful-connect', connectionSuccess);

            chatSocket.on('init', function () {
                chatSocket.emit('connection', {
                    username: Session.user.username,
                    role: 'admin'
                });
            });

        }
        ])
    ;
})
(window.angular);
