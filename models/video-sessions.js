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

  module.exports.list = function(data){

    return Q.Promise(function(resolve, reject){
      
      var skip = parseInt(data.skip, 10);
      var limit = parseInt(data.limit, 10);
      var videoDateFilter = data.videoDateFilter;
      var watchStatusFilter = data.watchStatusFilter;
      var homeClient = data.homeClient;
      var lastVideoCreatedAt = data.lastVideoCreatedAt;
      var parseSkipLimit = 10000;

      var videoSessionQuery = new db.Query(VideoSession);

      videoSessionQuery.include(['mobileUser', 'officerUser', 'lastWatcher']);
      videoSessionQuery.containedIn('archiveStatus',['uploaded','available']);
      videoSessionQuery.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: homeClient
      });

      videoSessionQuery.descending("createdAt");

      if(videoDateFilter){
        videoSessionQuery.greaterThanOrEqualTo('createdAt', new Date(videoDateFilter));
      }

      if(watchStatusFilter && watchStatusFilter != "All"){
        if(watchStatusFilter === "Watched"){
          videoSessionQuery.equalTo('hasBeenWatched', true);
        }
        else{
          videoSessionQuery.doesNotExist('hasBeenWatched');
        }
      }

      //parse skip limit hack for fetching more than 11,001 records..
      if(skip > parseSkipLimit){
        videoSessionQuery.lessThanOrEqualTo("createdAt", lastVideoCreatedAt);
        skip = 0;
      }

      videoSessionQuery.skip(skip);
      videoSessionQuery.limit(limit);
      videoSessionQuery.find({
        success: function(videos) {
          videoSessionQuery.count({
            success: function(count) {
              var updatedVideos = [];
              videos.forEach(function(video, index){
                var updatedVideo = video.toJSON();
                // get mobile user, then get last watcher, the get officer user then resolve promise
                if(video.attributes.mobileUser){
                  updatedVideo.mobileUser = video.attributes.mobileUser.attributes.username;
                }
                if(video.attributes.lastWatcher){
                  updatedVideo.lastWatcher = video.attributes.lastWatcher.attributes.username;
                }
                if(video.attributes.officerUser){
                  updatedVideo.officerUser = video.attributes.officerUser.attributes.username;
                }

                updatedVideos.  push(updatedVideo);

              });
              var lastPageNum = Math.ceil(count/10);
              var data = {
                videos: updatedVideos,
                lastPageNum: lastPageNum,
                videoTotal: count
              };
              resolve(data);
            },
            error: function(object, error) {
              // The object was not retrieved successfully.
              console.log("Error counting video archives.");
              reject(error);
            }
          })
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          console.log("Error fetching video archive.");
          reject(error);
        }
      });
    });
  };

  module.exports.getVideoUrl = function(data){

    return Q.Promise(function(resolve, reject){

      var archiveId = data.archiveId;
      // This URL will expire in one minute (60 seconds)
      var params = {Bucket: 'stream-archive', Key: config.opentok.key + '/' + archiveId + '/archive.mp4', Expires: 500};
      var s3 = new AWS.S3();
      try{
        var videoUrl = s3.getSignedUrl('getObject', params);
        resolve(videoUrl);
      }
      catch(e){
        reject(e);
      }
    });
  };

  module.exports.updateWatchersList = function(data){

    return Q.Promise(function(resolve, reject){

      var videoId = data.videoId;
      var userId = data.userId;

      var videoSessionQuery = new db.Query(VideoSession);

      videoSessionQuery.get(videoId, {
        success: function(videoSession) {
          videoSession.set('hasBeenWatched', true);
          videoSession.set('lastWatcher', {
            __type: "Pointer",
            className: "User",
            objectId: userId
          });
          if(!videoSession.get('officerUser')){
            videoSession.set('officerUser',{
              __type: "Pointer",
              className: "User",
              objectId: userId
            })
          }
          videoSession.save().then(function(object){
            resolve(object);
          });
        },
        error: function(object, error) {
          // The object was not retrieved successfully.
          console.log("Error fetching video for lastWatcher update.");
          reject(error);
        }
      });

    });
  };

})();
