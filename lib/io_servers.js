/**
 * Created by vectorhacker on 3/27/15.
 */
module.exports = function (io, session) {
  'use strict';
  // add shared session storage between express and socket.io servers
  var socketSession = require('express-socket.io-session');
  io.use(socketSession(session));
  io.use(function (socket, next) {
    socket.session = socket.handshake.session;
    next();
  });

  io.use(function (socket, next) {
    next();
  });

  io.on('connection', function (socket) {

    socket

    socket.on('request-batch', function (id) {
      console.log(id);
    });
  });

  return io; // used only if needed.
};
