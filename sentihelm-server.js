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
      maxAge: 3000000
    }, // expire in 5 minutes
    store: new SessionStore()
  });

  //Import and initialize socket.io
  //var io = require('socket.io')(server);

  //Other imports
  var OpenTok = require('opentok');
  var opentok = new OpenTok(config.opentok.key, config.opentok.secret);
  var db = require('./lib/db');
  var VideoSession = db.Object.extend('VideoSession');

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
    app.use(bodyParser({limit: '10mb'}));
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
    var dataAnalysis = require('./routes/data-analysis');
    var videoSessions = require('./routes/video-sessions');
    var notifications = require('./routes/notifications');
    var dashboard = require('./routes/dashboard');

    app
      .use(routes)
      .use('/tip', tip)
      .use('/users', users)
      .use('/tips', tips)
      .use('/stations', policeStations)
      .use('/mostwanted', mostwanted)
      .use('/analyze', dataAnalysis)
      .use('/videosessions', videoSessions)
      .use('/notifications', notifications)
      .use('/dashboard', dashboard);

    app.post('/request-video-connection', bodyParser(), function (request, response) {

      console.log("\n\nIn request-video-connection...\n\n");

      //Check if password is valid
      if (request.body.password !== "hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@") {
        return;
      }

      //Get data representing the mobile client
      var connection = JSON.parse(request.body.data);

      //Create OpenTok session
      opentok.createSession({
        mediaMode: "routed"
      }, function (error, session) {

        //TODO
        //Handle Error when session could not be created
        if (error) {
          response.send(400, error);
          return;
        }

        //Create the token that will be sent to the mobile client
        var clientToken = opentok.generateToken(session.sessionId, {
          role: 'publisher',
          expireTime: ((new Date().getTime()) + 36000),
          data: JSON.stringify(connection)
        });

        //Create the token that officer will use to connect via web
        var webToken = opentok.generateToken(session.sessionId, {
          role: 'moderator',
          data: JSON.stringify(connection.currentClientId)
        });

        //Prepare video session object
        var videoSession = new VideoSession();
        videoSession.set('status', 'pending');
        videoSession.set('sessionId', session.sessionId);
        videoSession.set('mobileClientToken', clientToken);
        videoSession.set('webClientToken', webToken);
        videoSession.set('latitude', connection.latitude);
        videoSession.set('longitude', connection.longitude);
        videoSession.set('mobileUser', {
          __type: "Pointer",
          className: "User",
          objectId: connection.userObjectId
        });
        videoSession.set('client', {
          __type: "Pointer",
          className: "Client",
          objectId: connection.currentClientId
        });

        //Save video session, respond to
        //mobile client with sessionId and token,
        //and pass connection on to front-end
        videoSession.save().then(function (videoSession) {
          var stream = connection;
          stream.sessionId = session.sessionId;
          stream.connectionId = videoSession.id;
          stream.webClientToken = webToken;
          response.send(200, {
            objectId: videoSession.id,
            sessionId: session.sessionId,
            token: clientToken
          });
          io.to(connection.currentClientId).emit('new-video-stream', {
            stream: stream
          });

          /*  opentok.startArchive(stream.sessionId, { name: 'archive: ' + stream.sessionId }, function(err, archive) {
           if (err) return console.log(err);

           // The id property is useful to save off into a database
           console.log("new archive:" + archive.id);
           });*/
        }, function (error, videoSession) {
          //TODO
          //Handle error when couldn't save video session
          var err = error;
        });

      });

    })


      //Receive  OT callback
      //and pass it along to front-end
      .post('/opentok-callback', function (request, response) {

        //TODO add another request with a password sent in parameters that would actually tend to the opentok callback
        console.log("\n\nIn opentok-callback...\n\n");

        var opentokCallbackJSON = request.body;

        //if (opentokCallbackJSON.partnerId === config.opentok.key) {
        var videoSessionQuery = new db.Query(VideoSession);
        videoSessionQuery.equalTo("sessionId", opentokCallbackJSON.sessionId);
        videoSessionQuery.find({
          success: function (videoSessions) {
            videoSessions[0].set('archiveStatus', opentokCallbackJSON.status);
            videoSessions[0].set('duration', opentokCallbackJSON.duration);
            videoSessions[0].set('reason', opentokCallbackJSON.reason);
            videoSessions[0].set('archiveSize', opentokCallbackJSON.size);
            videoSessions[0].save().then(function(video){
              if(opentokCallbackJSON.status === 'uploaded'){
                //io.to(video.attributes.client.id).emit('new-video-archive');
              }
            });
            console.log("OT callback received and processed");
            response.send("OT callback received and processed");

            if(opentokCallbackJSON.status == 'uploaded'){
              io.to(video.attributes.client.id).emit('new-video-archive');
            }
          },
          error: function (object, error) {
            // The object was not retrieved successfully.
            console.log("Error fetching video for archive ID update on Opentok callback.");
            response.status(503).send("OT callback received but not processed");
          }
        });
        //}
      })

      .post('/new-tip', function (request, response) {
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
