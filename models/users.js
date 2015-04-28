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
      attrs: ['firstName','lastName','phoneNumber','zipCode','email','roles','permissions'],
      values: [encryptedUser[0],encryptedUser[1],encryptedUser[2],encryptedUser[3],email,role, permissions],
      action: 'none'
    }

    if(user.state){
      data.attrs.push('state');
      data.attrs.push(encryptedUser[4]);
    }

    if(user.addressLine1){
      data.attrs.push('addressLine1');
      data.attrs.push(encryptedUser[5]);
    }

    if(user.addressLine2){
      data.attrs.push('addressLine2');
      data.attrs.push(encryptedUser[6]);
    }

    if(user.city){
      data.attrs.push('city');
      data.attrs.push(encryptedUser[7]);
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

      user = util.encryptionManager.decryptUser(passPhrase, user);

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
          var passPhrase = util.passwordGenerator.generatePassword(users[0].username);
          var encryptedUser = util.encryptionManager.encryptUser(officerData, passPhrase);
          var hashedPassword = util.passwordGenerator.md5(officerData.password);

          var data = {
            user: {"objectId": users[0].id},
            attrs: ['firstName','lastName','phoneNumber','zipCode','email','roles','permissions','password','userPassword'],
            values: [encryptedUser[0],encryptedUser[1],encryptedUser[2],encryptedUser[3],officerData.email,officerData.roles[0], officerData.permissions, officerData.password, hashedPassword],
            action: 'none'
          };

          //TODO add optional fields to data.attrs and data.values
          if(officerData.state){
            data.attrs.push('state');
            data.attrs.push(encryptedUser[4]);
          }

          if(officerData.addressLine1){
            data.attrs.push('addressLine1');
            data.attrs.push(encryptedUser[5]);
          }

          if(officerData.addressLine2){
            data.attrs.push('addressLine2');
            data.attrs.push(encryptedUser[6]);
          }

          if(officerData.city){
            data.attrs.push('city');
            data.attrs.push(encryptedUser[7]);
          }

          db.Cloud.run('updateUser', data, {
            success: function(result) {
              resolve("Access to SentiHelm has been granted to existing user " + officerData.username);
            },
            error: function (error) {
              reject(error);
            }
          });
        }
        else{

          //var encryptedUser = util.encryptionManager.encryptUser(officerData);
          //Generate passphrase for encryption
          var passPhrase = "";
          passPhrase = util.passwordGenerator.generatePassword(officerData.username);
          var hashedPassword = util.passwordGenerator.md5(officerData.password);

          //Encrypt user information
          var encryptedUser = util.encryptionManager.encryptUser(officerData, passPhrase);

          //Create new officer
          var officer = new db.User();
          officer.set('firstName', {
            __type: "Bytes",
            base64: encryptedUser[0]
          });
          officer.set('lastName', {
            __type: "Bytes",
            base64: encryptedUser[1]
          });
          officer.set('phoneNumber', {
            __type: 'Bytes',
            base64: encryptedUser[2]
          });
          officer.set('zipCode', {
            __type: 'Bytes',
            base64: encryptedUser[3]
          });

          if(officerData.state){
            officer.set('state', {
              __type: 'Bytes',
              base64: encryptedUser[4]
            });
          }

          if(officerData.addressLine1){
            officer.set('addressLine1', {
              __type: 'Bytes',
              base64: encryptedUser[5]
            });
          }

          if(officerData.addressLine2){
            officer.set('addressLine2', {
              __type: 'Bytes',
              base64: encryptedUser[6]
            });
          }

          if(officerData.city){
            officer.set('city', {
              __type: 'Bytes',
              base64: encryptedUser[7]
            });
          }

          officer.set('email', officerData.email);
          officer.set('username', officerData.username);
          officer.set('password', officerData.password);
          officer.set('userPassword', hashedPassword);
          officerData.roles.push('user');
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