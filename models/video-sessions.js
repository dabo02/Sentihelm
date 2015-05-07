/**
 * Created by brianlandron on 5/7/15.
 */

(function () {
  'use strict';

  var db = require('../lib/db');
  var VideoSession = db.Object.extend('VideoSession');
  var videoSessionQuery = new db.Query(VideoSession);
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
      
      videoSessionQuery.include('mobileUser', 'officerUser', 'lastWatcher');
      videoSessionQuery.containedIn('archiveStatus', ['uploaded','available']);
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
          videoSessionQuery.equalTo('hasBeenWatched', undefined);
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
              var lastPageNum = Math.ceil(count/10);
              var data = {
                videos: videos,
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

})();
