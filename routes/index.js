var express = require('express');
var router = express.Router();
var _ = require('lodash');
var util = require('../lib/util');
var clientModel = require('../models/client');
var usersModel = require('../models/users');
var Q = require('q');

router
  .post('/login', function (req, res) {
    var username = req.body.userId;
    var password = req.body.password;

    function sendError(user, error) {
      res.send(400, error);
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

      req.session.regenerate(function () {
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
  .post('/reset-password', function (request, response) {
    "use strict";
    var email = request.body.email;

    if (email) {

      usersModel.sendPasswordResetRequest(email)
        .then(function () {
            // Password reset request was sent successfully
            response.send(200)
          },
          function (error) {
            // Show the error message somewhere
            response.send(401);
          });
    }
  });

module.exports = router;
