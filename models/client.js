// model for the client table

var db = require('../lib/db');
var Q = require('q');
var Client = db.Object.extend('Client');

module.exports.getById = function (clientId) {

  return Q.Promise(function (resolve, reject, notify) {
    console.log('client is %s', clientId);

    new db.Query(Client)
      .include('regions')
      .include('mostWantedList')
      .get(clientId)
      .then(function (client) {
        if (client) {
          resolve(client);
        } else {
          reject(new Errror("Couldn't get client"));
        }


      }, function (error) {
        reject(new Error(error));
      });
  });
};
