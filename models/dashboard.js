/**
 * Created by brianlandron on 6/25/15.
 */
(function() {

  "use strict";

  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');
  var VideoSession = db.Object.extend('VideoSession');
  var Q = require('q');

  module.exports.averageResponseTime = function (data, homeClient) {
    return Q.promise(function (resolve, reject){
      var avgQuery = new db.Query(TipReport);
      avgQuery.exists("readBy");
      avgQuery.equalTo('clientId', {
        __type: "Pointer",
        className: "Client",
        objectId: homeClient
      });
      avgQuery.find({
        success: function(tips){
          resolve(tips);
          console.log('model');
        },
        error: function (err) {
          reject(err);
        }
      })
    });
  };

  module.exports.unreadTipsCount = function (data, homeClient) {
    return Q.Promise(function (resolve, reject) {
      var tipReportQuery = new db.Query(TipReport);
      tipReportQuery.doesNotExist("readBy");
      tipReportQuery.equalTo('clientId', {
        __type: "Pointer",
        className: "Client",
        objectId: homeClient
      });
      tipReportQuery.find({
        success: function (tips) {
          tipReportQuery.count({
            success: function(count){
              resolve(count);
            },
            error: function(err){
              reject(err);
            }
          });
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  };

  module.exports.newVideosCount = function (data, homeClient) {

    return Q.Promise(function (resolve, reject) {

      var videoQuery = new db.Query(VideoSession);
      videoQuery.doesNotExist("hasBeenWatched");
      videoQuery.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: homeClient
      });
      videoQuery.find({
        success: function (videos) {
          videoQuery.count({
            success: function(count){
              resolve(count);
            },
            error: function(err){
              reject(err);
            }
          });
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  };




})();