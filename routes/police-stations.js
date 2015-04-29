(function () {
  'use strict';

  var db = require('../lib/db');
  var util = require('../lib/util');
  var express = require('express');
  var router = express.Router();
  var PoliceMap = db.Object.extend("PoliceMap");
  var Q = require('q');

  router
    .use(util.restrict)
    .get('/list', function (request, response) {
      var stationsMarkers = []; // edited
      new db.Query(PoliceMap)
        //Filter by clientId
        .equalTo('client', {
          __type: "Pointer",
          className: "Client",
          objectId: request.session.user.homeClient.objectId
        })
        .find()
        .then(function (results) {

          results.forEach(function (station) {
            var marker = {
              id: station.id,
              place_id: station.attributes.placeId,
              latitude: station.attributes.latitude,
              longitude: station.attributes.longitude,
              name: station.attributes.stationName,
              address: station.attributes.address,
              email: station.attributes.email,
              phone: station.attributes.phone,
              description: station.attributes.description,
              options: {
                draggable: false,
                title: station.attributes.stationName,
                visible: true
              },
              templateurl: 'window.tpl.html',
              show: request.query.editedMarkerId === station.id
            };
            marker.onClick = function () {
              marker.show = !marker.show;
            };
            stationsMarkers.push(marker);
          });

          return stationsMarkers;
          //Send new markers to the controller.
          //$rootScope.$broadcast('stations-markers-fetched', stationsMarkers);
        })
        .then(function (markers) {
          response.send(markers);
        }, function (error) {
          console.error(error.message);
          response.send("Couldn't fetch list.");
        });
    })
    .post('/save', function (request, response) {

      var stationInfo = request.body.stationInfo;
      var tempMarker = request.body.tempMarker;

      function getStation() {
        return Q.promise(function (resolve, reject) {
          if (!stationInfo.id) {
            station = new PoliceMap()
              .set("latitude", tempMarker.latitude)
              .set("longitude", tempMarker.longitude)
              .set("coordinates", new db.GeoPoint({
                latitude: tempMarker.latitude,
                longitude: tempMarker.longitude
              }))
              .set("client", {
                __type: "Pointer",
                className: "Client",
                objectId: request.session.user.homeClient.objectId
              })
              .save()
              .then(function (station) {
                resolve(station);
              });
          } else {
            new db.Query(PoliceMap)
              .get(stationInfo.id)
              .then(function (station) {
                resolve(station);
              });
          }
        });
      }

      getStation()
        .then(function (station) {

          station.set("stationName", stationInfo.name);
          station.set("address", stationInfo.address);
          station.set("phone", stationInfo.phone);
          station.set("description", stationInfo.description);
          station.set("email", stationInfo.email);
          return station
            .save();
        })
        .then(function () {
          response.send(200);
        }, function (station, error) {
          // Execute any logic that should take place if the save fails.
          // error is a dbError with an error code and message.
          console.log('Failed to create/update  Police Station on db Error: ' + error.message);
        });
    })
    .delete('/remove/:id', function (request, response) {
      var id = request.params.id;
      new db.Query(PoliceMap)
        .get(id)
        .then(function (station) {
          return station.destroy();
        })
        .then(function () {
          response.send(200);
        }, function () {
          console.log("Error fetching or deliting police station");
          response.send(504);
        });
    })
    .get('/center', function (request, response) {
      var Client = db.Object.extend("Client");
      var clientQuery = new db.Query(Client);
      clientQuery.get(request.session.user.homeClient.objectId, {
          success: function (client) {
              if (!!client.attributes.location) {
                  var center = {
                      latitude: client.attributes.location._latitude,
                      longitude: client.attributes.location._longitude
                  };

                  response.send(center);
              }
          },
          error: function (object, error) {
              console.log("Error fetching client: " + error.message);
              response.status(504).send("FAIL TO GET CENTER!!!");
          }
      });
    });

  module.exports = router;


})();
