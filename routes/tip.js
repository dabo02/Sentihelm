(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();

  module.exports = function (io) {
    router.post('/new-tip', function (request, response) {
        var tip = request.body;
        var pass = tip.pass;
        var clientId = tip.clientId;
        if (pass == 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
          io.to(clientId).emit('new-tip', {
            tip: tip,
            clientId: clientId
          });
          response.send(200);
        }
      })
      .get('/tip', function (request, response) {
        var tipId = request.param.id;


        // TODO call model methods and return
        // result.

      });


    return router;
  };
})();
