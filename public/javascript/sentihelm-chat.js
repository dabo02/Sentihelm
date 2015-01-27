/**
 * Created by marti_000 on 1/26/2015.
 */

(function (angular, undefined) {
    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory) {
            return socketFactory({
                ioSocket: io.connect('http://localhost/chat/otF8BLkDg8')  // connect to chat server
            });
        })
        .controller('ChatManagerController', ['chatSocket', function (chatSocket) {
            var ChatManagerController = this,
                messages = [];

            /**
             * @class Message
             * @param messageData {object} is of format { 'sender': '', 'receiver': '', 'message': '', 'dateTime': 1234567890 }
             * @throws Error
             * @return new Instance of message
             * */
            var Message = (function () {
                function Message(messageData) {
                    var self = this;
                    this.sender = messageData.sender || null;
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

            this.send = function (message) {

            };

            this.receive = function (message) {

            };


            chatSocket.on('test-back', function (data) {
                "use strict";
               console.log(data);
            });

            chatSocket.emit('test', 'hola hola hola');

        }]);
})(window.angular);
