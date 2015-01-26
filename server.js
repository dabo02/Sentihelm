//=========================================
//  IMPORTS
//=========================================

//Imports for web server
//Create an express server (app)
//then pass along to http server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var http = require('http');

//Import and initialize socket.io
var io = require('socket.io')(server);

//Other imports
var clc = require('cli-color');
var net = require('net');
var Parse = require('parse').Parse;
var OpenTok = require('opentok');
var MobileClient = require('./lib/mobileclient');
var EncryptionManager = require('./lib/EncryptionManager.js');
var PasswordGenerator = require('./lib/PasswordGenerator.js');

//=========================================
//  ENVIRONMENT SETUP
//=========================================

//Define colors for log
var cyan = clc.cyanBright;
var green = clc.greenBright;
var yellow = clc.yellowBright;
var red = clc.redBright;
var notice = clc.magentaBright;
var maroon = clc.red;

////************************** User Encryption*****************************************/
var APP_ID_2 = "csvQJc5N6LOCQbAnzeBlutmYO0e6juVPwiEcW9Hd";
var JS_KEY_2 = "T9wCcLw0g1OBtlVg0s2gQoGITog5a0p77Pg3CIor";
Parse.initialize(APP_ID_2, JS_KEY_2);

//Set up parse.
//var APP_ID = "Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE";
//var JS_KEY = "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk";
//Parse.initialize(APP_ID, JS_KEY);

//Set up Parse classes for queries
var TipReport = Parse.Object.extend("TipReport");
var Client = Parse.Object.extend("Client");
var User = Parse.Object.extend("User");
var VideoSession = Parse.Object.extend("VideoSession");
var PushNotification = Parse.Object.extend("FollowUpNotifications");

//Generates the password for the encription manager.
var passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
var encryptionManager = new EncryptionManager();

//Set OpenTok key and secret. Create a new opentok object,
//which is used to manage sessions and tokens.
var otKey = '44755992';
var otSecret = '66817543d6b84f279a2f5557065b061875a4871f';
var opentok = new OpenTok(otKey, otSecret);

//Create an non-overriding log file and feed it
//to an express logger with default settings
var logFile = fs.createWriteStream('./logs/express.log', {flag: 'a'});
app.use(morgan({format: 'default', stream: logFile}));

//Attach a bodyParser in order to handle json and urlencoded
//bodies.
app.use(bodyParser());

//Add the static middleware: allows express to serve up
//static content in the specified directory (for CSS/JS).
app.use(express.static(__dirname + '/public'));

//Setup socket.io that communicates with front end
io.on('connect', function (socket) {

    //Front-end requested a new batch of tips;
    //get query data and fetch
    socket.on('request-batch', function (data) {

        //Get filtering values: by clientId, date
        //and tips after or before given date
        var clientId = data.clientId;
        var date = data.lastTipDate ? new Date(data.lastTipDate) : new Date();
        var isAfterDate = data.isAfterDate;
        var filter = data.filter;
        var filterActivated = false;

        //Create query
        var tipQuery = new Parse.Query(TipReport);

        //Filter by clientId
        tipQuery.equalTo('clientId', {
            __type: "Pointer",
            className: "Client",
            objectId: clientId
        });

        //Tell parse to include the user and client objects
        //instead of just passing the pointers.
        tipQuery.include('user');
        tipQuery.include('clientId');

        if (!!data.tipsToSkip) {
            tipQuery.skip(data.tipsToSkip);
        }

        //If filter by crime type if activated
        if (!!filter && !isNaN(filter.crimePosition)) {
            filterActivated = true;
            tipQuery.equalTo("crimeListPosition", filter.crimePosition);
        }

        //If filter by date is activated
        if (!!filter && !!filter.date) {
            filterActivated = true;
            filter.date = new Date(filter.date);
            var dateAfter = new Date(filter.date);
            dateAfter.setDate(dateAfter.getDate() + 1);
            tipQuery.greaterThanOrEqualTo("createdAt", filter.date);
            tipQuery.lessThanOrEqualTo("createdAt", dateAfter);

        }

        //Filter by date (before or after given date)
        isAfterDate ? tipQuery.greaterThan("createdAt", date) :
            tipQuery.lessThan("createdAt", date);

        //If isAfterDate is false, query tips before said date in
        //descending order (newest to oldest, earliest date first);
        //otherwise, query tips after date in ascending order, but
        //reverse final results array or tips will be incorrectly
        //displayed from oldest to newest (tips in page 1 will be tips
        //corresponding to page 10, and vice versa)
        if (!isAfterDate) {
            tipQuery.descending("createdAt");
        }
        else {
            tipQuery.ascending("createdAt");
        }

        //If filter is not activated, limit the query to 10 and get the totalTipCount
        //from the Client parse object on one of the received tips. If filter is activated
        //get the totalTipCount from the number of tips received from parse.
        if (!filterActivated) {
            tipQuery.limit(10);
        }
        else {
            tipQuery.limit(1000);
        }

        //Execute query
        tipQuery.find({
            success: function (tips) {

                //Get the total tip count if filter is activated
                if (filterActivated) {
                    totalTips = tips.length;
                    if (totalTips > 10) {
                        tips = tips.slice(0, 10)
                    }
                }

                //Reverse the array if the tips are in ascending
                //order(oldest to newest)
                if (isAfterDate) {
                    tips.reverse();
                }

                var start = new Date().getTime();
                //Loop over the array to prepare the tip objects
                //for the front end
                for (var i = 0; i < tips.length; i++) {

                    //Get the user from the tip. This works
                    //because we are using tipQuery.include('user').
                    //It doesn't need to reconnect to the database
                    //to retreive the user that submitted the tip.
                    var tipUser = tips[i].get('user')

                    if (!tips[i].attributes.smsId) {
                        var passPhrase = passwordGenerator.generatePassword((!!tipUser ? tipUser.attributes.username : tips[i].attributes.anonymousPassword), !tipUser);
                    }
                    else {
                        var passPhrase = passwordGenerator.generatePassword(tips[i].attributes.smsId);
                    }

                    //Get the client object from the first tip to be
                    //able to get the total tip count later on (all
                    //tips have the same client).
                    if (i === 0 && !filterActivated) {
                        totalTips = tips[i].get('clientId').attributes.totalTipCount;
                    }
                    //Convert tip from Parse to Javascript object
                    tips[i] = JSON.parse(JSON.stringify(tips[i]));
                    //If not an anonymous tip, get user information
                    if (!!tipUser) {
                        tips[i].firstName = encryptionManager.decrypt(passPhrase, tipUser.attributes.firstName.base64);
                        tips[i].lastName = encryptionManager.decrypt(passPhrase, tipUser.attributes.lastName.base64);
                        tips[i].username = tipUser.attributes.username;
                        tips[i].phone = encryptionManager.decrypt(passPhrase, tipUser.attributes.phoneNumber.base64);
                        tips[i].anonymous = false;
                        tips[i].channel = "user_" + tipUser.id;
                    }
                    else {
                        //Set tip to anonymous if the user was not found
                        tips[i].firstName = "ANONYMOUS";
                        tips[i].lastName = "";
                        tips[i].anonymous = true;
                    }

                    //Prepare tip object with the values needed in
                    //the front end; coordinates for map, tip control
                    //number, and formatted date
                    tips[i].center = {
                        latitude: encryptionManager.decrypt(passPhrase, tips[i].crimePositionLatitude.base64),
                        longitude: encryptionManager.decrypt(passPhrase, tips[i].crimePositionLongitude.base64)
                    };
                    tips[i].controlNumber = tips[i].objectId + "-" + tips[i].controlNumber;
                    var tempDate = (new Date(tips[i].createdAt));
                    tempDate = tempDate.toDateString() + ' - ' + tempDate.toLocaleTimeString();
                    tips[i].date = tempDate;
                    tips[i].crimeDescription = tips[i].crimeDescription ? encryptionManager.decrypt(passPhrase, tips[i].crimeDescription.base64) : "";
                    tips[i].crimeType = encryptionManager.decrypt(passPhrase, tips[i].crimeType.base64);
                    tips[i].crimeListPosition = tips[i].crimeListPosition;
                    tips[i].markers = [{
                        id: tips[i].objectId,
                        latitude: tips[i].center.latitude,
                        longitude: tips[i].center.longitude,
                        options: {
                            draggable: false,
                            title: "Crime Location",
                            visible: true
                        }
                    }];

                    if (tips[i].smsNumber) {
                        tips[i].phone = encryptionManager.decrypt(passPhrase, tips[i].smsNumber.base64);
                    }
                }

                //Send the tips to the front end
                socket.emit('response-batch', {tips: tips, totalTipCount: totalTips});
            },
            error: function (error) {
                //Tip fetching failed, emit response error
                //along with error object
                socket.emit('response-error', {error: error});
            }
        });

    });

    socket.on('request-media-url', function (data) {

        //Get parseFile
        var parseFile = data.parseFile;
        //Generate password for decryption
        var passPhrase = passwordGenerator.generatePassword(data.passPhrase, data.anonymous);

        var url = parseFile.url;
        var filepath = parseFile.name;

        //Download file to server
        var file = fs.createWriteStream(filepath);
        var request = http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                //File finished downloading. Read file.
                fs.readFile(filepath, function (err, dataBuf) {

                    //Select the correct extension depending on file type.
                    if (data.type === 'IMG') {
                        filepath = '/temp/file.jpg';
                    }
                    else if (data.type === 'VID') {
                        filepath = '/temp/file.mpg4';
                    }
                    else {
                        filepath = '/temp/file.aac';
                    }

                    //Convert to base64 and decrypt.
                    var fileB64 = dataBuf.toString('base64');
                    var decrypt = encryptionManager.decrypt(passPhrase, fileB64);

                    //Create buffer and write the decrypted file.
                    var decodedFile = new Buffer(decrypt, 'base64');
                    fs.writeFile('./public' + filepath, decodedFile, function (err) {
                        //Delete the downloaded and encrypted file.
                        fs.unlinkSync(parseFile.name);
                    });

                    //Send file url to front-end
                    socket.emit('response-media-url', filepath);
                });
            });
        });
    });

    //Encrypt and send follow-up.
    socket.on('new-follow-up-notif', function (data) {
        saveAndPushNotification(data.notificationData);
    });

    //Add a new officer to Sentihelm
    socket.on('add-new-officer', function (data) {
        var officer = data.newOfficer;
        var clientId = data.clientId;
        addNewOfficer(officer, clientId);
    });

    //Save user to Sentihelm
    socket.on('save-user', function (data) {
        var user = data.user;
        saveUser(user);
    });

    //Save password to Sentihelm
    socket.on('save-user-password', function (data) {
        saveUserPassword(data);
    });

    //Save user to Sentihelm
    socket.on('reset-password', function (data) {
        resetPassword(data.email);
    });

    //Download data from parse and organize it.
    socket.on('analyze-data', function (data) {
        analyzeData(data);
    });

    //Check for active streams on the VideoSession table on parse.
    socket.on('get-active-streams', function (clientId) {
        getActiveVideoStreams(clientId);
    });

});

//=========================================
//  SET UP ROUTING
//=========================================

//Login handler
app.post('/login', function (request, response) {
    //TODO Sanitize user input
    var userId = request.body.userId;
    var password = request.body.password;
    Parse.User.logIn(userId, password, {
        success: function (user) {

            //Update userPassword column on Parse
            user.set("userPassword", passwordGenerator.md5(password));
            user.save(null, {
                success: function (user) {
                    // Execute any logic that should take place after the object is saved.
                },
                error: function (user, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                }
            });

            //Get Client to which user belongs to
            var clientQuery = new Parse.Query(Client);
            clientQuery.include("regions");
            clientQuery.include("mostWantedList");
            clientQuery.get(user.attributes.homeClient.id, {
                success: function (client) {

                    var answer = [];

                    var passPhrase = passwordGenerator.generatePassword(user.attributes.username);
                    user.attributes.firstName = encryptionManager.decrypt(passPhrase, user.attributes.firstName.base64);
                    user.attributes.lastName = encryptionManager.decrypt(passPhrase, user.attributes.lastName.base64);

                    answer.push(user);
                    answer.push(client);
                    answer.push(client.get('regions'));
                    response.send(200, answer);
                },
                error: function (object, error) {
                    response.send(400, error);
                }
            });
        },
        error: function (user, error) {
            response.send(400, error);
        }
    });
});

//Recieve new-tip event form Parse,
//and pass it along to front-end
app.post('/new-tip', function (request, response) {
    var tip = request.body;
    var pass = tip.pass;
    var clientId = tip.clientId;
    if (pass == 'hzrhQG(qv%qEf$Fx8C^CSb*msCmnGW8@') {
        io.sockets.emit('new-tip', {
            tip: tip,
            clientId: clientId
        });
        response.send(200);
    }
});

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
            io.sockets.emit('new-video-stream', {stream: stream});

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

//Landing/login page
app.get('/', function (request, response) {
    response.sendfile(__dirname + '/public/index.html');
});

//Base-case where page was not found, send 404 error
app.get('*', function (request, response) {
    response.send(404, "Error 404: Not Found");
});

//=========================================
//  START WEB SERVER
//=========================================

//Start the server by listening in on a port.
//process.env.PORT is the default port environment,
//in this case used for AWS; port 80 is for local
//testing purposes. Log listening port.

server.listen((process.env.PORT || 80), function () {
    ;
    console.log(notice('WEB SERVER RUNNING ON PORT %s\n'), server.address().port)
});

//=========================================
//  HELPER FUNCTIONS
//=========================================

//Creates and saves a notification, then calls 
//pushNotification, which alerts all mobile devices
function saveAndPushNotification(notificationData) {
    var passPhrase = "";
    var query = new Parse.Query(Parse.User);
    query.get(notificationData.userId).

        then(function (user) {
            var username = user.attributes.username;
            passPhrase = passwordGenerator.generatePassword(username);

            var notification = new PushNotification();
            notification.set("userId", notificationData.userId);
            notification.set("tipId", notificationData.controlNumber);

            notification.set('title', {
                __type: "Bytes",
                base64: encryptionManager.encrypt(passPhrase, notificationData.title)
            });

            notification.set('message', {
                __type: "Bytes",
                base64: encryptionManager.encrypt(passPhrase, notificationData.message)
            });

            if (notificationData.attachment) {
                var encryptedFile = encryptionManager.encrypt(passPhrase, notificationData.attachment);
                var attachment = new Parse.File('file', {base64: encryptedFile});
                notification.set(notificationData.attachmentType, attachment);
            }

            return notification.save();
        }).

        then(function (notification) {
            return pushNotification(notification);
        }, function (error) {
            var err = error;
        }).

        then(function () {
            io.sockets.emit('follow-up-notif-sent');
        }, function (error) {
            var err = error;
        });
};

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
    passPhrase = passwordGenerator.generatePassword(officerData.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = encryptionManager.encrypt(passPhrase, officerData.fname);
    var encryptedLastName = encryptionManager.encrypt(passPhrase, officerData.lname);
    var hashedPassword = passwordGenerator.md5(officerData.password);

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
    officer.signUp().then(function (newOfficer) {
        //Successfuly added; alert front-end
        io.sockets.emit('new-officer-added');
    }, function (error) {
        //Failed adding officer; alert front-end
        io.sockets.emit('new-officer-failed', {error: error});
    });
};

//Save edited user
function saveUser(editedUser) {

    //Generate passphrase for encryption
    var passPhrase = "";
    passPhrase = passwordGenerator.generatePassword(editedUser.username);

    //Encrypted/Hashed Values
    var encryptedFirstName = encryptionManager.encrypt(passPhrase, editedUser.firstName);
    var encryptedLastName = encryptionManager.encrypt(passPhrase, editedUser.lastName);
    var email = editedUser.email;

    // var hashedPassword = passwordGenerator.md5(officerData.password);

    // var ParseUser = new Parse.Query(User);
    var user = Parse.User.current();
    if (!user) {
        io.sockets.emit('user-session-timeout');
        return;
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
    user.save(null, {
        success: function (user) {
            // Execute any logic that should take place after the object is saved.
            io.sockets.emit('save-user-success');
        },
        error: function (user, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            io.sockets.emit('save-user-failed');
        }
    });
};

//Save/change user password
function saveUserPassword(data) {

    var user = Parse.User.current();
    if (!user) {
        io.sockets.emit('user-session-timeout');
        return;
    }

    var prevPass = data.prevPass;
    var newPass = data.newPass;
    var confirmPass = data.confirmPass;


    //Change pass
    if (passwordGenerator.md5(prevPass) === user.attributes.userPassword) {

        //Throw pass incorrect
        user.set("password", newPass);
        user.set("userPassword", passwordGenerator.md5(newPass));
        user.save(null, {
            success: function (user) {
                // Execute any logic that should take place after the object is saved.
                io.sockets.emit('save-user-password-success');
            },
            error: function (user, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                io.sockets.emit('save-user-password-failed');
            }
        });
    }
    else {
        //Incorrect password
        io.sockets.emit('save-user-password-failed');

    }
};

//Reset password using Parse website
function resetPassword(email) {
    Parse.User.requestPasswordReset(email, {
        success: function () {
            // Password reset request was sent successfully
            io.sockets.emit('reset-password-success');
        },
        error: function (error) {
            // Show the error message somewhere
            io.sockets.emit('reset-password-failed');
        }
    });
}

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
    tipQuery.find({
        success: function (tips) {
            var charts = {};
            charts.tipCount = tips.length;

            if (isMonthSelected) {
                charts = getChartsData(tips, month, year);
            }
            else {
                charts = getChartsData(tips);
            }

            io.sockets.emit('analyze-data-response', charts);
        },
        error: function (error) {
            io.sockets.emit('analyze-data-error', error);
        }
    });

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

    query.find().then(function (results) {
        //Format each result for front-end
        //keep them in modifiedStreams array
        var modifiedStreams = [];
        for (var i = 0; i < results.length; i++) {

            var streamUser = results[i].attributes.mobileUser;
            var passPhrase = passwordGenerator.generatePassword(streamUser.attributes.username, false);

            //Create a new strem and copy over values
            //from current stream in results
            var newStream = {};
            newStream.connectionId = results[i].id;
            newStream.sessionId = results[i].attributes.sessionId;
            newStream.webClientToken = results[i].attributes.webClientToken;
            newStream.latitude = results[i].attributes.latitude;
            newStream.longitude = results[i].attributes.longitude;
            newStream.currentCliendId = results[i].attributes.client.id;
            newStream.userObjectId = results[i].attributes.mobileUser.id;
            newStream.firstName = encryptionManager.decrypt(passPhrase, streamUser.attributes.firstName.base64);
            newStream.lastName = encryptionManager.decrypt(passPhrase, streamUser.attributes.lastName.base64);
            newStream.email = streamUser.attributes.email;
            newStream.phone = encryptionManager.decrypt(passPhrase, streamUser.attributes.phoneNumber.base64);

            //Add modified stream to collection
            modifiedStreams.push(newStream);
        }
        //Send modified results to controller
        io.sockets.emit('get-active-streams-response', modifiedStreams);
    }, function (error) {
        //TODO
        //Manage error when couldn't fetch active video streams
        var err = error;
    });
}