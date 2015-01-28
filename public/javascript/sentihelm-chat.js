/**
 * Created by marti_000 on 1/26/2015.
 */

(function (angular, undefined) {
    'use strict';
    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory) {
            return socketFactory({
                ioSocket: io.connect('http://10.10.80.6:80/chat/otF8BLkDg8')  // connect to chat server
            });
        })
        .controller('ChatController', ['chatSocket', 'Session', function (chatSocket, Session) {
            var ChatController = this;
            this.messages = [];
            this.message = '';

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

                    return JSON.stringify(m);
                };

                return Message;
            })();

            this.send = function () {
                chatSocket.emit('test', {
                    clientId: Session.clientId,
                    message: ChatController.message,
                    dateTime: +new Date()
                });

                this.message = '';
            };

            this.receive = function (data) {
                var isMe = data.clientId === Session.clientId,
                    messageObject = {
                        from: '',
                        fromMe: isMe,
                        message: data.message,
                        dateTime: data.dateTime
                    };

                if (isMe) {
                    messageObject.from = Session.user.username;
                } else {
                    messageObject.from = "Define";
                }

                ChatController.messages.push(messageObject);
            };


            chatSocket.on('test-back', ChatController.receive);

        }]);
})(window.angular);
