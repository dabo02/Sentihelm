

/**
 * @parmam server {http or express} server instance to attach socket to
 * @param
 * @param Parse {Parse} Parse object for data management
 * */
module.exports = function (io, Parse, Client, User) {
    'use strict';


    var chatServer = io;

    // helper methods
    function typeOfUser(objectId) {
        // TODO
    }

    function getClientNames(callback) {
        var oneDay = 8.64 * Math.pow(10, 7),
            q = new Parse.Query(Client),
            clients = [];

        q.include('objectId')
            .find()
            .then(function (results) {
                for (var i in results) {
                    clients.push(results[i].id.toString());
                    //console.log(results[i].id);
                }
                callback(null, clients);
            }, function (error) {
                console.error(error.message);
                callback(error);
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
            console.log(data);
            socket.emit('test-back', data);
        }

        // bind events to functions
        socket.on('connect', connect);

        socket.on('test', test);

        socket.on('disconnect', disconnectChat);
    }

    getClientNames(function (error, clients) {
        console.info("\nRegistering endpoints:");
        for (var i in clients) {
            var clientId = clients[i],
                endpoint = '/chat/' + clientId;

            console.info("\t\t %s", endpoint);

            chatServer
                .of(endpoint)
                .on('connection', chatManager);
        }
    });

    // create client namespaces example: '/chat/otF8BLkDg8'

};