/**
 * Created by vectorhacker on 5/7/15.
 *
 */
(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var util = require('../lib/util');
  var db = require('../lib/db');
  var multiparty = require('connect-multiparty');
  var multipart = multiparty();
  var config = require('../config');
  var fs = require('fs');
  var path = require('path');
  var notificationsModel = require('../models/notifications');


  router

    .use(util.restrict)

      .post('/followup', function (request, response) {
        notificationsModel.sendFollowUpNotification(request.body,request.session).then(function() {
          response.send(200);
          }, function(error) {
          console.warn(error.message);
          response.status(504).send("Could not send follow up notification");
        });
      })

      .post('/regional', multipart, function (request, response) {
        notificationsModel.sendRegionalNotification(request.body, request.session, request.files).then(function(){
          response.send(200);
          }, function (error) {
          response.status(400).send(error);
        });
      })

      .post('/sms', function (req, res) {
        notificationsModel.sendSMS(req.body).then(function(result){
          res.send(result);
          }, function (error) {
          res.status(503).send(error.message);
        });
      });

      module.exports = router;

    })();