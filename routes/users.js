var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var util = require('../lib/util');
var usersModel = require('../models/users');

router
    .use(util.restrict)
    .get('/list', function (req, res) {
        var User = db.Object.extend("_User");
        var adminPanelQuery = new db.Query(User);
        var skip = parseInt(req.query.skip, 10);
        var limit = parseInt(req.query.limit, 10);
        var searchString = req.query.searchString;
        var registrationDate = req.query.registrationDate;
        var role = req.query.role;
        var homeClient = req.query.homeClient;
        var lastUserCreatedAt = req.query.lastUserCreatedAt;
        var parseSkipLimit = 10000;

        if (homeClient) {
            if (searchString) {
                var usernameQuery = new db.Query("_User");
                usernameQuery.startsWith("username", searchString);

                var emailQuery = new db.Query("_User");
                emailQuery.startsWith("email", searchString);

                adminPanelQuery = db.Query.or(usernameQuery, emailQuery);
            }

            if (registrationDate) {
                adminPanelQuery.greaterThanOrEqualTo('createdAt', new Date(registrationDate));
            }

            if(role){
                adminPanelQuery.equalTo('roles', role);
            }

            adminPanelQuery.equalTo('homeClient', {
            __type: "Pointer",
            className: "Client",
            objectId: homeClient
            });

            adminPanelQuery.descending("createdAt");

            //parse skip limit hack for fetching more than 11,001 records..
            if (skip > parseSkipLimit) {
                adminPanelQuery.lessThanOrEqualTo("createdAt", lastUserCreatedAt); // talk over this
            }

            adminPanelQuery.skip(skip);
            adminPanelQuery.limit(limit);
            adminPanelQuery.find({
            success: function (users) {


              adminPanelQuery.count({
                  success: function (count) {
                    var lastPageNum = Math.ceil(count / limit);

                      res.send({
                          users: users,
                          lastPageNum: lastPageNum,
                          userTotal: count
                      });
                  },
                  error: function (object, error) {
                    // The object was not retrieved successfully.
                    console.log("Error counting video archives.");
                    res.status(503)
                      .send('Error counting video archives.');
                  }
                })


            },
            error: function (object, error) {
              // The object was not retrieved successfully.
              console.error('Error fetching users list');
              res.status(503)
                .send('Error fetching users list');
            }
            });
        }
    })

    .post('/update/role', function(req, res){

        var data = {
            users: req.body.users,
            action: req.body.action,
            role:req.body.role
        };

        usersModel.updateRole(data).then(function () {
            res.send("SUCCESS: Role has been updated.");

        }, function (error) {
            res.status(503).send("FAILURE: Role could not be updated." + error.message);
        });
    })

    .post('save-user', function(req, res){

        var user = req.body.user;

        usersModel.saveUser(user).then(function () {
            res.send("SUCCESS: User has been saved.");

        }, function (error) {
            res.status(503).send("FAILURE: User could not be saved." + error.message);
        });
    })


module.exports = router;
