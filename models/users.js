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

    //Generate passphrase for encryption
    var passPhrase = passwordGenerator.generatePassword(user.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = encryptionManager.encrypt(passPhrase, user.firstName);
    var encryptedLastName = encryptionManager.encrypt(passPhrase, user.lastName);
    var encryptedPhoneNumber = encryptionManager.encrypt(passPhrase, user.phoneNumber);
    var encryptedZipCode = encryptionManager.encrypt(passPhrase, user.zipCode.toString());
    var encryptedState = encryptionManager.encrypt(passPhrase, user.state);

    var email = user.email;

    db.Cloud.run('saveUser', {
      //data here
    }, {
      success: function(result) {
        resolve();
      },
      error: function (error) {
        reject(error);
      }
    });

    /* the following code runs on the cloud
    // var dbUser = new db.Query(User);
    var user = db.User.current();
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
    user.set('phoneNumber', {
      __type: "Bytes",
      base64: encryptedPhoneNumber
    });
    user.set('zipCode', {
      __type: "Bytes",
      base64: encryptedZipCode
    });
    user.set('state', {
      __type: "Bytes",
      base64: encryptedState
    });

    */
  });
};

module.exports.updateRole = function(data){

  return Q.Promise(function(resolve, reject){
    db.Cloud.run('updateUserRole', data, {
      success: function(result) {
        resolve();
      },
      error: function (error) {
        reject(error);
      }
    });
  });
}