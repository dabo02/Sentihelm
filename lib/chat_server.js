

/**
 * @parmam server {http or express} server instance to attach socket to
 * @param Parse {Parse} Parse object for data management
 * */
module.exports = function (io, server, Parse, Client, User) {
    'use strict';


    var clientIds = [],  // clients in Clients table
        chatServer = io;

    // helper methods
    function typeOfUser(objectId) {
        // TODO
    }

    function getClientNames() {
        var oneDay = 8.64 * Math.pow(10, 7),
            q = new Parse.Query(Client);

        q.include('objectId')
            .find()
            .then(function (results) {
                results.forEach(function (client) {
                    clientIds.push(client.id);
                    console.log(client);
                });
            }, function (error) {
                console.error(error.message);
            });

        // setTimeout(setEndpoints, oneDay);  // iterate 24 hours.
    }

    /**
     * Manages chats for each namespace.
     *
     * */
    function chatManager(socket) {

        // event handlers

        /**
         *
         * */
        function connect(data) {

        }
        function disconnectChat() {

        }

        /**
         * Performs connection test
         * @param data {JSON}
         * */
        function test(data) {
            socket.emit('test-back', data);
        }

        // bind events to functions
        socket.on('connect', connect);

        socket.on('test', test);

        socket.on('disconnect', disconnectChat);
    }

    getClientNames();

    // create client namespaces example: '/chat/otF8BLkDg8'
    clientIds.forEach(function (clientId) {
        chatServer
            .of('/chat/' + clientId)
            .on(chatManager());
    });
};