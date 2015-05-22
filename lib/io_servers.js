/**
 * Created by vectorhacker on 3/27/15.
 */
(function () {
  'use strict';

  var io = require('socket.io')();

  module.exports = function (session) {
    // add shared session storage between express and socket.io servers
    var socketSession = require('express-socket.io-session');
    io.use(socketSession(session));
    io.use(function (socket, next) {
      socket.session = socket.handshake.session;
      next();
    });

    io.on('connection', require('./notification_server'));

    // Start chat server
    require('./chat_server')(io);

    return io; // used only if needed.
  };

})();
