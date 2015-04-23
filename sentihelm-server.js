(function () {
  'use strict';
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var fs = require('fs');
  var config = require('./config');
  var util = require('./lib/util');
  var session = require('express-session');
  var SessionStore = require('connect-sqlite3')(session);
  var sessionMiddleware = session({ // exporting for external use
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@',
    name: 'sentihelm.id',
    cookie: {
      maxAge: 300000
    }, // expire in 5 minutes
    store: new SessionStore()
  });

  //Import and initialize socket.io
  //var io = require('socket.io')(server);

  //Other imports
  var Parse = require('./lib/db');

  /**
   * The server makes extensive use of socket.io to send real time notifications
   * to connected users.
   * */
  module.exports.app = function (io) {

    //Create an non-overriding log file and feed it
    //to an express logger with default settings
    app.use(logger('dev'));

    //Attach a bodyParser in order to handle json and urlencoded
    //bodies.
    app.use(bodyParser.json());
    app.set('view engine', 'hjs');

    //Add the static middleware: allows express to serve up
    //static content in the specified directory (for CSS/JS).
    app.use(express.static(__dirname + '/public'));

    app.use(sessionMiddleware);

    //=========================================
    //  SET UP ROUTING
    //=========================================

    var routes = require('./routes/index');
    var users = require('./routes/users');
    var tip = require('./routes/tip');
    var tips = require('./routes/tips');
    var mostwanted = require('./routes/most-wanted');
    var policeStations = require('./routes/police-stations');

    app
      .use(routes)
      .use('/tip', tip)
      .use('/users', users)
      .use('/tips', tips)
      .use('/stations', policeStations)
      .use('/mostwanted', mostwanted);

    app.post('/new-tip', function (request, response) {
      var tip = request.body;
      var pass = tip.pass;
      var clientId = tip.clientId;
      if (pass == 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
        io.to(clientId).emit('new-tip', {
          tip: tip,
          clientId: clientId
        });
        response.send(200);
      }
    });

    app.use(function (req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.send({
        message: err.message,
        error: {}
      });
    });

    return app;

  };

  module.exports.session = sessionMiddleware;
})();
