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

          resolve([t, t.user, tip]);

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
        tipReportQuery.greaterThanOrEqualTo('createdAt', new Date(options.registeredOn));
      }

      // Gets crimes of a type
      if (parseInt(options.type) && parseInt(options.type) > -1) {
        tipReportQuery.equalTo('crimeListPosition', parseInt(options.type));
      }

      tipReportQuery.equalTo('clientId', {
        __type: "Pointer",
        className: "Client",
        objectId: options.from
      });

      // Sort by date
      tipReportQuery.descending("createdAt");

      if (options.skipping > parseSkipLimit) {
        //tipReportQuery.lessThanOrEqualTo("createdAt", lastUserCreatedAt); // talk over this
      }
      tipReportQuery.skip(options.skipping);
      tipReportQuery.limit(options.limitTo);
      tipReportQuery.include('user');


      // Switch between report types
      if (parseInt(options.reportType) > 0) {
        //var reportType = options.reportType.toLowerCase() || 'all';

        // Show only crime reports
        if (parseInt(options.reportType) == 1) {
          tipReportQuery.exists('user');
        }
        // Show only anonymous tips
        if (parseInt(options.reportType) == 2) {
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
              resolve([resultingTips, count, Math.ceil(count / options.limitTo), options.page]);
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

  module.exports.saveBastaYaTip = function(tip, clientId){

    //var encryptedUser = util.encryptionManager.encryptUser(officerData);
    //Generate passphrase for encryption
    var passPhrase = "";
    passPhrase = util.passwordGenerator.generatePassword('bastaya');
    //var hashedPassword = util.passwordGenerator.md5('b@st4y@pr.0rg');

    //Encrypt user information
    var encryptedDescription = util.encryptionManager.encrypt(tip.description, passPhrase);
    var encryptedLongitude = util.encryptionManager.encrypt(tip.longitude, passPhrase);
    var encryptedLatitude = util.encryptionManager.encrypt(tip.latitude, passPhrase);
    var encryptedCrimeType = util.encryptionManager.encrypt(tip.crimeType, passPhrase);

    var newTip = new db.TipReport();

    newTip.set('clientId', clientId);
    newTip.set('crimeListPosition', crimeTypes[tip.crimeType].indexOf);
    newTip.set('crimeType',encryptedCrimeType);
    newTip.set('crimeDescription', encryptedDescription);
    newTip.set('longitude', encryptedLongitude);
    newTip.set('latitude', encryptedLatitude);

    newTip.set('User', {
      __type: "Pointer",
      className: "User",
      objectId: 'EHp63tRW1x'
    });

    if(tip.imageBytes.length > 0){
      //var encryptedImage = util.encryptionManager.encrypt(tip.imageBytes, passPhrase);
      newTip.set('attachmentPhoto', new db.File('photo', {
        base64: tip.imageBytes.toString('base64')
      }));
    }

    if(tip.audioBytes.length > 0){
      newTip.set('attachmentAudio', new db.File('audio', {
        base64: tip.audioBytes.toString('base64')
      }));
    }

    if(tip.videoBytes.length > 0){
      newTip.set('attachmentVideo', new db.File('video', {
        base64: tip.videoBytes.toString('base64')
      }));
    }

  };

})();
