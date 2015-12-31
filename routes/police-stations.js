/**
 * Route controllers for the the Police Map API
 */
(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var db = require('../lib/db');
  var policeStationsModel = require('../models/police-stations');
  var PoliceMap = db.Object.extend("PoliceMap");
  var Q = require('q');

  router
  /**
   * 
   */
    .use(util.restrict)

    .get('/list', function (request, response) {
        policeStationsModel.getPoliceStationsList(request.query, request.session).then(function (markers) {
          response.send(markers);
        }, function (error) {
          response.status(503).send("FAILURE: Could not fetch police stations.");
        });
  })

    .post('/save', function (request, response) {
        policeStationsModel.savePoliceStationsList(request.body, request.session).then(function() {
          response.send(200);
        }, function (station,error) {
          console.log('Failed to create/update  Police Station on db Error: ' + error.message);
        });
  })


    .delete('/remove/:id', function (request, response) {
        policeStationsModel.removePoliceStation(request.params).then(function(){
          response.send(200);
        }, function(error) {
          response.status(503).send("FAILURE: could not delete station");
        });
  })

    .get('/center', function (request, response) {
      policeStationsModel.getCenter(request.session).then(function(center){
        response.send(center);
      }, function(error) {
        response.status(504).send("FAILURE: error fetching client"+error.message);
      });
  });

  module.exports = router;


})();
