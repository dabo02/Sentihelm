//=========================================
//  IMPORTS
//=========================================

//Imports for web server
//Create an express server (app)
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var config = require('./config');
var util = require('./lib/util');
var session = require('express-session');

//Import and initialize socket.io
//var io = require('socket.io')(server);

//Other imports
var Parse = require('parse').Parse;
var OpenTok = require('opentok');
var MobileClient = require('./lib/mobileclient');

Parse.initialize(config.parse.appId, config.parse.jsKey);

//Set up Parse classes for queries
var TipReport = Parse.Object.extend("TipReport");
var Client = Parse.Object.extend("Client");
var User = Parse.Object.extend("_User");
var VideoSession = Parse.Object.extend("VideoSession");
var PushNotification = Parse.Object.extend("FollowUpNotifications");

var opentok = new OpenTok(config.opentok.key, config.opentok.secret);

//Create an non-overriding log file and feed it
//to an express logger with default settings
app.use(logger('dev'));

//Attach a bodyParser in order to handle json and urlencoded
//bodies.
app.use(bodyParser.json());

//Add the static middleware: allows express to serve up
//static content in the specified directory (for CSS/JS).
app.use(express.static(__dirname + '/public'));

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@'
}));

// // ======================= Chat Server ==========================
// var runChatServer = require('./lib/chat_server');
//
// runChatServer(io, Parse, Client, User, app);
//
// // ===================== End Chat Server =========================
//
// //Setup socket.io that communicates with front end
// io.on('connect', function (socket) {
//     //Front-end requested a new batch of tips;
//     //get query data and fetch
//     socket.on('start-session', function (clientId) {
//         "use strict";
//         socket.join(clientId);
//     });
//
//     socket.on('request-batch', function (data) {
//
//         //Get filtering values: by clientId, date
//         //and tips after or before given date
//         var clientId = data.clientId;
//         var date = data.lastTipDate ? new Date(data.lastTipDate) : new Date();
//         var isAfterDate = data.isAfterDate;
//         var filter = data.filter;
//         var filterActivated = false;
//
//         //Create query
//         var tipQuery = new Parse.Query(TipReport);
//
//         //Filter by clientId
//         tipQuery.equalTo('clientId', {
//             __type: "Pointer",
//             className: "Client",
//             objectId: clientId
//         });
//
//         //Tell parse to include the user and client objects
//         //instead of just passing the pointers.
//         tipQuery.include('user');
//         tipQuery.include('clientId');
//
//         if (!!data.tipsToSkip) {
//             tipQuery.skip(data.tipsToSkip);
//         }
//
//         //If filter by crime type if activated
//         if (!!filter && !isNaN(filter.crimePosition)) {
//             filterActivated = true;
//             tipQuery.equalTo("crimeListPosition", filter.crimePosition);
//         }
//
//         //If filter by date is   activated
//         if (!!filter && !!filter.date) {
//             filterActivated = true;
//             filter.date = new Date(filter.date);
//             var dateAfter = new Date(filter.date);
//             dateAfter.setDate(dateAfter.getDate() + 1);
//             tipQuery.greaterThanOrEqualTo("createdAt", filter.date);
//             tipQuery.lessThanOrEqualTo("createdAt", dateAfter);
//
//         }
//
//         //Filter by date (before or after given date)
//         isAfterDate ? tipQuery.greaterThan("createdAt", date) :
//             tipQuery.lessThan("createdAt", date);
//
//         //If isAfterDate is false, query tips before said date in
//         //descending order (newest to oldest, earliest date first);
//         //otherwise, query tips after date in ascending order, but
//         //reverse final results array or tips will be incorrectly
//         //displayed from oldest to newest (tips in page 1 will be tips
//         //corresponding to page 10, and vice versa)
//         if (!isAfterDate) {
//             tipQuery.descending("createdAt");
//         }
//         else {
//             tipQuery.ascending("createdAt");
//         }
//
//         //If filter is not activated, limit the query to 10 and get the totalTipCount
//         //from the Client parse object on one of the received tips. If filter is activated
//         //get the totalTipCount from the number of tips received from parse.
//         if (!filterActivated) {
//             tipQuery.limit(10);
//         }
//         else {
//             tipQuery.limit(1000);
//         }
//
//         //Execute query
//         tipQuery.find({
//             success: function (tips) {
//
//                 //Get the total tip count if filter is activated
//                 if (filterActivated) {
//                     totalTips = tips.length;
//                     if (totalTips > 10) {
//                         tips = tips.slice(0, 10)
//                     }
//                 }
//
//                 //Reverse the array if the tips are in ascending
//                 //order(oldest to newest)
//                 if (isAfterDate) {
//                     tips.reverse();
//                 }
//
//                 var start = new Date().getTime();
//                 //Loop over the array to prepare the tip objects
//                 //for the front end
//                 for (var i = 0; i < tips.length; i++) {
//
//                     //Get the user from the tip. This works
//                     //because we are using tipQuery.include('user').
//                     //It doesn't need to reconnect to the database
//                     //to retreive the user that submitted the tip.
//                     var tipUser = tips[i].get('user')
//
//                     if (!tips[i].attributes.smsId) {
//                         var passPhrase = util.passwordGenerator.generatePassword((!!tipUser ? tipUser.attributes.username : tips[i].attributes.anonymousPassword), !tipUser);
//                     }
//                     else {
//                         var passPhrase = util.passwordGenerator.generatePassword(tips[i].attributes.smsId);
//                     }
//
//                     //Get the client object from the first tip to be
//                     //able to get the total tip count later on (all
//                     //tips have the same client).
//                     if (i === 0 && !filterActivated) {
//                         totalTips = tips[i].get('clientId').attributes.totalTipCount;
//                     }
//                     //Convert tip from Parse to Javascript object
//                     tips[i] = JSON.parse(JSON.stringify(tips[i]));
//                     //If not an anonymous tip, get user information
//                     if (!!tipUser) {
//                         tips[i].firstName = util.encryptionManager.decrypt(passPhrase, tipUser.attributes.firstName.base64);
//                         tips[i].lastName = util.encryptionManager.decrypt(passPhrase, tipUser.attributes.lastName.base64);
//                         tips[i].username = tipUser.attributes.username;
//                         tips[i].phone = util.encryptionManager.decrypt(passPhrase, tipUser.attributes.phoneNumber.base64);
//                         tips[i].anonymous = false;
//                         tips[i].channel = "user_" + tipUser.id;
//                     }
//                     else {
//                         //Set tip to anonymous if the user was not found
//                         tips[i].firstName = "ANONYMOUS";
//                         tips[i].lastName = "";
//                         tips[i].anonymous = true;
//                     }
//
//                     //Prepare tip object with the values needed in
//                     //the front end; coordinates for map, tip control
//                     //number, and formatted date
//                     tips[i].center = {
//                         latitude: util.encryptionManager.decrypt(passPhrase, tips[i].crimePositionLatitude.base64),
//                         longitude: util.encryptionManager.decrypt(passPhrase, tips[i].crimePositionLongitude.base64)
//                     };
//                     tips[i].controlNumber = tips[i].objectId + "-" + tips[i].controlNumber;
//                     var tempDate = (new Date(tips[i].createdAt));
//                     tempDate = tempDate.toDateString() + ' - ' + tempDate.toLocaleTimeString();
//                     tips[i].date = tempDate;
//                     tips[i].crimeDescription = tips[i].crimeDescription ? util.encryptionManager.decrypt(passPhrase, tips[i].crimeDescription.base64) : "";
//                     tips[i].crimeType = util.encryptionManager.decrypt(passPhrase, tips[i].crimeType.base64);
//                     tips[i].crimeListPosition = tips[i].crimeListPosition;
//                     tips[i].markers = [{
//                         id: tips[i].objectId,
//                         latitude: tips[i].center.latitude,
//                         longitude: tips[i].center.longitude,
//                         options: {
//                             draggable: false,
//                             title: "Crime Location",
//                             visible: true
//                         }
//                     }];
//
//                     if (tips[i].smsNumber) {
//                         tips[i].phone = util.encryptionManager.decrypt(passPhrase, tips[i].smsNumber.base64);
//                     }
//                 }
//
//                 //Send the tips to the front end
//                 socket.emit('response-batch', {tips: tips, totalTipCount: totalTips});
//             },
//             error: function (error) {
//                 //Tip fetching failed, emit response error
//                 //along with error object
//                 socket.emit('response-error', {error: error});
//             }
//         });
//
//     });
//
//     socket.on('request-media-url', function (data) {
//
//         //Get parseFile
//         var parseFile = data.parseFile;
//         //Generate password for decryption
//         var passPhrase = util.passwordGenerator.generatePassword(data.passPhrase, data.anonymous);
//
//         var url = parseFile.url;
//         var filepath = parseFile.name;
//
//         //Download file to server
//         var file = fs.createWriteStream(filepath);
//         var request = http.get(url, function (response) {
//             response.pipe(file);
//             file.on('finish', function () {
//                 //File finished downloading. Read file.
//                 fs.readFile(filepath, function (err, dataBuf) {
//
//                     //Select the correct extension depending on file type.
//                     if (data.type === 'IMG') {
//                         filepath = '/temp/file.jpg';
//                     }
//                     else if (data.type === 'VID') {
//                         filepath = '/temp/file.mp4';
//                     }
//                     else {
//                         filepath = '/temp/file.aac';
//                     }
//
//                     //Convert to base64 and decrypt.
//                     var fileB64 = dataBuf.toString('base64');
//                     var decrypt = util.encryptionManager.decrypt(passPhrase, fileB64);
//
//                     //Create buffer and write the decrypted file.
//                     var decodedFile = new Buffer(decrypt, 'base64');
//                     fs.writeFile('./public' + filepath, decodedFile, function (err) {
//                         //Delete the downloaded and encrypted file.
//                         fs.unlinkSync(parseFile.name);
//                     });
//
//                     //Send file url to front-end
//                     socket.emit('response-media-url', filepath);
//                 });
//             });
//         });
//     });
//
//     //Encrypt and send follow-up.
//     socket.on('new-follow-up-notif', function (data) {
//         saveAndPushNotification(data.notificationData)
//             .then(function () {
//                 socket.emit('follow-up-notif-sent');
//             }, function (error) {
//                 console.log(error.message);
//             });
//     });
//
//     //Add a new officer to Sentihelm
//     socket.on('add-new-officer', function (data) {
//         var officer = data.newOfficer;
//         var clientId = data.clientId;
//         addNewOfficer(officer, clientId).then(function (newOfficer) {
//             //Successfuly added; alert front-end
//             socket.emit('new-officer-added');
//             console.log("Sign up succesful..");
//         }, function (error) {
//             //Failed adding officer; alert front-end
//             console.log(error);
//             socket.emit('new-officer-failed', {error: error.message});
//         });
//     });
//
//     //Save user to Sentihelm
//     socket.on('save-user', function (data) {
//         var user = data.user;
//         saveUser(user).then(function (user) {
//             // Execute any logic that should take place after the object is saved.
//             socket.emit('save-user-success');
//         }, function (user, error) {
//             // Execute any logic that should take place if the save fails.
//             // error is a Parse.Error with an error code and message.
//             if (error.message === 'user-session-timeout') {
//                 socket.emit('user-session-timeout');
//             } else {
//                 socket.emit('save-user-failed');
//             }
//         });
//     });
//
//     //Save password to Sentihelm
//     socket.on('save-user-password', function (data) {
//         saveUserPassword(data).then(function (user) {
//             // Execute any logic that should take place after the object is saved.
//             socket.emit('save-user-password-success');
//         }, function (user, error) {
//             // Execute any logic that should take place if the save fails.
//             // error is a Parse.Error with an error code and message.
//             if (error.message === 'user-session-timeout') {
//                 socket.emit('user-session-timeout');
//             } else {
//                 socket.emit('save-user-password-failed');
//             }
//         });
//     });
//
//     //Download data from parse and organize it.
//     socket.on('analyze-data', function (data) {
//         analyzeData(data).then(function (tips) {
//             var charts = {},
//                 year = data.year,
//                 month = data.month,
//                 isMonthSelected = !isNaN(month);
//
//             charts.tipCount = tips.length;
//
//             if (isMonthSelected) {
//                 charts = getChartsData(tips, month, year);
//             }
//             else {
//                 charts = getChartsData(tips);
//             }
//
//             socket.emit('analyze-data-response', charts);
//         }, function (error) {
//             socket.emit('analyze-data-error', error);
//         });
//     });
//
//     //Check for active streams on the VideoSession table on parse.
//     socket.on('get-active-streams', function (clientId) {
//         getActiveVideoStreams(clientId).then(function (streams) {
//                 //Format each result for front-end
//                 //keep them in modifiedStreams array
//                 var modifiedStreams = [];
//
//                 streams.forEach(function (stream) {
//                     "use strict";
//                     var streamUser = stream.attributes.mobileUser,
//                         passPhrase = util.passwordGenerator.generatePassword(streamUser.attributes.username, false);
//
//                     //Create a new strem and copy over values
//                     //from current stream in results
//                     var newStream = {};
//                     newStream.connectionId = stream.id;
//                     newStream.sessionId = stream.attributes.sessionId;
//                     newStream.webClientToken = stream.attributes.webClientToken;
//                     newStream.latitude = stream.attributes.latitude;
//                     newStream.longitude = stream.attributes.longitude;
//                     newStream.currentCliendId = stream.attributes.client.id;
//                     newStream.userObjectId = stream.attributes.mobileUser.id;
//                     newStream.firstName = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.firstName.base64);
//                     newStream.lastName = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.lastName.base64);
//                     newStream.email = streamUser.attributes.email;
//                     newStream.phone = util.encryptionManager.decrypt(passPhrase, streamUser.attributes.phoneNumber.base64);
//
//                     //Add modified stream to collection
//                     modifiedStreams.push(newStream);
//                 });
//                 //Send modified results to controller
//                 socket.emit('get-active-streams-response', modifiedStreams);
//             },
//             function (error) {
//                 //TODO
//                 //Manage error when couldn't fetch active video streams
//                 var err = error;
//             });
//         ;
//     });
//
//     socket.on('disconnect', function () {
//         "use strict";
//        socket.rooms.forEach(function (room) {
//            socket.leave(room);
//        });
//     });
// });

//=========================================
//  SET UP ROUTING
//=========================================

var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);
app.use('/users', users);


//Recieve a request for a video stream connection;
//get data form mobile client, save session info in
//Parse and pass on to front-end
app.post('/request-video-connection', function (request, response) {

    //Check if password is valid
    if (request.body.password !== "hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@") {
        return;
    }

    //Get data representing the mobile client
    var connection = JSON.parse(request.body.data);

    //Create OpenTok session
    opentok.createSession({mediaMode: "routed"}, function (error, session) {

        //TODO
        //Handle Error when session could not be created
        if (error) {
            response.send(400, error);
            return;
        }

        //Create the token that will be sent to the mobile client
        var clientToken = opentok.generateToken(session.sessionId, {
            role: 'publisher',
            expireTime: ((new Date().getTime()) + 36000),
            data: JSON.stringify(connection)
        });

        //Create the token that officer will use to connect via web
        var webToken = opentok.generateToken(session.sessionId, {
            role: 'moderator',
            data: JSON.stringify(connection.currentClientId)
        });

        //Prepare video session object
        var videoSession = new VideoSession();
        videoSession.set('status', 'pending');
        videoSession.set('sessionId', session.sessionId);
        videoSession.set('mobileClientToken', clientToken);
        videoSession.set('webClientToken', webToken);
        videoSession.set('latitude', connection.latitude);
        videoSession.set('longitude', connection.longitude);
        videoSession.set('mobileUser', {
            __type: "Pointer",
            className: "User",
            objectId: connection.userObjectId
        });
        videoSession.set('client', {
            __type: "Pointer",
            className: "Client",
            objectId: connection.currentClientId
        });

        //Save video session, respond to
        //mobile client with sessionId and token,
        //and pass connection on to front-end
        videoSession.save().then(function (videoSession) {
            var stream = connection;
            stream.sessionId = session.sessionId;
            stream.connectionId = videoSession.id;
            stream.webClientToken = webToken;
            response.send(200, {
                objectId: videoSession.id,
                sessionId: session.sessionId,
                token: clientToken
            });
            io.to(connection.currentClientId).emit('new-video-stream', {stream: stream});

            /*  opentok.startArchive(stream.sessionId, { name: 'archive: ' + stream.sessionId }, function(err, archive) {
             if (err) return console.log(err);

             // The id property is useful to save off into a database
             console.log("new archive:" + archive.id);
             });*/
        }, function (error, videoSession) {
            //TODO
            //Handle error when couldn't save video session
            var err = error;
        });

    });

});

//Receive request to start archiving a video session
//and store the archiveId
app.post('/start-archive', function(request, response){

    console.log("\n\nIn start-archive...\n\n");
    //TODO why is the password check not being used?
    /*/Check if password is valid
    if(request.body.password!=="hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@"){
        return;
    }*/

    var videoSession = JSON.parse(request.body.data);

    opentok.startArchive(videoSession.sessionId, { name: 'archive: ' + videoSession.sessionId }, function(err, archive) {
      if (err){
          response.send(400,err);
          return console.log(err + " Session id: " + videoSession.sessionId);
      }

      var videoSessionQuery = new Parse.Query(VideoSession);
      videoSessionQuery.equalTo("sessionId", videoSession.sessionId);
      videoSessionQuery.find({
          success: function(videoSessions) {
              videoSessions[0].set('archiveId', archive.id);
              videoSessions[0].save();
          },
          error: function(object, error) {
              // The object was not retrieved successfully.
              console.log("Error fetching video for archive ID update.");
          }
      });
    });

});

//Recieve  request to start archiving a video session
//and pass it along to front-end
app.post('/opentok-callback', function(request, response){

    //TODO add another request with a password sent in parameters that would actually tend to the opentok callback
    console.log("\n\nIn opentok-callback...\n\n");

    var opentokCallbackJSON = request.body;

    var videoSessionQuery = new Parse.Query(VideoSession);
    videoSessionQuery.equalTo("sessionId", opentokCallbackJSON.sessionId);
    videoSessionQuery.find({
        success: function(videoSessions) {
            videoSessions[0].set('archiveStatus', opentokCallbackJSON.status);
            videoSessions[0].set('duration', opentokCallbackJSON.duration);
            videoSessions[0].set('reason', opentokCallbackJSON.reason);
            videoSessions[0].set('archiveSize', opentokCallbackJSON.size);
            videoSessions[0].save();
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            console.log("Error fetching video for archive ID update on Opentok callback.");
        }
    });

});


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

//=========================================
//  HELPER FUNCTIONS
//=========================================

//Creates and saves a notification, then calls
//pushNotification, which alerts all mobile devices
function saveAndPushNotification(notificationData) {
    var passPhrase = "";
    var query = new Parse.Query(Parse.User);
    return query.get(notificationData.userId).

        then(function (user) {
            var username = user.attributes.username;
            passPhrase = util.passwordGenerator.generatePassword(username);

            var notification = new PushNotification();
            notification.set("userId", notificationData.userId);
            notification.set("tipId", notificationData.controlNumber);

            notification.set('title', {
                __type: "Bytes",
                base64: util.encryptionManager.encrypt(passPhrase, notificationData.title)
            });

            notification.set('message', {
                __type: "Bytes",
                base64: util.encryptionManager.encrypt(passPhrase, notificationData.message)
            });

            if (notificationData.attachment) {
                var encryptedFile = util.encryptionManager.encrypt(passPhrase, notificationData.attachment);
                var attachment = new Parse.File('file', {base64: encryptedFile});
                notification.set(notificationData.attachmentType, attachment);
            }

            return notification.save();
        }).

        then(function (notification) {
            return pushNotification(notification);
        }, function (error) {
            var err = error;
        });
}

//Sends the already saved notification to the user; if pushing
//failed, tries to revert save or continues as partial success
function pushNotification(notification) {
    var pushChannels = ['user_' + notification.attributes.userId];
    return Parse.Push.send({
        channels: pushChannels,
        data: {
            alert: "New Follow-up Notification Available",
            badge: "Increment",
            sound: "cheering.caf",
            title: "Notification",
            pushId: notification.id,
            type: "follow-up"
        }
    });
};

//Adds a new officer/user to SentiHelm
function addNewOfficer(officerData, clientId) {
    //Generate passphrase for encryption
    var passPhrase = "";
    passPhrase = util.passwordGenerator.generatePassword(officerData.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = util.encryptionManager.encrypt(passPhrase, officerData.fname);
    var encryptedLastName = util.encryptionManager.encrypt(passPhrase, officerData.lname);
    var hashedPassword = util.passwordGenerator.md5(officerData.password);
    var encryptedPhoneNumber = util.encryptionManager.encrypt(passPhrase, officerData.phoneNumber);
    var encryptedZipCode = util.encryptionManager.encrypt(passPhrase, officerData.zipCode.toString());
    var encryptedState = util.encryptionManager.encrypt(passPhrase, officerData.state);

    //Create new officer
    var officer = new Parse.User();
    officer.set('firstName', {
        __type: "Bytes",
        base64: encryptedFirstName
    });
    officer.set('lastName', {
        __type: "Bytes",
        base64: encryptedLastName
    });
    officer.set('phoneNumber', {
        __type: 'Bytes',
        base64: encryptedPhoneNumber
    });
    officer.set('zipCode', {
        __type: 'Bytes',
        base64: encryptedZipCode
    });
    officer.set('state', {
        __type: 'Bytes',
        base64: encryptedState
    });

    // officer.set('firstName', encryptedFirstName);
    officer.set('email', officerData.email);
    officer.set('username', officerData.username);
    officer.set('password', officerData.password);
    officer.set('userPassword', hashedPassword);
    officer.set('roles', [officerData.role]);
    officer.set('homeClient', {
        __type: "Pointer",
        className: "Client",
        objectId: clientId
    });

    //Save/Signup new officer
    return officer.signUp();
}

//Save edited user
function saveUser(editedUser) {

    //Generate passphrase for encryption
    var passPhrase = "";
    passPhrase = util.passwordGenerator.generatePassword(editedUser.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = util.encryptionManager.encrypt(passPhrase, editedUser.firstName);
    var encryptedLastName = util.encryptionManager.encrypt(passPhrase, editedUser.lastName);
    var email = editedUser.email;

    // var hashedPassword = util.passwordGenerator.md5(officerData.password);

    // var ParseUser = new Parse.Query(User);
    var user = Parse.User.current();
    if (!user) {
        return {
            then: function (success, error) {
                "use strict";
                error(user, Error("user-session-timeout"));
            }
        };
    }

    user.set('firstName', {
        __type: "Bytes",
        base64: encryptedFirstName
    });
    user.set('lastName', {
        __type: "Bytes",
        base64: encryptedLastName
    });
    user.set('email', email);
    // officer.set('userPassword', hashedPassword);
    // officer.set('roles', [officerData.role]);
    return user.save();
}

//Save/change user password
function saveUserPassword(data) {

    var user = Parse.User.current();
    if (!user) {
        return {
            then: function (success, error) {
                "use strict";
                error(user, Error('user-session-timeout'));
            }
        };
    }

    var prevPass = data.prevPass;
    var newPass = data.newPass;
    var confirmPass = data.confirmPass;


    //Change pass
    if (util.passwordGenerator.md5(prevPass) === user.attributes.userPassword) {

        //Throw pass incorrect
        user.set("password", newPass);
        user.set("userPassword", util.passwordGenerator.md5(newPass));
        return user.save();
    }
    else {
        //Incorrect password
        io.sockets.emit('save-user-password-failed');
        return {
            then: function (s, e) {
                "use strict";
                e(user, Error('save-user-password-failed'));
            }
        }
    }
};


function analyzeData(data) {
    var clientId = data.clientId;
    var month = data.month;
    var year = data.year;
    var isMonthSelected = !isNaN(month);

    //If not month was provided, set month to January
    if (!isMonthSelected) {
        month = 0;
    }
    //Make sure the values are integers
    else if (typeof month == 'string' || month instanceof String) {
        month = parseInt(month);
    }
    if (typeof year == 'string' || year instanceof String) {
        year = parseInt(year);
    }

    //Create query
    var tipQuery = new Parse.Query(TipReport);
    //Filter by clientId
    tipQuery.equalTo('clientId', {
        __type: "Pointer",
        className: "Client",
        objectId: clientId
    });
    tipQuery.limit(1000);
    if (!isMonthSelected) {
        tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
        tipQuery.lessThanOrEqualTo("createdAt", new Date(year + 1, month));
    }
    else {
        tipQuery.greaterThanOrEqualTo("createdAt", new Date(year, month));
        // If month is 11(December), upper bound will be january 1 of the next year
        tipQuery.lessThanOrEqualTo("createdAt", new Date(month !== 11 ? year : year + 1, (month + 1) % 12));
    }
    return tipQuery.find();

}

//Create the charts. If month is defined, create the LineChart with the days of
//the month.
function getChartsData(tips, month, year) {

    //   var data = google.visualization.arrayToDataTable([
    //   ['Year', 'Sales', 'Expenses'],
    //   ['2004',  1000,      400],
    //   ['2005',  1170,      460],
    //   ['2006',  660,       1120],
    //   ['2007',  1030,      540]
    // ]);

    var crimeTypes = ["Assault", "Child Abuse", "Elderly Abuse", "Domestic Violence", "Drugs", "Homicide", "Animal Abuse",
        "Robbery", "Sex Offenses", "Bullying", "Police Misconduct", "Bribery", "Vehicle Theft", "Vandalism",
        "Auto Accident", "Civil Rights", "Arson", "Other"];

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"];

    var tipsTypeChart = {};
    var tipsDateChart = {};

    //Initialize # of Tips vs CrimeType chart
    tipsTypeChart.type = 'PieChart';
    tipsTypeChart.options = {
        'title': 'Tip Count vs Crime Type'
    };
    tipsTypeChart.data = {
        "cols": [
            {id: "t", label: "Crime Type", type: "string"},
            {id: "s", label: "Tip Count", type: "number"}
        ],
        "rows": []
    };
    tipsTypeChart.dataArray = [];
    for (var i = 0; i < crimeTypes.length; i++) {
        tipsTypeChart.data.rows.push({
            c: [
                {v: crimeTypes[i]},
                {v: 0}
            ]
        });
        tipsTypeChart.dataArray.push({a: crimeTypes[i], b: 0});
    }

    //Create column chart with months of the year
    if (isNaN(month)) {
        //Initialize # of Tips vs Date chart
        tipsDateChart.type = 'ColumnChart';
        tipsDateChart.options = {
            'title': 'Tip Count vs Month'
        };
        tipsDateChart.data = {
            "cols": [
                {id: "t", label: "Month", type: "string"},
                {id: "s", label: "Tip Count", type: "number"}
            ],
            "rows": []
        };
        tipsDateChart.dataArray = [];
        for (var i = 0; i < months.length; i++) {
            tipsDateChart.data.rows.push({
                c: [
                    {v: months[i]},
                    {v: 0}
                ]
            });
            tipsDateChart.dataArray.push({a: months[i], b: 0});
        }
    }
    //Create line chart with days of month
    else {
        //Initialize # of Tips vs Date chart
        tipsDateChart.type = 'LineChart';
        tipsDateChart.options = {
            title: 'Tip Count vs Date (UTC Time)'
        };
        tipsDateChart.data = {
            "cols": [
                {id: "t", label: "Date", type: "string"},
                {id: "s", label: "Tip Count", type: "number"}
            ],
            "rows": []
        };
        tipsDateChart.dataArray = [];

        var tempDate = new Date(year, month);
        while (tempDate.getUTCMonth() === month) {
            tipsDateChart.data.rows.push({
                c: [
                    {v: tempDate.getUTCDate()},
                    {v: 0}
                ]
            });
            tipsDateChart.dataArray.push({a: tempDate.getUTCDate(), b: 0});
            tempDate.setDate(tempDate.getUTCDate() + 1);
        }
    }

    //Fill out data for both charts
    for (var i = 0; i < tips.length; i++) {
        var crimePos = tips[i].attributes.crimeListPosition;
        var monthPos = tips[i].createdAt.getUTCMonth();
        var date = tips[i].createdAt.getUTCDate() - 1; //minus 1 to match the position on the array
        tipsTypeChart.data.rows[crimePos].c[1].v++;
        tipsTypeChart.dataArray[crimePos].b++;
        //Feel the column chart.
        if (isNaN(month)) {
            tipsDateChart.data.rows[monthPos].c[1].v++;
            tipsDateChart.dataArray[monthPos].b++;
        }
        else {
            tipsDateChart.data.rows[date].c[1].v++;
            tipsDateChart.dataArray[date].b++;
        }
    }

    return {
        tipsTypeChart: tipsTypeChart,
        tipsDateChart: tipsDateChart
    };
}

//Get all active video streams from Parse
function getActiveVideoStreams(clientId) {

    var VideoSession = Parse.Object.extend("VideoSession");
    var query = new Parse.Query(VideoSession);

    query.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: clientId
    });
    query.containedIn("status", ['pending', 'active']);
    query.include("mobileUser");

    return query.find();
}


module.exports = app;
