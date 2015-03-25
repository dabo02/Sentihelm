var db = require('../lib/db');
var Q = require('q');

module.exports.sendPasswordResetRequest = function (email) {
  return Q.Promise(function (resolve, reject, notify) {
    db.requestPasswordReset(email)
      .then(function () {
        resolve();
      }, function (error) {
        reject(error);
      });
  });
};
