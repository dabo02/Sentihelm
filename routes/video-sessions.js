/**
 * Created by brianlandron on 5/7/15.
 */
(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var db = require('../lib/db');
  var util = require('../lib/util');
  var videoSessionsModel = require('../models/video-sessions');
  var bodyParser = require('body-parser');
  var config = require('../config');

  router
    .use(util.restrict)
    .get('/list', function(req, res){
      req.query.homeClient = req.session.user.homeClient.objectId;
      videoSessionsModel.list(req.query).then(function(data){
        res.send(data);
      }, function(error){
        res.status(503).send(error);
      });
    })

    .get('/getVideoUrl', function(req, res){
      req.query.homeClient = req.session.user.homeClient.objectId;
      videoSessionsModel.getVideoUrl(req.query).then(function(data){
        res.send(data);
      }, function(error){
        res.status(503).send(error);
      });
    })

    .post('/updateWatchersList', function(req, res){
      req.body.userId = req.session.user.objectId;
      videoSessionsModel.updateWatchersList(req.body).then(function(data){
        res.send(data);
      }, function(error){
        res.status(503).send(error);
      });
    })

    .get('/getOTKey', function(req,res){
      res.send(config.opentok.key);
    });


  module.exports = router;
})();