

/**
 * Creates the chat server and the various endpoints
 *
 * @param io {Server} A socket.io server instance.
 * @param Parse {Parse} for data management
 * @param Client {Parse.Object}
 * @param User {Parse.Object}
 * */
module.exports = function (io, Parse, Client, User) {
    'use strict';


    var chatServer = io,
        chatEndpoints = {};

    // helper methods
    function typeOfUser(objectId) {
        // TODO finish

        var role = '';
        (new Parse.Query(User))
            .include('objectId')
            .include('roles')
            .equalTo('objectId', objectId)
            .limit(1)
            .find()
            .then(function (results) {
                role = results[0].roles.indexOf('admin') !== -1 ? 'admin' : 'user';
            },
            function (error) {});

        return role;
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

        var isAdmin = false,
            rooms = [];

        console.info('socket: %s connected', socket.id);

        // event handlers

        /**
         *
         * */
        function connect(data) {
            var role = typeOfUser(data.clientId, socket.request);
        }

        function sendMessage(data) {

        }

        function save(data) {

        }

        function disconnectChat(data) {
        }

        /**
         * Performs connection test
         * @param data {JSON}
         * */
        function test(data) {
            'use strict';
            var response = typeof data === 'string' ? 'I got your message' : data,
                count = 1;
            console.info("socket: %s sent %s sending it back", socket.id, data);

            function respond() {
                socket.emit('test-back', response);
                if (count === 10) {
                    return;
                }
                console.log("sending %s to %s for the %sth time", response, socket.id, count);
                count += 1;
                setTimeout(respond, 5*1000);
            }

            respond();
        }

        // bind events to functions
        socket
            .on('connect', connect)
            .on('message-sent', sendMessage)
            .on('test', test)
            .on('save', save)
            .on('disconnect', disconnectChat);
    }

    getClientNames(function gettingNames(error, clients) {
        console.info("\nRegistering endpoints:");
        for (var i in clients) {
            var clientId = clients[i],
                endpoint = '/chat/' + clientId;

            console.info("\t\t %s", endpoint);

            chatEndpoints[endpoint] = [];

            chatServer
                .of(endpoint)
                .on('connection', chatManager);
        }
    });

    // create client namespaces example: '/chat/otF8BLkDg8'

};