/**
 * Created by marti_000 on 1/26/2015.
 */

(function (angular, undefined) {
    angular.module('sh.chat', ['btford.socket-io'])
        .factory('chatSocket', function (socketFactory) {
            return socketFactory({
                prefix: 'chat-',
                ioSocket: io.connect('')  // connect to chat server
            });
        })
        .controller('ChatManagerController', ['chatSocket', function (chatSocket) {
            var ChatManagerController = this,
                messages = [];

            /**
             * @class Message
             * @param messageData {object} is of format { 'sender': '', 'receiver': '', 'message': '', 'dateTime': 1234567890 }
             * @return new Instace of message
             * */
            var Message = (function () {
                function Message(messageData) {
                    this.sender = messageData.sender || null;
                    this.receiver = messageData.receiver || null;
                    this.message = messageData.message || null;
                    this.dateTime = messageData.dateTime || +new Date();
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

            }

            this.receive = function (message) {

            }

            chatSocket.on('chat-new-message', function (message) {
                ChatManagerController.receive(message);
            });

        }]);
})(window.angular);
