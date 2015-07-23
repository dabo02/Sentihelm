// model for the client table

var db = require('../lib/db');
var Q = require('q');
var Client = db.Object.extend('Client');

// Gets client info.
module.exports.getById = function (clientId) {

  return Q.Promise(function (resolve, reject, notify) {
    console.log('client is %s', clientId);

    new db.Query(Client)
      .include('regions')
      .include('mostWantedList')
      .get(clientId)
      .then(function (client) {
        if (client) {
          client.save();
          // Just sends a whole client as a result in the promise.
          resolve(client);
        } else {
          reject(new Error("Couldn't get client"));
        }


      }, function (error) {
        reject(new Error(error));
      });
  });
};

module.exports.language = function (data, homeClient){
  return Q.promise(function (resolve,reject){
    var langQuery = new db.Query(Client);
    langQuery.equalTo('objectId', homeClient);
    langQuery.find({
      success: function(lang){
        resolve(lang[0].attributes.language);
        console.log('model');
      },
      error: function (err) {
        reject(err);
      }
    })
  })
};
