"use strict";
var db = require('../lib/db');
var util = require('../lib/util');
var Q = require('q');
var User = db.Object.extend('User');

module.exports.sendPasswordResetRequest = function (email) {
  return Q.Promise(function (resolve, reject, notify) {
    db.requestPasswordReset(email)
      .then(function () {
        resolve();
      }, function (error) {
        reject(error);
      });
  });
};


module.exports.saveUser = function (user) {
  //Generate passphrase for encryption
  
  
  return Q.Promise(function () {
    
  });
  
  var passPhrase = "";
  passPhrase = util.passwordGenerator.generatePassword(editedUser.username);

  //Encrypted/Hashed Values
  var encryptedFirstName = util.encryptionManager.encrypt(passPhrase, editedUser.firstName);
  var encryptedLastName = util.encryptionManager.encrypt(passPhrase, editedUser.lastName);
  var email = editedUser.email;

  // var hashedPassword = util.passwordGenerator.md5(officerData.password);

  // var ParseUser = new Parse.Query(User);
  var user = Parse.User.current();
  if (!user) {
    return {
      then: function (success, error) {
        "use strict";
        error(user, Error("user-session-timeout"));
      }
    };
  }

  user.set('firstName', {
    __type: "Bytes",
    base64: encryptedFirstName
  });
  user.set('lastName', {
    __type: "Bytes",
    base64: encryptedLastName
  });
  user.set('email', email);
  // officer.set('userPassword', hashedPassword);
  // officer.set('roles', [officerData.role]);

};