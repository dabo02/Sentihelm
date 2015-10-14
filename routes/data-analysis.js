(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var db = require('../lib/db');
  var TipReport = db.Object.extend('TipReport');
  var dataAnalysisModel = require('../models/data-analysis');

  router
    .use(util.restrict)
    .get('/', function (request, response) {
        dataAnalysisModel.initializeDataAnalysis(request.query, request.session).then(function(charts) {
          response.send(charts);
        }, function(error) {
          response.status(503).send(error);
        })
    });

  module.exports = router;
})();
