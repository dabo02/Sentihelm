

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


    var chatServer = io;

    // helper methods
    function typeOfUser(objectId) {
        'use strict';
        // TODO
    }

    function getClientNames(callback) {
        'use strict';
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
        'use strict';

        // event handlers

        /**
         *
         * */
        function connect(data) {
            'use strict';

        }
        function disconnectChat() {
            'use strict';
        }

        /**
         * Performs connection test
         * @param data {JSON}
         * */
        function test(data) {
            'use strict';
            console.log(data);
            socket.emit('test-back', data);
        }

        // bind events to functions
        socket.on('connect', connect);

        socket.on('test', test);

        socket.on('disconnect', disconnectChat);
    }

    getClientNames(function gettingNames(error, clients) {
        'use strict';
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