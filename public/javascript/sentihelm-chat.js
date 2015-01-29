/**
 * Created by Victor A. Martinez on 1/26/2015.
 */

(function (angular, undefined) {
    'use strict';
    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory, Session) {

            var namespace = '/chat/' + Session.clientId,
                server = 'http://10.10.80.6:80';

            return socketFactory({
                ioSocket: io.connect(server + namespace)  // connect to chat server
            });
        })
        .controller('ChatController', ['chatSocket', 'Session', function (chatSocket, Session) {
            var ChatController = this;
            this.message = '';
            this.rooms = [];
            this.currentRoom = '';
            this.receiver;

            function getUserName(id, c) {

                new Parse.Query(User)
                    .equalTo('objectId', id)
                    .find()
                    .then(function (results) {
                        c(null, results[0].username);
                    }, function (err) {
                        c(err);
                    });
            }

            function getRoom(username) {
                var room = '';
                ChatController.rooms.forEach(function (room) {
                    if (room.with === username) {
                        room = room.name;
                    }
                });

                return room;
            }

            /**
             * @class Message
             * @param messageData {object} is of format { 'sender': '', 'receiver': '', 'message': '', 'dateTime': 1234567890 }
             * @throws Error
             * @return new Instance of message
             * */
            var Message = (function () {
                function Message(messageData) {
                    var self = this;
                    this.sender = messageData.sender || Session.clientId;
                    this.receiver = messageData.receiver || null;
                    this.message = messageData.message || null;
                    this.dateTime = messageData.dateTime || +new Date();

                    /**
                     * Iterates over all the properties of the message, checking if they're all set.
                     * */
                    for (var item in Object.keys(this)) {
                        if (this.hasOwnProperty(item) && this[item] == null) {
                            throw new Error("Can't create message. Property: " + item + " has not been set.");
                        }
                    }
                }

                Message.prototype.toJSON = function () {
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

            this.send = function () {
                //chatSocket.emit('test', {
                //    clientId: Session.clientId,
                //    message: ChatController.message,
                //    dateTime: +new Date()
                //});

                var message = new Message({
                    sender: Session.clientId,
                    receiver: this.receiver,
                    message: this.message
                });

                chatSocket.emit('message-sent', message.toJSON());

                this.message = '';
            };

            this.receive = function (data) {
                var isMe = data.sender === Session.clientId,
                    messageObject = {
                        from: '',
                        fromMe: isMe,
                        message: data.message,
                        dateTime: data.dateTime
                    };

                if (isMe) {
                    messageObject.from = Session.user.username;
                } else {
                    getUserName(data.sender, function (err, user) {
                        messageObject.from = user;
                    });
                }

                ChatController.rooms[getRoom(messageObject.user)].messages.push(messageObject);
            };

            this.changeRoom = function (username) {
                this.currentRoom = getRoom(username);
            };

            function onNewRoom(room, username) {
                ChatController.rooms.push({
                    name: room,
                    with: username,
                    messages: []
                });
            }

            function connectionSucess() {
                console.log('We are connected to chat server');
            }


            chatSocket.on('new-message', ChatController.receive);
            chatSocket.on('new-room', onNewRoom);
            chatSocket.on('successful-connect', connectionSucess);

            chatSocket.emit('connect', {
                username: Session.user.username,
                role: 'admin'
            })

        }]);
})(window.angular);
