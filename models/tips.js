(function () {
  'use strict';

  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');
  var Q = require('q');

  // Specify the crime types.
  var crimeTypes = ["Assault",
    "Child Abuse",
    "Elderly Abuse",
    "Domestic Violence",
    "Drugs",
    "Homicide",
    "Animal Abuse",
    "Robbery",
    "Sex Offenses",
    "Bullying",
    "Police Misconduct",
    "Bribery",
    "Vehicle Theft",
    "Vandalism",
    "Auto Accident",
    "Civil Rights",
    "Arson",
    "Other"
  ];

  // Gets a tip by its objectId
  module.exports.getById = function (id) {
    return Q.Promise(function (resolve, reject) {
      new db.Query(TipReport)
        .include('user')
        .get(id)
        .then(function (tip) {
          var t = tip.toJSON();

          if (t.user) {
            t.user = tip.get('user').toJSON();
          }

          resolve([t, t.user]);

        }, function (e) {
          reject(e);
        });
    });
  };

  // Finds a list of tips based on a few querie options
  // searchString: corresponds to email or username to search for
  // registeredOn: a date to search for
  // type: find crimes of a specific type
  // from: get tips for a specific client
  // limitTo: number of crimes to get
  // skipping: how many crimes to skip
  // reportType: can either be 'crime reports' or 'tips'.
  module.exports.listTips = function (options) {
    return Q.Promise(function (resolve, reject) {
      var tipReportQuery = new db.Query(TipReport);
      var parseSkipLimit = 10000;

      // If there's a searchString get the username or email associated with that tip.
      if (options.searchString) {
        var usernameQuery = new db.Query("_User");
        usernameQuery.startsWith("username", options.searchString);

        var emailQuery = new db.Query("_User");
        emailQuery.startsWith("email", options.searchString);

        var innerQuery = db.Query.or(usernameQuery, emailQuery);
        tipReportQuery.matchesQuery("user", innerQuery);
      }

      // Starts to find tips on a date greater than or equal to what was specified.
      if (options.registeredOn) {
        tipReportQuery.greaterThanOrEqualTo('createdAt', new Date(
          options.registeredOn));
      }

      // Gets crimes of a type
      if (options.type && options.type !== 'All') {
        tipReportQuery.equalTo('crimeListPosition', crimeTypes.indexOf(options.type));
      }

      tipReportQuery.equalTo('clientId', {
        __type: "Pointer",
        className: "Client",
        objectId: options.from
      });

      tipReportQuery.descending("createdAt");

      if (options.skipping > parseSkipLimit) {
        //tipReportQuery.lessThanOrEqualTo("createdAt", lastUserCreatedAt); // talk over this
      }
      tipReportQuery.skip(options.skipping);
      tipReportQuery.limit(options.limitTo);
      tipReportQuery.include('user');


      // Switch between report types
      if (options.reportType) {
        var reportType = options.reportType.toLowerCase() || 'all';

        // Show only crime reports
        if (reportType === 'crime reports') {
          tipReportQuery.exists('user');
        }
        // Show only anonymous tips
        if (reportType === 'tips') {
          tipReportQuery.equalTo('user', undefined);
        }

      }

      tipReportQuery.find({
        success: function (tips) {
          var resultingTips = [];

          tips.forEach(function (tip) {
            var t = tip.toJSON();

            // Gets the crime type and flattens tip
            t.crimeType = crimeTypes[t.crimeListPosition];
            if (t.user) {
              t.user = tip.get('user').toJSON();
              t.anonymous = false;
            } else {
              t.anonymous = true;
            }

            resultingTips.push(t);
          });

          // Returns the tips, the number of tips for the query, and the "page" or section number
          tipReportQuery.count({
            success: function (count) {
              resolve([resultingTips, count, Math.ceil(count / options.limitTo)]);
            },
            error: function (object, error) {
              // The object was not retrieved successfully.
              reject(error);
            }
          });


        },
        error: function (object, error) {
          // The object was not retrieved successfully.
          console.error('Error fetching users list');
          reject(error);
        }
      });
    });
  };

  // Sets a specific tip as read by a user
  // tipId: objectId
  // lastReadByUsername: string username of last reader.
  module.exports.setTipAsRead = function (tipId, lastReadByUsername) {
    return Q.Promise(function (resolve, reject) {
      new db.Query(TipReport)
        .get(tipId).then(function (tip) {
            if (tip) {
              tip
                .add("readBy", {
                  username: lastReadByUsername,
                  date: Date.now()
                })
                .save({
                  success: function () {
                    resolve();
                  },
                  error: function (e) {
                    reject(e);
                  }
                })
            }
          }, function (e) {
            reject(e);
          });
    });
  };
})();
