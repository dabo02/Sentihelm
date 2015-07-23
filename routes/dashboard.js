
(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var dashboardModel = require('../models/dashboard');

  router
    .use(util.restrict)
    .get('/unreadTipsCount', function (req, res) {

      dashboardModel.unreadTipsCount(req.body, req.session.user.homeClient.objectId).then(function (count) {
        res.send({unreadTipsCount: count});
      }, function (error) {
        res.status(503).send("FAILURE: Could not count unread tips. " + error.message);
      });
    })
    .get('/newVideosCount', function (req, res) {
      dashboardModel.newVideosCount(req.body, req.session.user.homeClient.objectId).then(function (count) {
        res.send({newVideosCount: count});
      }, function (error) {
        res.status(503).send("FAILURE: Could not count new videos. " + error.message);
      });
    })

    .get('/averageResponseTime', function (req, res) {
      dashboardModel.averageResponseTime(req.body, req.session.user.homeClient.objectId).then(function (tips) {
        res.send(tips);
      }, function (error) {
        res.status(503).send("FAILURE: Could not count unread tips. " + error.message);
      });
    });


  module.exports = router;

})();
