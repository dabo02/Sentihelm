/**
 * Created by Victor A. Martinez on 1/26/2015.
 */



(function (angular, undefined) {
    'use strict';
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
        })(),
        User = Parse.Object.extend("User");

    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory, Session) {

            var namespace = '/chat/' + Session.clientId,
                server = 'http://localhost:80';

            return socketFactory({
                ioSocket: io.connect(server + namespace)  // connect to chat server
            });
        })
        .controller('ChatController', ['chatSocket', 'Session', '$rootScope', '$location', '$anchorScroll', function (chatSocket, Session, $rootScope,
                                                                                                                      $location, $anchorScroll) {
            var ChatController = this;
            this.message = '';
            this.rooms = {};
            this.currentRoom = '';
            this.receiver = '';
            this.canSend = false;

            function getUserName(id) {
                var room;

                for (room in ChatController.rooms) {
                    if (ChatController.rooms.hasOwnProperty(room) && ChatController.rooms[room].with.id === id) {
                        return ChatController.rooms[room].with.username;
                    }
                }

            }

            function getRoom(username) {
                var room;
                for (room in ChatController.rooms) {
                    if (ChatController.rooms.hasOwnProperty(room) && ChatController.rooms[room].with.username === username) {
                        return room;
                    }
                }

            }

            function onNewRoom(room, username, id) {
                //new Parse.Query(User)
                //    .include('objectId')
                //    .equalTo('username', username)
                //    .find()
                //    .then(function (results) {
                //        console.log("Getting room for: %s", username);
                //        console.log("Room: %s", room);
                //        ChatController.rooms[room] = {
                //            with: {
                //                username: username,
                //                id: results[0].clientId
                //            },
                //            messages: []
                //        };
                //    });
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
                var username = getUserName(id),
                    room = getRoom(username);

                if (typeof room === 'string') {
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
                }
            };

            this.save = function(id) {
                // TODO SAVE
                var username = getUserName(id),
                    room = getRoom(username);

                // remove room from memory
                delete ChatController.rooms[room];
                ChatController.canSend = false;
            };

            $rootScope.$on('delete-stream', function (event, id) {
                ChatController.save(id);
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
