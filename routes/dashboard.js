/**
 * Created by brianlandron on 6/25/15.
 */
(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var dashboardModel = require('../models/dashboard');

  router
    .use(util.restrict)
    .get('/unreadTipsCount', function (req, res) {
      dashboardModel.unreadTipsCount(req.body).then(function(count){
        res.send(count);
      }, function (error) {
        res.status(503).send("FAILURE: Could not count unread tips. " + error.message);
      });
    })
    .get('/newVideosCount', function (req, res) {
      dashboardModel.newVideosCount(req.body).then(function(count){
        res.send(count);
      }, function (error) {
        res.status(503).send("FAILURE: Could not count new videos. " + error.message);
      });
    })
    .get('/averageResponseTime', function (req, res) {
      dashboardModel.averageResponseTime(req.body).then(function(avg){
        res.send(avg);
      }, function (error) {
        res.status(503).send("FAILURE: Could not calculate average response time. " + error.message);
      });
    });

  module.exports = router;

})();
