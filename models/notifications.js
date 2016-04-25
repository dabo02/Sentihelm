/**
 * Created by israel on 10/13/15.
 */
(function() {

    "use strict";

    var express = require('express');
    var db = require('../lib/db');
    var multiparty = require('connect-multiparty');
    var config = require('../config');
    var fs = require('fs');
    var path = require('path');
    var Q = require('q');
    var util = require('../lib/util');
    var FollowUpNotification = db.Object.extend("FollowUpNotifications");
    var PushNotification = db.Object.extend("PushNotifications");


    function deleteSavedNotification(notification, passedError) {

        new db.Query(FollowUpNotification)
            .get(notification.objectId)
            .then(function (notification) {
                notification.destroy({
                    success: function (notification) {
                    },
                    error: function (notification, error) {

                    }
                });
            });
    }


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
                notification.set("tipId", notificationData.tipId);
                notification.set("type", 'follow-up');

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


    module.exports.sendFollowUpNotification = function (body, session) {
        console.log("start");
        return Q.Promise(function(resolve,reject,notify){
            var notification = body.notification;
            notification.homeClient = session.user.homeClient.objectId;
            saveAndPushNotification(notification)
                .then(function () {
                    resolve();
                }, function (error) {
                    reject(error);
                });
        });
    };

    module.exports.sendRegionalNotification = function (body,session,files) {
        return Q.Promise(function(resolve,reject,notify){
            if (files) {
                var imageFile = files.file || null;
            }

            function save() {
                return Q.Promise(function (resolve, reject) {

                    notification.save()
                        .then(function (notification) {
                            resolve(notification);
                        }, function () {
                            reject();
                        });
                });
            };

            var notificationData = typeof body.notification !== 'object' ? JSON.parse(body.notification) : body.notification;
            var channels = typeof body.channels !== 'object' ? JSON.parse(body.channels) : body.channels;
            var titleBytes = new Buffer(notificationData.title);
            var messageBytes = new Buffer(notificationData.message);
            var notification = new PushNotification();

            notification.set("title", notificationData.title);
            notification.set("message", notificationData.message);
            notification.set("type", 'regional');
            notification.set("channels", channels);
            notification.set('client', {
                __type: "Pointer",
                className: "Client",
                objectId: session.user.homeClient.objectId
            });

            if (imageFile) {
                fs.readFile(imageFile.path, function (err, data) {
                    notification.set(notificationData.attachmentType, new db.File('file', {
                        base64: data.toString('base64')
                    }));
                    notification.save();
                });
            }
            save()
                .then(function (notification) {
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
                    resolve();
                }, function (error) {
                    deleteSavedNotification(notification, error);
                    reject(error);
                });
        });
    };

    module.exports.sendSMS = function (body) {
        return Q.Promise(function(resolve,reject,notify){
            db.Cloud.run('sendSMS', {
                To: body.To,
                From: body.From,
                Body: body.Body
            }, {
                success: function (result) {
                    resolve(result);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };

})();