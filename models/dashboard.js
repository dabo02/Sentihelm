/**
 * Created by brianlandron on 6/25/15.
 */
(function() {

  "use strict";

  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');
  var Q = require('q');

  module.exports.unreadTipsCount = function (data) {

    return Q.Promise(function (resolve, reject) {

      var tipReportQuery = new db.Query(TipReport);
      tipReportQuery.equalTo("hasBeenRead", data);
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

  module.exports.newVideosCount = function (data) {

    return Q.Promise(function (resolve, reject) {

      var userQuery = new db.Query(User);
      userQuery.equalTo("username", data);
      userQuery.find({
        success: function (users) {
          resolve(users);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  };

  module.exports.averageResponseTime = function (data) {

    return Q.Promise(function (resolve, reject) {

      var userQuery = new db.Query(User);
      userQuery.equalTo("username", data);
      userQuery.find({
        success: function (users) {
          resolve(users);
        },
        error: function (err) {
          reject(err);
        }
      });
    });
  };

})();