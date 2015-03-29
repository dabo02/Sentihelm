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

  return io; // used only if needed.
};
