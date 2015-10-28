/**
 * Created by brianlandron on 5/7/15.
 */

(function () {
  'use strict';

  var db = require('../lib/db');
  var CsvExports = db.Object.extend('CsvExports');
  var Q = require('q');
  var util = require('../lib/util');

  module.exports.exportTipFeed = function (options) {

    return Q.Promise(function (resolve, reject) {

      db.Cloud.run('exportTipFeed-trigger', options, {
        success: function (result) {
          console.log('success cc')
        },
        error: function (error) {
          console.log('error cc')
        }
      });

      resolve();
    });
  };

  module.exports.fetchExportedCsv = function (data) {

    return Q.Promise(function (resolve, reject) {

    });
  };

})();
