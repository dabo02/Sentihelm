(function() {

  "use strict";

  var db = require('../lib/db');
  var User = db.Object.extend('_User');
  var util = require('../lib/util');
  var Q = require('q');


  module.exports.getUsersList = function (query, session){

    return Q.Promise(function(resolve,reject, notify) {

      var User = db.Object.extend("_User");
      var adminPanelQuery = new db.Query(User);
      var skip = parseInt(query.skip, 10);
      var limit = parseInt(query.limit, 10);
      var searchString = query.searchString;
      var registrationDate = query.registrationDate;
      var role = query.role;
      var homeClient = session.user.homeClient.objectId;
      var lastUserCreatedAt = query.lastUserCreatedAt;
      var parseSkipLimit = 10000;

      if (homeClient) {
        if (searchString) {
          var usernameQuery = new db.Query("_User");
          usernameQuery.startsWith("username", searchString);

          var emailQuery = new db.Query("_User");
          emailQuery.startsWith("email", searchString);

          adminPanelQuery = db.Query.or(usernameQuery, emailQuery);
        }

        if (registrationDate) {
          adminPanelQuery.greaterThanOrEqualTo('createdAt', new Date(registrationDate));
        }

        if(role){
          adminPanelQuery.equalTo('roles', role);
        }
        else{
          adminPanelQuery.containedIn('roles', ['admin','employee']);
        }

        adminPanelQuery.equalTo('homeClient', {
          __type: "Pointer",
          className: "Client",
          objectId: homeClient
        });

        adminPanelQuery.descending("createdAt");

        //parse skip limit hack for fetching more than 11,001 records..
        if (skip > parseSkipLimit) {
          adminPanelQuery.lessThanOrEqualTo("createdAt", lastUserCreatedAt); // talk over this
          skip = 0;
        }

        adminPanelQuery.skip(skip);
        adminPanelQuery.limit(limit);
        adminPanelQuery.find({
          success: function (users) {


            adminPanelQuery.count({
              success: function (count) {
                var lastPageNum = Math.ceil(count / limit);

                var data = {
                  users: users,
                  lastPageNum: lastPageNum,
                  userTotal: count
                };
                resolve(data);
              },
              error: function (object, error) {
                // The object was not retrieved successfully.
                console.log("Error counting video archives.");
                reject(error);
              }
            })


          },
          error: function (object, error) {
            // The object was not retrieved successfully.
            console.error('Error fetching users list');
            reject(error);
          }
        });
      }
      else{
        reject(error);
      }

    });
  };

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
        attrs: ['firstName', 'lastName', 'phoneNumber', 'zipCode', 'email', 'roles', 'permissions'],
        values: [encryptedUser[0], encryptedUser[1], encryptedUser[2], encryptedUser[3], email, role, permissions],
        action: 'none'
      }

      var optionalFieldIndex = 4;

      if (user.state) {
        data.attrs.push('state');
        data.values.push(encryptedUser[optionalFieldIndex++]);
      }

      if (user.addressLine1) {
        data.attrs.push('addressLine1');
        data.values.push(encryptedUser[optionalFieldIndex++]);
      }

      if (user.addressLine2) {
        data.attrs.push('addressLine2');
        data.values.push(encryptedUser[optionalFieldIndex++]);
      }

      if (user.city) {
        data.attrs.push('city');
        data.values.push(encryptedUser[optionalFieldIndex]);
      }

      db.Cloud.run('updateUser', data, {
        success: function (result) {
          resolve();
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  };

  module.exports.updatePassword = function (data) {

    return Q.Promise(function (resolve, reject) {
      db.Cloud.run('updatePassword', data, {
        success: function (result) {
          resolve();
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  };

  module.exports.updateRole = function (data) {

    return Q.Promise(function (resolve, reject) {
      db.Cloud.run('updateUserRole', data, {
        success: function (result) {
          resolve();
        },
        error: function (error) {
          reject(error);
        }
      });
    });
  };

  module.exports.deleteUser = function (users) {

    return Q.Promise(function (resolve, reject) {

      users.forEach(function (user) {

        var data = {
          user: user,
          attrs: ['roles', 'permissions'],
          values: [undefined, undefined],
          action: 'delete'
        }

        db.Cloud.run('updateUser', data, {
          success: function (result) {
            resolve();
          },
          error: function (error) {
            reject(error);
          }
        });
      });
    });
  };

  module.exports.decryptUser = function (data) {

    return Q.Promise(function (resolve, reject) {

      var user = data;

      try {

        var passPhrase = util.passwordGenerator.generatePassword(user.username);

        user = util.encryptionManager.decryptUser(passPhrase, user);

        resolve(user);
      }
      catch (e) {
        reject(e);
      }
    });
  };

  module.exports.addNewOfficer = function (officerData, clientId) {

    return Q.Promise(function (resolve, reject) {

      var userQuery = new db.Query(User);
      userQuery.equalTo("username", officerData.username);
      userQuery.find({
        success: function (users) {

          if (users.length > 0) {
            //modify array so cloud code recognizes input
            var passPhrase = util.passwordGenerator.generatePassword(users[0].username);
            var encryptedUser = util.encryptionManager.encryptUser(officerData, passPhrase);
            var hashedPassword = util.passwordGenerator.md5(officerData.password);

            var data = {
              user: {"objectId": users[0].id},
              attrs: ['firstName', 'lastName', 'phoneNumber', 'zipCode', 'email', 'roles', 'permissions', 'password', 'userPassword'],
              values: [encryptedUser[0], encryptedUser[1], encryptedUser[2], encryptedUser[3], officerData.email, officerData.roles[0], officerData.permissions, officerData.password, hashedPassword],
              action: 'none'
            };

            var optionalFieldIndex = 4;
            //TODO add optional fields to data.attrs and data.values
            if (officerData.state) {
              data.attrs.push('state');
              data.values.push(encryptedUser[optionalFieldIndex++]);
            }

            if (officerData.addressLine1) {
              data.attrs.push('addressLine1');
              data.values.push(encryptedUser[optionalFieldIndex++]);
            }

            if (officerData.addressLine2) {
              data.attrs.push('addressLine2');
              data.values.push(encryptedUser[optionalFieldIndex++]);
            }

            if (officerData.city) {
              data.attrs.push('city');
              data.values.push(encryptedUser[optionalFieldIndex]);
            }

            db.Cloud.run('updateUser', data, {
              success: function (result) {
                resolve("Access to SentiHelm has been granted to existing user " + officerData.username);
              },
              error: function (error) {
                reject(error);
              }
            });
          }
          else {

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

            var optionalFieldIndex = 4;

            if (officerData.state) {
              officer.set('state', {
                __type: 'Bytes',
                base64: encryptedUser[optionalFieldIndex++]
              });
            }

            if (officerData.addressLine1) {
              officer.set('addressLine1', {
                __type: 'Bytes',
                base64: encryptedUser[optionalFieldIndex++]
              });
            }

            if (officerData.addressLine2) {
              officer.set('addressLine2', {
                __type: 'Bytes',
                base64: encryptedUser[optionalFieldIndex++]
              });
            }

            if (officerData.city) {
              officer.set('city', {
                __type: 'Bytes',
                base64: encryptedUser[optionalFieldIndex]
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
            officer.signUp().then(function () {
              resolve("New user added to SentiHelm.");
            }, function (err) {
              reject(err);
            });
          }
        },
        error: function (err) {


        }
      });
    });
  };

  module.exports.getUsername = function (objectId) {
    return Q.Promise(function (resolve, reject) {
      new db.Query(User)
        .get(objectId)
        .then(function (user) {
          resolve(user.get('username'));
        }, function (reason) {
          reject(reason);
        });
    });
  };

})();