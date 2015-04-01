(function () {
  var express = require('express');
  var router = express.Router();
  var _ = require('lodash');
  var util = require('../lib/util');
  var clientModel = require('../models/client');
  var usersModel = require('../models/users');
  var config = require('../config');
  var OpenTok = require('opentok');
  var opentok = new OpenTok(config.opentok.key, config.opentok.secret);
  var Parse = require('../lib/db');
  var VideoSession = Parse.Object.extend('VideoSession');

  router
    .post('/login', function (req, res) {
      var username = req.body.userId;
      var password = req.body.password;

      function sendError(error) {
        res.send(503, error);
      }

      function sendLoginAnswer(client, user) {
        var answer = [];

        var passPhrase = util.passwordGenerator.generatePassword(
          user.attributes.username
        );
        user.attributes.firstName = util.encryptionManager.decrypt(
          passPhrase,
          user.attributes.firstName.base64
        );
        user.attributes.lastName = util.encryptionManager.decrypt(
          passPhrase,
          user.attributes.lastName.base64
        );

        answer.push(user);
        answer.push(client);
        answer.push(client.get('regions'));
        res.send(200, answer);
      }

      function userLogedIn(user) {
        var clientId = user.attributes.homeClient.id;

        req.session.regenerate(function (err) {
          if (err) {
            res.status(503).send({});
          }
          // perform a deep copy of the user object to keep in the session.
          req.session.user = _.clone(user, true);
        });
        // Get Client to which user belongs to
        // and return a promise

        console.log('client for now is %s', clientId);

        return clientModel.getById(clientId)
          .then(function (client) {
            sendLoginAnswer(client, user);
          });
      }

      util.logIn(username, password)
        .then(userLogedIn)
        .then(null, sendError);
    })
    //Recieve  request to start archiving a video session
    //and pass it along to front-end
    .post('/opentok-callback', function (request, response) {
      var videoSessionModel = require('../models/video-sessions');

      //TODO add another request with a password sent in parameters that would actually tend to the opentok callback
      console.log("\n\nIn opentok-callback...\n\n");

      var opentokCallbackJSON = request.body;

      videoSessionModel.find({
        sessionId: opentokCallbackJSON.sessionId
      }).then(function (videoSession) {
        videoSesison.setProperties({
          'archiveStatus': opentokCallbackJSON.status,
            'duration': opentokCallbackJSON.duration,
            'reason': opentokCallbackJSON.reason,
            'archiveSize': opentokCallbackJSON.size
        });
      }, function (object, error) {
        // The object was not retrieved successfully.
        console.log("Error fetching video for archive ID update on Opentok callback.");
      });

    })
    .post('/reset-password', function (request, response) {
      "use strict";
      var email = request.body.email;

      if (email) {

        usersModel.sendPasswordResetRequest(email)
          .then(function () {
              // Password reset request was sent successfully
              response.send(200);
            },
            function (error) {
              // Show the error message somewhere
              response.send(401);
            });
      }
    })
    //Recieve a request for a video stream connection;
    //get data form mobile client, save session info in
    //Parse and pass on to front-end
    .post('/request-video-connection', function (request, response) {

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
          /**
           * response and io responses need to be consolidated.
           */
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
    //Receive request to start archiving a video session
    //and store the archiveId
    .post('/start-archive', function (request, response) {

      console.log("\n\nIn start-archive...\n\n");
      //TODO why is the password check not being used?
      /*/Check if password is valid
       if(request.body.password!=="hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@"){
       return;
       }*/

      var videoSession = JSON.parse(request.body.data);

      opentok.startArchive(videoSession.sessionId, {
        name: 'archive: ' + videoSession.sessionId
      }, function (err, archive) {
        if (err) {
          response.send(400, err);
          return console.log(err + " Session id: " + videoSession.sessionId);
        }

        var videoSessionQuery = new Parse.Query(VideoSession);
        videoSessionQuery.equalTo("sessionId", videoSession.sessionId);
        videoSessionQuery.find({
          success: function (videoSessions) {
            videoSessions[0].set('archiveId', archive.id);
            videoSessions[0].save();
          },
          error: function (object, error) {
            // The object was not retrieved successfully.
            console.log("Error fetching video for archive ID update.");
          }
        });
      });

    });

  module.exports = router;

})();
