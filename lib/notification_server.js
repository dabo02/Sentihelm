/**
 * Created by vectorhacker on 3/27/15.
 */

(function () {
  'use strict';

  // for use only when testing.
  var ioServer = require('socket.io');
  var db = require('./db');

  //Set up db classes for queries
  var TipReport = db.Object.extend("TipReport");
  var Client = db.Object.extend("Client");
  var User = db.Object.extend("_User");
  var VideoSession = db.Object.extend("VideoSession");
  var PushNotification = db.Object.extend("FollowUpNotifications");

  function notificationServer(socket) {
    //Front-end requested a new batch of tips;
    //get query data and fetch
    socket.on('start-session', function () {
      var clientId = socket.session.user.homeClient.objectId;
      socket.join(clientId);
    });

    //Encrypt and send follow-up.
    socket.on('new-follow-up-notif', function (data) {
      saveAndPushNotification(data.notificationData)
        .then(function () {
          socket.emit('follow-up-notif-sent');
        }, function (error) {
          console.log(error.message);
        });
    });

    //Add a new officer to Sentihelm
    socket.on('add-new-officer', function (data) {
      var officer = data.newOfficer;
      var clientId = data.clientId;
      addNewOfficer(officer, clientId).then(function (newOfficer) {
        //Successfuly added; alert front-end
        socket.emit('new-officer-added');
        console.log("Sign up succesful..");
      }, function (error) {
        //Failed adding officer; alert front-end
        console.log(error);
        socket.emit('new-officer-failed', {
          error: error.message
        });
      });
    });

    //Save user to Sentihelm
    socket.on('save-user', function (data) {
      var user = data.user;
      saveUser(user).then(function (user) {
        // Execute any logic that should take place after the object is saved.
        socket.emit('save-user-success');
      }, function (user, error) {
        // Execute any logic that should take place if the save fails.
        // error is a db.Error with an error code and message.
        if (error.message === 'user-session-timeout') {
          socket.emit('user-session-timeout');
        } else {
          socket.emit('save-user-failed');
        }
      });
    });

    //Save password to Sentihelm
    socket.on('save-user-password', function (data) {
      saveUserPassword(data).then(function (user) {
        // Execute any logic that should take place after the object is saved.
        socket.emit('save-user-password-success');
      }, function (user, error) {
        // Execute any logic that should take place if the save fails.
        // error is a db.Error with an error code and message.
        if (error.message === 'user-session-timeout') {
          socket.emit('user-session-timeout');
        } else {
          socket.emit('save-user-password-failed');
        }
      });
    });
    //Check for active streams on the VideoSession table on parse.
    socket.on('get-active-streams', function (clientId) {
      getActiveVideoStreams(clientId).then(function (streams) {
          //Format each result for front-end
          //keep them in modifiedStreams array
          var modifiedStreams = [];

          streams.forEach(function (stream) {
            var streamUser = stream.attributes.mobileUser,
              passPhrase = util.passwordGenerator.generatePassword(streamUser.attributes.username, false);

            //Create a new strem and copy over values
            //from current stream in results
            var newStream = {};
            newStream.connectionId = stream.id;
            newStream.sessionId = stream.attributes.sessionId;
            newStream.webClientToken = stream.attributes.webClientToken;
            newStream.latitude = stream.attributes.latitude;
            newStream.longitude = stream.attributes.longitude;
            newStream.currentCliendId = stream.attributes.client.id;
            newStream.userObjectId = stream.attributes.mobileUser.id;
            newStream.firstName = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.firstName.base64);
            newStream.lastName = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.lastName.base64);
            newStream.email = streamUser.attributes.email;
            newStream.phone = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.phoneNumber.base64);

            //Add modified stream to collection
            modifiedStreams.push(newStream);
          });
          //Send modified results to controller
          socket.emit('get-active-streams-response', modifiedStreams);
        },
        function (error) {
          //TODO
          //Manage error when couldn't fetch active video streams
          var err = error;
        });
    });

    socket.on('disconnect', function () {
      socket.rooms.forEach(function (room) {
        socket.leave(room);
      });
    });
  }

  //=========================================
  //  HELPER FUNCTIONS
  //=========================================

  //Creates and saves a notification, then calls
  //pushNotification, which alerts all mobile devices
  function saveAndPushNotification(notificationData) {
    var passPhrase = "";
    var query = new db.Query(db.User);
    return query.get(notificationData.userId).

    then(function (user) {
      var username = user.attributes.username;
      passPhrase = util.passwordGenerator.generatePassword(username);

      var notification = new PushNotification();
      notification.set("userId", notificationData.userId);
      notification.set("tipId", notificationData.controlNumber);

      notification.set('title', {
        __type: "Bytes",
        base64: util.encryptionManager.encrypt(passPhrase, notificationData.title)
      });

      notification.set('message', {
        __type: "Bytes",
        base64: util.encryptionManager.encrypt(passPhrase, notificationData.message)
      });

      if (notificationData.attachment) {
        var encryptedFile = util.encryptionManager.encrypt(passPhrase, notificationData.attachment);
        var attachment = new db.File('file', {
          base64: encryptedFile
        });
        notification.set(notificationData.attachmentType, attachment);
      }

      return notification.save();
    }).

    then(function (notification) {
      return pushNotification(notification);
    }, function (error) {
      var err = error;
    });
  }

  //Sends the already saved notification to the user; if pushing
  //failed, tries to revert save or continues as partial success
  function pushNotification(notification) {
    var pushChannels = ['user_' + notification.attributes.userId];
    return db.Push.send({
      channels: pushChannels,
      data: {
        alert: "New Follow-up Notification Available",
        badge: "Increment",
        sound: "cheering.caf",
        title: "Notification",
        pushId: notification.id,
        type: "follow-up"
      }
    });
  }

  //Adds a new officer/user to SentiHelm
  function addNewOfficer(officerData, clientId) {
    //Generate passphrase for encryption
    var passPhrase = "";
    passPhrase = util.passwordGenerator.generatePassword(officerData.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = util.encryptionManager.encrypt(passPhrase, officerData.fname);
    var encryptedLastName = util.encryptionManager.encrypt(passPhrase, officerData.lname);
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

    // officer.set('firstName', encryptedFirstName);
    officer.set('email', officerData.email);
    officer.set('username', officerData.username);
    officer.set('password', officerData.password);
    officer.set('userPassword', hashedPassword);
    officer.set('roles', [officerData.role]);
    officer.set('homeClient', {
      __type: "Pointer",
      className: "Client",
      objectId: clientId
    });

    //Save/Signup new officer
    return officer.signUp();
  }

  //Save/change user password
  function saveUserPassword(data) {

    var user = db.User.current();
    if (!user) {
      return {
        then: function (success, error) {
          error(user, Error('user-session-timeout'));
        }
      };
    }

    var prevPass = data.prevPass;
    var newPass = data.newPass;
    var confirmPass = data.confirmPass;


    //Change pass
    if (util.passwordGenerator.md5(prevPass) === user.attributes.userPassword) {

      //Throw pass incorrect
      user.set("password", newPass);
      user.set("userPassword", util.passwordGenerator.md5(newPass));
      return user.save();
    } else {
      //Incorrect password
      io.sockets.emit('save-user-password-failed');
      return {
        then: function (s, e) {
          "use strict";
          e(user, Error('save-user-password-failed'));
        }
      }
    }
  };


  function analyzeData(data) {
    var clientId = data.clientId;
    var month = data.month;
    var year = data.year;
    var isMonthSelected = !isNaN(month);

    //If not month was provided, set month to January
    if (!isMonthSelected) {
      month = 0;
    }
    //Make sure the values are integers
    else if (typeof month == 'string' || month instanceof String) {
      month = parseInt(month);
    }
    if (typeof year == 'string' || year instanceof String) {
      year = parseInt(year);
    }

    //Create query
    var tipQuery = new db.Query(TipReport);
    //Filter by clientId
    tipQuery.equalTo('clientId', {
      __type: "Pointer",
      className: "Client",
      objectId: clientId
    });
    tipQuery.limit(1000);
    if (!isMonthSelected) {
      tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
      tipQuery.lessThanOrEqualTo("createdAt", new Date(year + 1, month));
    } else {
      tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
      // If month is 11(December), upper bound will be january 1 of the next year
      tipQuery.lessThanOrEqualTo("createdAt", new Date(month !== 11 ? year : year + 1, (month + 1) % 12));
    }
    return tipQuery.find();

  }

  //Create the charts. If month is defined, create the LineChart with the days of
  //the month.


  //Get all active video streams from db
  function getActiveVideoStreams(clientId) {

    var VideoSession = db.Object.extend("VideoSession");
    var query = new db.Query(VideoSession);

    query.equalTo('client', {
      __type: "Pointer",
      className: "Client",
      objectId: clientId
    });
    query.containedIn("status", ['pending', 'active']);
    query.include("mobileUser");

    return query.find();
  }

  module.exports = notificationServer;
})();
