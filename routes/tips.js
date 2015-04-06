(function () {
  'use strict';
  var tipsModel = require('../models/tips');

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');

  router
    .use(util.restrict)
    .get('/list', function (request, response) {
      var skip = parseInt(request.query.skip, 10);
      var limit = parseInt(request.query.limit, 10);
      var searchString = request.query.searchString;
      var registrationDate = request.query.registrationDate;
      var homeClient = request.session.user.homeClient.objectId;
      var crimeType = request.query.crimeType;
      var reportType = request.query.type;

      tipsModel
        .listTips({
          skipping: skip,
          limitTo: limit,
          from: homeClient,
          registeredOn: registrationDate,
          type: crimeType,
          searchString: searchString,
          reportType: reportType
        })
        .then(function (data) {
          var tips = data[0], totalTips = data[1] || 0, lastPageNum = data[2] || 0;
          response.json({
            tips: tips,
            totalTips: totalTips,
            lastPageNum: lastPageNum
          });
        }, function (err) {
          console.warn(err.message);
          response
            .status(503)
            .send('Error getting list of tips');
        });

    });

  module.exports = router;
})();
