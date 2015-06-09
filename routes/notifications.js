/**
 * Created by vectorhacker on 5/7/15.
 *
 */
(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var db = require('../lib/db');
  var multipart = require('connect-multiparty');
  var config = require('../config');
  var fs = require('fs');
  var path = require('path');
  var Q = require('q');

  var FollowUpNotification = db.Object.extend("FollowUpNotifications");
  var PushNotification = db.Object.extend("PushNotifications");

  //Delete saved notification; broadcast notification sent error
  //or partial success, depending on if it was deleted or not
  function deleteSavedNotification(notification, passedError) {

    new db.Query(FollowUpNotification)
      .get(notification.objectId)
      .then(function (notification) {
        notification.destroy({
          success: function (notification) {
            //Notification was successfully deleted;
            //Alert the controller to prompt the user
            //to try again
            //if (notification.attributes.type === 'follow-up') {
            //  $rootScope.$broadcast('notification-error', [notification, parentError]);
            //} else {
            //  $rootScope.$broadcast('regional-notification-error', [notification, parentError]);
            //}
          },
          error: function (notification, error) {
            //Failed to delete notification
            //Do Nothing, but alert controller
            //to partial success
            //if (notification.attributes.type === 'follow-up') {
            //  $rootScope.$broadcast('notification-partial-success', [notification]);
            //} else {
            //  $rootScope.$broadcast('regional-notification-partial-success', [notification]);
            //}
            // $rootScope.$broadcast('notification-partial-success',[notification]);
          }
        });
      });
  }

  // Sends the already saved notification to the user; if pushing
  // failed, tries to revert save or continues as partial success
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

  // Creates and saves a notification, then calls
  // pushNotification, which alerts all mobile devices

  function saveAndPushNotification(notificationData) {
    var passPhrase = "";
    var query = new db.Query('_User');
    return query.get(notificationData.userId)
      .then(function (user) {
        var username = user.attributes.username;
        passPhrase = util.passwordGenerator.generatePassword(username);

        var notification = new FollowUpNotification();

        notification.set('client', {
          __type: "Pointer",
          className: "Client",
          objectId: notificationData.homeClient
        });
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
      })
      .then(function (notification) {
        return pushNotification(notification);
      });
  }

  router
    .use(util.restrict)
    .post('/followup', function (request, response) {
      var notification = request.body.notification;
      notification.homeClient = request.session.user.homeClient.objectId;

      saveAndPushNotification(notification)
        .then(function () {
          response.send(200);
        }, function (error) {
          console.warn(error.message);
          response.status(504).send("Could not send follow up notification");
        });

    })
    .post('/regional', multipart({
      uploadDir: config.tmp
    }), function (request, response) {
      if (request.files) {
        var attachment = request.files.file || null;
      }

      function save() {
        return Q.Promise(function (resolve, reject) {
          if (attachment) {
            var tempFile = path.join(config.tmp, attachment.name);
            fs.readFile(tempFile, function (err, file) {
              if (!err) {
                notification.set(notificationData.attachmentType, new db.File('attachment', file));
                notification.save();
                resolve(notification)
                  .then(function (notification) {
                    resolve(notification);
                  }, function () {
                    reject();
                  });
                fs.unlink(tempFile, function (err) {
                  if (!err) {
                    console.log("Temp file deleted");
                  }
                });
              }
            });
          } else {
            notification.save()
              .then(function (notification) {
                resolve(notification);
              }, function () {
                reject();
              });

          }
        });
      }

      // if being uploaded, it might stringify the json and this might cause a crash
      // let's just parse the json string and get on with our (and I mean mine) lives.
      var notificationData = typeof request.body.notification !== 'object' ? JSON.parse(request.body.notification) : request.body.notification;
      var channels = typeof request.body.channels !== 'object' ? JSON.parse(request.body.channels) : request.body.channels;

      var titleBytes = new Buffer(notificationData.title);
      var messageBytes = new Buffer(notificationData.message);

      var notification = new PushNotification();
      notification.set("title", notificationData.title);
      notification.set("message", notificationData.message);
      /*notification.set("title", {
        __type: 'Bytes',
        base64: titleBytes.toString('base64')
      });
      notification.set("message", {
        __type: 'Bytes',
        base64: messageBytes.toString('base64')
      });*/
      notification.set("type", 'regional');
      notification.set("channels", channels);

      notification.set('client', {
        __type: "Pointer",
        className: "Client",
        objectId: request.session.user.homeClient.objectId
      });

      save()
        .then(function (notification) {
          //Notification saved, now push it to channels
          //response.send(notification.toJSON());
          var notifParams = {
            channels: channels,
            data: {
              alert: notification.attributes.message,
              badge: "Increment",
              sound: "cheering.caf",
              title: notification.attributes.title,
              pushId: notification.id,
              type: "regional"
            }
          }
          return db.Push.send(notifParams);
        })
        .then(function () {
          response.send(200);
        }, function (error) {
          //Push was unsuccessful
          //Try and nuke notification
          deleteSavedNotification(notification, error);
          response.status(400).send(error);
        });
    });

  module.exports = router;

})();