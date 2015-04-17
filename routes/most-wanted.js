(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var db = require('./lib/db');
  var util = require('./lib/util');


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
          mostWantedArray = [];

          // Performming deep copy, as reference to object dies once this function, exits
          response.send(client.get('mostWantedList').toJSON());
        },
        error: function (object, error) {
          console.log("Error fetching most-wanted list.");
        }
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
            .then(null, function (d, e) {
              response.status(503).send(e.message);
            });
        })
    })
    .post('/save', function (request, response) {
      var wantedPerson;
      var person = request.body.person;
      var newPerson = false;


      if (index < 0) {
        db.Query(Mostanted)
          .get(person.objectId)
          .then(function (person) {
            if (person) {
              return person;
            } else {
              newPerson = true;
              return new MostWanted();
            }
          }, function () {
            return new MostWanted();
          })
          .then(function (wantedPerson) {
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

            wantedPerson.save()
              .then(function (wantedPerson) {
                // Execute any logic that should take place after the object is saved.
                // alert('New object created with objectId: ' + wantedPerson.id);

                //Add the wanted person to the array in the client object
                //and save in parse
                //
                return new db.Query(Client)
                  .get(request.session.user.homeClient.objectId)
                  .then(function (clientParseObj) {
                    //if (index < 0) {
                    if (newPerson) {
                      clientParseObj.add("mostWantedList", {
                        __type: "Pointer",
                        className: "MostWanted",
                        objectId: wantedPerson.id
                      });
                    }
                    //mostWantedArray.push(wantedPerson);
                    //$rootScope.$broadcast('MostWantedList', mostWantedArray);
                    //} else {
                    //$rootScope.$broadcast('UpdateMostWanted', [mostWantedArray[index], index]);
                    //}
                    return clientParseObj.save();
                  });

              })
              .then(function () {
                response.send(200);
              }, function (wantedPerson, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                response.status(504).send(error.message);
              });
          });
        wantedPerson = new MostWanted();
      } else {
        wantedPerson = mostWantedArray[index];
      }

    });
})();
