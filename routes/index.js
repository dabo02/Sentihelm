var express = require('express');
var router = express.Router();
var Parse = require('../lib/db');
var Client = Parse.Object.extend('Client');

var EncryptionManager = require('../lib/EncryptionManager.js');
var PasswordGenerator = require('../lib/PasswordGenerator.js');

//Generates the password for the encription manager.
var passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
var encryptionManager = new EncryptionManager();

router
  .post('/login', function (req, res) {
    var userId = req.body.userId;
    var password = req.body.password;
    Parse.User.logIn(userId, password, {
      success: function (user) {

        req.session.regenerate(function () {
            req.session.user = user;
        });

        //Get Client to which user belongs to
        var clientQuery = new Parse.Query(Client);
        clientQuery.include("regions");
        clientQuery.include("mostWantedList");
        clientQuery.get(user.attributes.homeClient.id, {
          success: function (client) {

            var answer = [];

            var passPhrase = passwordGenerator.generatePassword(
              user.attributes.username);
            user.attributes.firstName = encryptionManager.decrypt(
              passPhrase, user.attributes.firstName.base64);
            user.attributes.lastName = encryptionManager.decrypt(
              passPhrase, user.attributes.lastName.base64);

            answer.push(user);
            answer.push(client);
            answer.push(client.get('regions'));
            res.send(200, answer);
          },
          error: function (object, error) {
            res.send(400, error);
          }
        });
      },
      error: function (user, error) {
        res.send(400, error);
      }
    });
  });

module.exports = router;