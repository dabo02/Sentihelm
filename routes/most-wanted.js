(function () {
  'use strict';

  var counter = 0;
  var express = require('express');
  var router = express.Router();
  var db = require('../lib/db');
  var util = require('../lib/util');
  var multiparty = require('connect-multiparty');
  var multipart = multiparty();
  var config = require('../config');
  var fs = require('fs');
  var Client = db.Object.extend("Client");
  var MostWanted = db.Object.extend("MostWanted");
  var mostWantedModel = require('../models/most-wanted');

  router
    .use(util.restrict)

    .get('/list', function (request, response) {
        mostWantedModel.getMostWantedList(request.session).then(function(list) {
          response.send(list);
        }, function(error){
          console.log("Error fetching most-wanted list.");
        });
    })

    .put('/list', function (request, response) {
        mostWantedModel.saveMostWantedList(request.body,request.session).then(function() {
          response.send(200);
        }, function(e) {
          console.error(e.message);
          resposne.status(503).send("Failed to save list");
        })
    })

    .delete('/remove/:personId', function (request, response) {
        mostWantedModel.deleteFromMostWanted(request.params, request.session).then(function() {
          response.send(200);
        }, function(error) {
          response.status(503).send("something went wrong.");
        });
    })

    .post('/save', multipart, function (request, response) {
        mostWantedModel.saveMostWanted(request.body, request.session, request.files).then(function(){
          response.send(200);
        }, function(error){
          response.status(504).send("Failed to save user. Contact administrator to check logs");
          var dateNow = (new Date(Date.now())).toDateString();
          console.error("Error along promise chaing for saving wanted persons at %s: \n\t\t%s", dateNow, err.message);
        });
    });

  module.exports = router;
})();
