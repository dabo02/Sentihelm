var db = require('./db');
var Q = require('q');

module.exports.randomName = function () {
  function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask +=
      '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';

    for (var i = length; i > 0; --i) {
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    }

    return result;
  }

  return randomString(10, 'AS3$$#');
};

// This method checks if the user has logged in, otherwise it restricts access to
// certain route or operation.
module.exports.restrict = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        if (res) {
          res.status(401).send("You don't have access to act out this operation.");
        }
    }
};

// Handles general login operation throughout the system. Fully encapsulated,
// it returns a promise with a user object.
module.exports.logIn = function (username, password) {
    return Q.Promise(function (resolve, reject) {
        db.User.logIn(username, password)
            .then(function (user) {
                resolve(user);
            }, function (error) {
                reject(error);
            });
    });
};
var PasswordGenerator = require('../lib/PasswordGenerator.js');
var EncryptionManager = require('../lib/EncryptionManager.js');

// Generates a password
module.exports.passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
module.exports.encryptionManager = new EncryptionManager();

// Returns a promise with the objectId's for each client on the database.
module.exports.getClientIds = function () {
    return Q.Promise(function (resolve, reject) {
        new db.Query(db.Object.extend('Client'))
          .find()
          .then(function (clients) {
              var cs = [];

              // Just get the client's objectId
              clients.forEach(function (client) {
                  cs.push(client.id);
              });

              resolve(cs);
          }, function (error) {
              // Well, something went wrong. Deal with it.
              // (•_•)
              // ( •_•)>⌐■-■
              // (⌐■_■)
              reject(error);
          });
    });
};
