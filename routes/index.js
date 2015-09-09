(function () {
  'use strict';
  var express = require('express');
  var router = express.Router();
  var _ = require('lodash');
  var util = require('../lib/util');
  var clientModel = require('../models/client');
  var usersModel = require('../models/users');
  var tipModel = require('../models/tips');
  var config = require('../config');
  var bodyParser = require('body-parser');
  var OpenTok = require('opentok');
  var opentok = new OpenTok(config.opentok.key, config.opentok.secret);
  var db = require('../lib/db');
  var VideoSession = db.Object.extend('VideoSession');

  router
    .post('/login', function (req, res) {
      var username = req.body.userId;
      var password = req.body.password;

      function sendError(error) {
        res.send(503, "Parse failed: " + error);
      }

      function sendLoginAnswer(client, user) {
        var answer = [];

        answer.push(user);
        // fixes serialization issue.
        answer.push(client.attributes);
        answer.push(client.get('regions'));
        res.send(200, answer);
      }

      function userLogedIn(user) {
        var clientId = user.attributes.homeClient.id;

        // Get Client to which user belongs to
        // and return a promise

        var passPhrase = util.passwordGenerator.generatePassword(user.attributes.username);
        //user = util.encryptionManager.decryptUser(passPhrase, user);

        user.attributes.firstName = util.encryptionManager.decrypt(passPhrase, user.attributes.firstName.base64);
        user.attributes.lastName = util.encryptionManager.decrypt(passPhrase, user.attributes.lastName.base64);
        user.attributes.phoneNumber = util.encryptionManager.decrypt(passPhrase, user.attributes.phoneNumber.base64);
        user.attributes.zipCode = util.encryptionManager.decrypt(passPhrase, user.attributes.zipCode.base64);

        if (user.attributes.state) {
          user.attributes.state = util.encryptionManager.decrypt(passPhrase, user.attributes.state.base64);
        }

        if (user.attributes.addressLine1) {
          user.attributes.addressLine1 = util.encryptionManager.decrypt(passPhrase, user.attributes.addressLine1.base64);
        }

        if (user.attributes.addressLine2) {
          user.attributes.addressLine2 = util.encryptionManager.decrypt(passPhrase, user.attributes.addressLine2.base64);
        }

        if (user.attributes.city) {
          user.attributes.city = util.encryptionManager.decrypt(passPhrase, user.attributes.city.base64);
        }

        req.session.regenerate(function (err) {
          if (err) {
            res.status(503).send("Express session failed: " + err);
            //res.status(503).send({});
          }
          // perform a deep copy of the user object to keep in the session.
          var userJSON = user.toJSON();
          req.session.user = _.clone(userJSON, true);
        });

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
    .post('/reset-password', function (request, response) {

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
    /*
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
    })
    */
    //Recieve a request for a video stream connection;
    //get data form mobile client, save session info in
    //db and pass on to front-end


    //Receive request to start archiving a video session
    //and store the archiveId
    .post('/start-archive', bodyParser(), function (request, response) {

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

        var videoSessionQuery = new db.Query(VideoSession);
        videoSessionQuery.equalTo("sessionId", videoSession.sessionId);
        videoSessionQuery.find({
          success: function (videoSessions) {
            videoSessions[0].set('archiveId', archive.id);
            videoSessions[0].save().then(function () {
              console.log('Archive started and saved to parse..');
              response.send('Archive started and saved to parse..');
            });
          },
          error: function (object, error) {
            // The object was not retrieved successfully.
            console.log("Error fetching video for archive ID update.");
            response.status(503).send("Error fetching video for archive ID update.");
          }
        });
      });

    })



    //send sms message using cloud code
    .post('/sendSMS', function (request, response) {
      db.Cloud.run('sendSMS', request.body, {
        success: function (result) {
          response.send(200);
        },
        error: function (error) {
          response.send(401);
        }
      });

    })
    .post('/saveBastaYaTip', function(req, res){

      util.logIn(req.body.username, req.body.password)
        .then(function(user){
          tipModel.saveBastaYaTip(req.body.tip, user).then(function () {
            res.send("SUCCESS: Tip saved to SentiHelm.");

          }, function (error) {
            res.status(503).send("FAILURE: Tip not saved to SentiHelm.");
          });
        }, function(error){
          res.status(503).send("FAILURE: Tip not saved to SentiHelm.");
        });
    })
    .use(util.restrict)
    .get('/language', function (req, res) {
      clientModel.language(req.body, req.session.user.homeClient.objectId).then(function (lang) {
        res.send(lang);

      }, function (error) {
        res.status(503).send("FAILURE: Could not get language. " + error.message);
      });
    });


  module.exports = router;


})();
