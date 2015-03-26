var express = require('express');
var router = express.Router();
var Parse = require('../lib/db');
var util = require('../lib/util');

router
    .use(util.restrict)
  .get('/list', function (req, res) {
    var User = Parse.Object.extend("_User");
    var adminPanelQuery = new Parse.Query(User);
    var skip = parseInt(req.query.skip, 10);
    var limit = parseInt(req.query.limit, 10);
    var searchString = req.query.searchString;
    var registrationDate = req.query.registrationDate;
    var roles = req.query.roles instanceof Array === true ? req.query.roles : [req.query.roles];
    var homeClient = req.query.homeClient;
    var lastUserCreatedAt = req.query.lastUserCreatedAt;
    var parseSkipLimit = 10000;

    if (homeClient) {
      if (searchString) {
        var usernameQuery = new Parse.Query("_User");
        usernameQuery.startsWith("username", searchString);

        var emailQuery = new Parse.Query("_User");
        emailQuery.startsWith("email", searchString);

        adminPanelQuery = Parse.Query.or(usernameQuery, emailQuery);
      }

      if (registrationDate) {
        adminPanelQuery.greaterThanOrEqualTo('createdAt', new Date(
          registrationDate));
      }

      adminPanelQuery.containedIn('roles', roles);

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

    var users = req.body.users;
    var action = req.body.action;
    var role = req.body.role;

    Parse.Cloud.run('updateUserRole', {
       users: users,
       action: action,
       role: role
    }, {
        success: function(result) {
            res.send("SUCCESS: Role has been updated.")
        },
        error: function (error) {
            res.status(503).send("FAILURE: Role could not be updated.\n" + error.message);
        }
    });

  });


module.exports = router;
