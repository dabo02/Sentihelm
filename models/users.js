"use strict";
var db = require('../lib/db');
var User = db.Object.extend('_User');
var util = require('../lib/util');
var Q = require('q');

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

module.exports.updateUser = function (user) {

  return Q.Promise(function (resolve, reject) {

    //Generate passphrase for encryption
    var passPhrase = util.passwordGenerator.generatePassword(user.username);

    //Encrypt user information
    var encryptedUser = util.encryptionManager.encryptUser(user, passPhrase);

    var email = user.email;
    var role = user.roles[0];
    var permissions = user.permissions;

    var data = {
      user: user,
      attrs: ['firstName','lastName','phoneNumber','zipCode','state','email','roles','permissions'],
      values: [encryptedUser[0],encryptedUser[1],encryptedUser[2],encryptedUser[3],encryptedUser[4],email,role, permissions],
      action: 'none'
    }

    db.Cloud.run('updateUser', data, {
      success: function(result) {
        resolve();
      },
      error: function (error) {
        reject(error);
      }
    });
  });
};

module.exports.updateRole = function (data){

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
};

module.exports.deleteUser = function(users){

  return Q.Promise(function(resolve, reject){

    users.forEach(function(user){

      var data = {
        user: user,
        attrs: ['roles','permissions'],
        values: [undefined, undefined],
        action: 'delete'
      }

      db.Cloud.run('updateUser', data, {
        success: function(result) {
          resolve();
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  });
};

module.exports.decryptUser = function(data){

  return Q.Promise(function(resolve, reject){
    
    var user = data;

    try{

      var passPhrase = util.passwordGenerator.generatePassword(user.username);

      user.firstName = util.encryptionManager.decrypt(passPhrase, user.firstName.base64);
      user.lastName = util.encryptionManager.decrypt(passPhrase, user.lastName.base64);
      user.phoneNumber = util.encryptionManager.decrypt(passPhrase, user.phoneNumber.base64);
      user.zipCode = util.encryptionManager.decrypt(passPhrase, user.zipCode.base64);
      user.state = util.encryptionManager.decrypt(passPhrase, user.state.base64);

      resolve(user);
    }
    catch(e){
      reject(e);
    }
  });
};

module.exports.addNewOfficer = function(officerData, clientId) {

  return Q.Promise(function(resolve, reject) {

    var userQuery = new db.Query(User);
    userQuery.equalTo("username", officerData.username);
    userQuery.find({
      success: function (users) {

        if(users.length > 0){
          //modify array so cloud code recognizes input
          var user = {"objectId": users[0].id};
          var hashedPassword = util.passwordGenerator.md5(officerData.password);

          var data = {
            user: user,
            attrs: ['roles','permissions','password','userPassword'],
            values: [officerData.roles, officerData.permissions, officerData.password, hashedPassword],
            action: 'none'
          };

          exports.updateRole(data).then(function(){
            resolve("Access to SentiHelm has been granted to existing user: " + officerData.username);
          }, function(err){
            reject(err);
          });
        }
        else{

          //var encryptedUser = util.encryptionManager.encryptUser(officerData);
          //Generate passphrase for encryption
          var passPhrase = "";
          passPhrase = util.passwordGenerator.generatePassword(officerData.username);

          //Encrypted/Hashed Values
          var encryptedFirstName = util.encryptionManager.encrypt(passPhrase, officerData.firstName);
          var encryptedLastName = util.encryptionManager.encrypt(passPhrase, officerData.lastName);
          var hashedPassword = util.passwordGenerator.md5(officerData.password);
          var encryptedPhoneNumber = util.encryptionManager.encrypt(passPhrase, officerData.phoneNumber);
          var encryptedZipCode = util.encryptionManager.encrypt(passPhrase, officerData.zipCode.toString());
          var encryptedState = util.encryptionManager.encrypt(passPhrase, officerData.state);

          //Create new officer
          var officer = new db.User();
          officer.set('firstName', {
            __type: "Bytes",
            base64: encryptedFirstName
          });
          officer.set('lastName', {
            __type: "Bytes",
            base64: encryptedLastName
          });
          officer.set('phoneNumber', {
            __type: 'Bytes',
            base64: encryptedPhoneNumber
          });
          officer.set('zipCode', {
            __type: 'Bytes',
            base64: encryptedZipCode
          });
          officer.set('state', {
            __type: 'Bytes',
            base64: encryptedState
          });

          officer.set('email', officerData.email);
          officer.set('username', officerData.username);
          officer.set('password', officerData.password);
          officer.set('userPassword', hashedPassword);
          officer.set('roles', officerData.roles);
          officer.set('permissions', officerData.permissions);
          officer.set('homeClient', {
            __type: "Pointer",
            className: "Client",
            objectId: clientId
          });

          //Save/Signup new officer
          officer.signUp().then(function(){
            resolve("New user added to SentiHelm.");
          }, function(err){
            reject(err);
          });
        }
      },
      error: function (err) {


      }
    });
  });
};