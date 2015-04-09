(function () {
  'use strict';

  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');
  var Q = require('q');

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

  module.exports.listTips = function (options) {
    return Q.Promise(function (resolve, reject) {
      var tipReportQuery = new db.Query(TipReport);
      var parseSkipLimit = 10000;

      if (options.searchString) {
        var usernameQuery = new db.Query("_User");
        usernameQuery.startsWith("username", options.searchString);

        var emailQuery = new db.Query("_User");
        emailQuery.startsWith("email", options.searchString);

        tipReportQuery = db.Query.or(usernameQuery, emailQuery);
      }

      if (options.registeredOn) {
        tipReportQuery.greaterThanOrEqualTo('createdAt', new Date(
          options.registeredOn));
      }

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


      if (options.reportType) {
        var reportType = options.reportType.toLowerCase() || 'all';

        if (reportType === 'crime reports') {
          tipReportQuery.equalTo('anonymousPassword', undefined);
        } else if (reportType === 'tips') {
          tipReportQuery.equalTo('user', undefined);
        } else {
          // empty
        }

      }

      tipReportQuery.find({
        success: function (tips) {
          var resultingTips = [];

          tips.forEach(function (tip) {
            var t = tip.toJSON();

            t.crimeType = crimeTypes[t.crimeListPosition];
            if (t.user) {
              t.user = tip.get('user').toJSON();
            }

            resultingTips.push(t);
          });

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
})();
