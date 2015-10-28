/**
 * Created by brianlandron on 5/7/15.
 */

(function () {
  'use strict';

  var config = require('../config');
  var db = require('../lib/db');
  var AWS = require('../lib/aws');
  var VideoSession = db.Object.extend('VideoSession');
  var Q = require('q');
  var util = require('../lib/util');

  module.exports.list = function (data) {

    return Q.Promise(function (resolve, reject) {

      var skip = parseInt(data.skip, 10);
      var limit = parseInt(data.limit, 10);
      var videoDateFilter = data.videoDateFilter;
      var watchStatusFilter = data.watchStatusFilter;
      var homeClient = data.homeClient;
      var lastVideoCreatedAt = data.lastVideoCreatedAt;
      var parseSkipLimit = 10000;

      var videoSessionQuery = new db.Query(VideoSession);

      videoSessionQuery.include(['mobileUser', 'officerUser', 'lastWatcher']);
      videoSessionQuery.containedIn('archiveStatus', ['uploaded', 'available']);
      videoSessionQuery.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: homeClient
      });

      videoSessionQuery.descending("createdAt");

      if (videoDateFilter) {
        videoSessionQuery.greaterThanOrEqualTo('createdAt', new Date(videoDateFilter));
      }

      if (watchStatusFilter && watchStatusFilter != "All") {
        if (watchStatusFilter === "Watched") {
          videoSessionQuery.equalTo('hasBeenWatched', true);
        }
        else {
          videoSessionQuery.doesNotExist('hasBeenWatched');
        }
      }

      //parse skip limit hack for fetching more than 11,001 records..
      if (skip > parseSkipLimit) {
        videoSessionQuery.lessThanOrEqualTo("createdAt", lastVideoCreatedAt);
        skip = 0;
      }

      videoSessionQuery.skip(skip);
      videoSessionQuery.limit(limit);
      videoSessionQuery.find({
        success: function (videos) {
          videoSessionQuery.count({
            success: function (count) {
              var updatedVideos = [];
              videos.forEach(function (video, index) {
                var updatedVideo = video.toJSON();
                // get mobile user, then get last watcher, the get officer user then resolve promise
                if (video.attributes.mobileUser) {
                  updatedVideo.mobileUser = video.attributes.mobileUser.attributes.username;
                }
                if (video.attributes.lastWatcher) {
                  updatedVideo.lastWatcher = video.attributes.lastWatcher.attributes.username;
                }
                if (video.attributes.officerUser) {
                  updatedVideo.officerUser = video.attributes.officerUser.attributes.username;
                }

                updatedVideos.push(updatedVideo);

              });
              var lastPageNum = Math.ceil(count / 10);
              var data = {
                videos: updatedVideos,
                lastPageNum: lastPageNum,
                videoTotal: count
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
          console.log("Error fetching video archive.");
          reject(error);
        }
      });
    });
  };

  module.exports.getVideoUrl = function (data) {

    return Q.Promise(function (resolve, reject) {

      var archiveId = data.archiveId;
      // This URL will expire in one minute (60 seconds)
      var params = {Bucket: 'stream-archive', Key: config.opentok.key + '/' + archiveId + '/archive.mp4', Expires: 500};
      var s3 = new AWS.S3();
      try {
        var videoUrl = s3.getSignedUrl('getObject', params);
        resolve(videoUrl);
      }
      catch (e) {
        reject(e);
      }
    });
  };

  module.exports.updateWatchersList = function (data) {

    return Q.Promise(function (resolve, reject) {

      var videoId = data.videoId;
      var userId = data.userId;

      var videoSessionQuery = new db.Query(VideoSession);

      videoSessionQuery.get(videoId, {
        success: function (videoSession) {
          videoSession.set('hasBeenWatched', true);

          videoSession.add("watchedBy", {
            userId: userId,
            date: Date.now()
          });
          //videoSession.set('lastWatcher', {
          //  __type: "Pointer",
          //  className: "User",
          //  objectId: userId
          //});
          if (!videoSession.get('officerUser')) {
            videoSession.set('officerUser', {
              __type: "Pointer",
              className: "User",
              objectId: userId
            })
          }
          videoSession.save().then(function (object) {
            resolve(object);
          });
        },
        error: function (object, error) {
          // The object was not retrieved successfully.
          console.log("Error fetching video for lastWatcher update.");
          reject(error);
        }
      });

    });
  };


  module.exports.getActiveStreams = function (data) {

    return Q.promise(function (resolve, reject) {

      var VideoSession = db.Object.extend("VideoSession");
      var query = new db.Query(VideoSession);

      query.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: data.homeClient
      });
      query.containedIn("status", ['pending', 'active']);
      query.include("mobileUser");

      query.find().then(function (streams) {
          //Format each result for front-end
          //keep them in modifiedStreams array
          var modifiedStreams = [];

          streams.forEach(function (stream) {
            var streamUser = stream.attributes.mobileUser,
              passPhrase = util.passwordGenerator.generatePassword(streamUser.attributes.username, false);

            //Create a new stream and copy over values
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
          resolve(modifiedStreams);
        },
        function (error) {

          var err = error;
          reject(err);
        });
    });

  };


})();
