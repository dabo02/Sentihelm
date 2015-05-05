(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var tipModel = require('../models/tips');
  var util = require('../lib/util');
  var config = require('../config');
  var http = require('http');
  var fs = require('fs');
  var url = require('url');
  var path = require('path');
  // hot fix, avoids buffer overflow. This is the maxium number value javascript can handle,
  // which in bytes is about a file the size of
  // for version v0.12.x of node.
  if (!(parseInt(process.version.split('.')[1], 10) < 12)) {
    Buffer.poolSize = 9007199254740992;
  }
  
  router
    .use(util.restrict)
    .get('/:tipId/media', function (request, response) {
      var type = request.query.type;
      var tipId = request.params.tipId;
      var passPhrase;
      var uri, mime;

      tipModel.setTipAsRead(tipId, request.session.user.username);

      tipModel.getById(tipId).spread(function (tip, tipUser) {
        if (!tip.smsId) {
          passPhrase = util.passwordGenerator.generatePassword((!!tipUser ? tipUser.username : tip.anonymousPassword), !tipUser);
        } else {
          passPhrase = util.passwordGenerator.generatePassword(tip.smsId);
        }



        switch (type) {
        case 'IMG':
          uri = tip.attachmentPhoto.url;
          mime = 'image/jpg';
          break;
        case 'VID':
          uri = tip.attachmentVideo.url;
          mime = 'video/mp4';
          break;
        default:
          uri = tip.attachmentAudio.url;
          mime = 'audio/x-aac';
          break;
        }

        var options = {
          headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            'content-type': mime
          }
        };


        response.status(200);
        http.get(url.parse(uri), function (r) {
          var file = [];
          r.on('data', function (data) {
            file.push(data);
          });

          r.on('end', function () {
            var buffer = Buffer.concat(file);
            var fileB64 = buffer.toString('base64');
            var decrypt = util.encryptionManager.decrypt(passPhrase, fileB64);
            var fileName = Date.now();
            var filepath = '/temp/' + fileName + (mime === 'image/jpg' ? '.jpg' : (mime === 'video/mp4' ? '.mp4' : '.aac'));

            var decodedFile = new Buffer(decrypt, 'base64');
            var saveFilePath = path.join(config.serverRoot, './public', filepath);
            fs.writeFile(saveFilePath, decodedFile, function (err) {
              response.redirect(filepath);
              //response.sendfile(filepath, options);
              setTimeout(function () {
                fs.unlink('./public/' + filepath, function (err) {
                  if (!err) {
                    console.log("Unlinked file: %s", './public' + filepath);
                  } else {
                    console.warn("Couldn't delete file");
                  }
                });
              }, 60 * 1000); // delete after one minute
            });
          });
        });


      });
    })
    .get('/:tipId', function (request, response) {
      var tipId = request.params.tipId;

      tipModel.getById(tipId).spread(function (tip, tipUser) {
          var passPhrase;
          if (!tip.smsId) {
            passPhrase = util.passwordGenerator.generatePassword((!!tipUser ? tipUser.username : tip.anonymousPassword), !tipUser);
          } else {
            passPhrase = util.passwordGenerator.generatePassword(tip.smsId);
          }

          //If not an anonymous tip, get user information
          if (!!tipUser) {
            tip.firstName = util.encryptionManager.decrypt(passPhrase, tipUser.firstName.base64);
            tip.lastName = util.encryptionManager.decrypt(passPhrase, tipUser.lastName.base64);
            tip.username = tipUser.username;
            tip.phone = util.encryptionManager.decrypt(passPhrase, tipUser.phoneNumber.base64);
            tip.anonymous = false;
            tip.channel = "user_" + tipUser.id;
          } else {
            //Set tip to anonymous if the user was not found
            tip.firstName = "ANONYMOUS";
            tip.lastName = "";
            tip.anonymous = true;
          }

          //Prepare tip object with the values needed in
          //the front end; coordinates for map, tip control
          //number, and formatted date
          tip.center = {
            latitude: util.encryptionManager.decrypt(passPhrase, tip.crimePositionLatitude.base64),
            longitude: util.encryptionManager.decrypt(passPhrase, tip.crimePositionLongitude.base64)
          };
          tip.controlNumber = tip.objectId + "-" + tip.controlNumber; 
          var tempDate = (new Date(tip.createdAt));
          tempDate = tempDate.toDateString() + ' - ' + tempDate.toLocaleTimeString();
          tip.date = tempDate;
          tip.crimeDescription = tip.crimeDescription ? util.encryptionManager.decrypt(passPhrase, tip.crimeDescription.base64) : "";
          tip.crimeType = util.encryptionManager.decrypt(passPhrase, tip.crimeType.base64);
          tip.crimeListPosition = tip.crimeListPosition;
          tip.markers = [{
            id: tip.objectId,
            latitude: tip.center.latitude,
            longitude: tip.center.longitude,
            options: {
              draggable: false,
              title: "Crime Location",
              visible: true
            }
          }];

          if (tip.smsNumber) {
            tip.phone = util.encryptionManager.decrypt(passPhrase, tip.smsNumber.base64);
          }
          tipModel.setTipAsRead(tip.objectId, request.session.user.username);
          response.json(tip);
        })
        .then(null, function (e) {
          console.warn(e.message);
          response.status(503).send("FAILURE: COULDN'T RETRIEVE TIP");
        });


    });

  module.exports = router;
})();
