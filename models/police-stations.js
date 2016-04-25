/**
 * Created by israel on 10/12/15.
 */

(function() {

    "use strict";

    var db = require('../lib/db');
    var util = require('../lib/util');
    var Q = require('q');
    var PoliceMap = db.Object.extend("PoliceMap");

    module.exports.getPoliceStationsList = function (query, session){

        return Q.Promise(function(resolve,reject, notify) {

            var stationsMarkers = []; // edited
            new db.Query(PoliceMap)
                //Filter by clientId
                .equalTo('client', {
                    __type: "Pointer",
                    className: "Client",
                    objectId: session.user.homeClient.objectId
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
                            templateUrl: 'window.tpl.html',
                            show: query.editedMarkerId === station.id
                        };
                        marker.onClick = function () {
                            marker.show = !marker.show;
                        };
                        stationsMarkers.push(marker);
                    });
                    return stationsMarkers;
                })
                .then(function (markers) {
                    resolve(markers);
                }, function (error) {
                    console.error(error.message);
                    reject(error);
                });
        });
    };

    module.exports.savePoliceStationsList = function(body, session){
        return Q.Promise(function(resolve,reject,notify){

            var stationInfo = body.stationInfo;
            var tempMarker = body.tempMarker;

            function getStation() {
                return Q.promise(function (resolve, reject) {
                    if (!stationInfo.id) {
                        var station = new PoliceMap()
                            .set("latitude", tempMarker.latitude)
                            .set("longitude", tempMarker.longitude)
                            .set("coordinates", new db.GeoPoint({
                                latitude: tempMarker.latitude,
                                longitude: tempMarker.longitude
                            }))
                            .set("client", {
                                __type: "Pointer",
                                className: "Client",
                                objectId: session.user.homeClient.objectId
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
                    resolve();
                }, function (station, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a dbError with an error code and message.
                   reject(error);
                });

        });

    };

    module.exports.removePoliceStation = function (params) {
      return Q.Promise(function(resolve,reject,notify){
          var id = params.id;
          new db.Query(PoliceMap)
              .get(id)
              .then(function (station) {
                  return station.destroy();
              })
              .then(function () {
                  resolve();
              }, function (error) {
                  reject(error);
              });
      });
    };

    module.exports.getCenter = function (session) {
      return Q.Promise(function(resolve,reject,notify){
          var Client = db.Object.extend("Client");
          var clientQuery = new db.Query(Client);
          clientQuery.get(session.user.homeClient.objectId, {
              success: function (client) {
                  if (!!client.attributes.location) {
                      var center = {
                          latitude: client.attributes.location._latitude,
                          longitude: client.attributes.location._longitude
                      };

                      resolve(center);
                  }
              },
              error: function (object, error) {

                  reject(error);
              }
          });
      });
    };

})();