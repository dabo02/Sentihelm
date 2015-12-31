var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var util = require('../lib/util');
var usersModel = require('../models/users');

router
    .use(util.restrict)
    .get('/list', function (req, res) {
        usersModel.getUsersList(req.query, req.session).then(function (data) {
            res.send(data);
        }, function (error) {
            res.status(503).send("FAILURE: Could not get user(s).");
        });
    })

    .post('/update/role', function(req, res){

        var data = {
            users: req.body.users,
            action: req.body.action,
            role:req.body.role
        };

        usersModel.updateRole(req.body).then(function () {
            res.send("SUCCESS: Role has been updated.");

        }, function (error) {
            res.status(503).send("FAILURE: Role could not be updated.");
        });
    })

    .post('/update', function(req, res){

        usersModel.updateUser(req.body.user).then(function () {
            res.send("SUCCESS: Account details for " + req.body.user.username + " have been updated.");

        }, function (error) {
            res.status(503).send("FAILURE: User could not be updated.");
        });
    })

  .post('/update/password', function(req, res){

      usersModel.updatePassword(req.body).then(function () {
          res.send("SUCCESS: Password for " + req.body.user.username + " has been updated.");

      }, function (error) {
          res.status(503).send("FAILURE: Password could not be updated.");
      });
  })

  .post('/delete', function(req, res){

      usersModel.deleteUser(req.body.users).then(function () {
          res.send("SUCCESS: Deleted selected user(s).");

      }, function (error) {
          res.status(503).send("FAILURE: Could not delete selected user(s).");
      });
  })

  .post('/decrypt', function(req, res){

      usersModel.decryptUser(req.body.user).then(function (user) {
          res.send(user);

      }, function (error) {
          res.status(503).send("FAILURE: Could not fetch the selected user's information.");
      });
  })

  .post('/add', function(req, res){

      usersModel.addNewOfficer(req.body.newOfficer, req.session.user.homeClient.objectId).then(function(data) {
          res.send("SUCCESS: " + data);

      }, function (error) {
          res.status(503).send("FAILURE: Could not add new user.");
      });
  });


module.exports = router;
