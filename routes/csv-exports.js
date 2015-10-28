/**
 * Created by brianlandron on 5/7/15.
 */
(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var db = require('../lib/db');
  var util = require('../lib/util');
  var csvExportsModel = require('../models/csv-exports');

  router
    .use(util.restrict)

    .post('/exportTipFeed', function(request, response){
      var searchString = request.body.params.searchString;
      var registrationDate = request.body.params.registrationDate;
      var homeClient = request.session.user.homeClient.objectId;
      var crimeType = request.body.params.crimeType;
      var reportType = request.body.params.type;
      var email = request.session.user.email;

      csvExportsModel
        .exportTipFeed({
          registeredOn: registrationDate,
          type: crimeType,
          searchString: searchString,
          reportType: reportType,
          homeClient: homeClient,
          email: email
        }).then(function(){
          response.send();
        }, function (error) {
          response.status(503).send("FAILURE: Csv export could not be completed.");
        });
    })

    .get('/getCsvFile', function(req,res){
      csvExportsModel.fetchExportedCsv(req.body).then(function(data){
        res.send(data);
      }, function(error){
        res.status(503).send(error);
      });
    });

  module.exports = router;
})();