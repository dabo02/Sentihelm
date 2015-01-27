var Server = require('socket.io');

module.exports = function (server, Parse) {
    var chatServer = new Server(server);

    function typeOfUser(objectId) {
        // TODO
    }

    /**
     * Manages chats for each namespace.
     *
     * */
    function chatManager(socket) {

        // event hanlders
        function disconnectChat() {

        }

        /**
         *
         * */
        function connect(data) {

        }

        // bind events to functions
        socket.on('connect', connect);


        socket.on('disconnect', disconnectChat);
    }


    chatServer
        .of('/chat')
        .on('connection', chatManager);
};