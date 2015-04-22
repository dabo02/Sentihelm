(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var db = require('../lib/db');
  var util = require('../lib/util');
  var Q = require('q');
  var _ = require('lodash');

  var clientParseObj;
  var Client = db.Object.extend("Client");
  var MostWanted = db.Object.extend("MostWanted");

  router
    .use(util.restrict)
    .get('/list', function (request, response) {
      var clientQuery = new db.Query(Client);
      clientQuery.include('mostWantedList');
      clientQuery.get(request.session.user.homeClient.objectId, {
        success: function (client) {
          var mostWantedArray = client.get('mostWantedList');

          var list = mostWantedArray.map(function (item) {
            return item.toJSON();
          });

          // Performming deep copy, as reference to object dies once this function, exits
          response.send(list);
        },
        error: function (object, error) {
          console.log("Error fetching most-wanted list.");
        }
      });
    })
    .put('/list', function (request, response) {
      var newList = request.body.list;

      new db.Query(Client)
        .get(request.session.user.homeClient.objectId)
        .then(function (clientParseObj) {
          _.forEach(newList, function (person) {
            var personData = {
              __type: "Pointer",
              className: "MostWanted",
              objectId: person.id
            };
            clientParseObj.remove('mostWantedList', personData);
            return clientParseObj.save(null, {
              success: function (client) {
                client.add('mostWantedList', personData);
                client.save();
              }
            });

          });
        })
        .then(function () {
          response.send(200);
        }, function (e) {
          console.error(e.message);
          resposne.status(503).send("Failed to save list");
        });

    })
    .delete('/remove', function (request, response) {
      new db.Query(Client)
        .get(request.session.user.homeClient.objectId)
        .then(function (clientParseObj) {
          new db.Query(MostWanted)
            .get(request.body.personId)
            .then(function (wantedPerson) {
              return wantedPerson.destroy().then(function (deletedPerson) {
                //Do something with the deleted object?
                clientParseObj.remove("mostWantedList", {
                  __type: "Pointer",
                  className: "MostWanted",
                  objectId: deletedPerson.id
                });
                return clientParseObj.save();
                mostWantedArray.splice(index, 1);
              });
            })
            .then(function () {
              response.send(200);
            }, function (d, e) {
              response.status(503).send(e.message);
            });
        })
    })
    .post('/save', function (request, response) {
      var wantedPerson;
      var person = request.body.person;
      var index = request.body.index;

      // Start the promise chain.
      Q.Promise(function (resolve, reject) {
          // a negative index indicates a new person.
          if (index < 0) {
            resolve(new MostWanted());
          } else {
            // otherwhise the prson already exists, so let's look for 'em.
            new db.Query(Mostanted)
              .get(person.objectId)
              .then(function (person) {
                resolve(person);
              }, function (e) {
                // something went wrong, handle it somewhere!
                reject(e);
              });
          }
        })
        .then(function (wantedPerson) {
          // Set the person's properties here.
          wantedPerson.set("age", person.age);
          wantedPerson.set("alias", person.alias);
          wantedPerson.set("birthdate", person.birthdate);
          wantedPerson.set("characteristics", person.characteristics);
          wantedPerson.set("eyeColor", person.eyeColor);
          wantedPerson.set("hairColor", person.hairColor);
          wantedPerson.set("height", person.height);
          wantedPerson.set("name", person.name);
          wantedPerson.set("race", person.race);
          wantedPerson.set("summary", person.summary);
          wantedPerson.set("weight", person.weight);
          wantedPerson.set("photo", person.photo);

          //
          return wantedPerson.save()
            .then(function (wantedPerson) {
              /**
               * Add the person to the client's mostWantedList array if we have
               * a new person (index of -1).
               */
              return new db.Query(Client)
                .include('mostWantedList')
                .get(request.session.user.homeClient.objectId)
                .then(function (clientParseObj) {
                  if (index < 0) {
                    clientParseObj.add("mostWantedList", {
                      __type: "Pointer",
                      className: "MostWanted",
                      objectId: wantedPerson.id
                    });
                  }

                  // save the list and continue execution.
                  return clientParseObj.save();
                });

            });
        })
        .then(function (mostWantedList) {
          response.send(200);
        }, function (wantedPerson, error) { // An error has occured along the promise chain
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          response.status(504).send("Failed to save user. Contact administrator to check logs");
          var dateNow = (new Date(Date.now())).toDateString();
          console.error("Error along promise chaing for saving wanted persons at %s: \n\t\t%s", dateNow, err.message);
        });
    });

    module.exports = router;
})();
