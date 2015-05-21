(function () {
    'use strict';
    var app = angular.module('sentihelm', ['ngSanitize', 'ui.router', 'btford.socket-io', 'google-maps'.ns(), 'ngDialog', 'angularFileUpload', 'angularSpinner', 'snap', 'naif.base64', 'googlechart', 'ui.sortable', 'ngCsv', 'ngToast', 'ngAudio']);

    //Sets up all the states/routes the app will handle,
    //so as to have a one page app with deep-linking
    app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', '$sceDelegateProvider', function ($stateProvider, $urlRouterProvider, USER_ROLES, $sceDelegateProvider) {

		//$sceDelegateProvider.resourceUrlWhitelist(['self', 'https://s3.amazonaws.com/stream-archive/44755992/**']);
		$sceDelegateProvider.resourceUrlWhitelist(['self', 'https://stream-archive.s3.amazonaws.com/44755992/**']);

        // For any unmatched url, redirect to /tipfeed
        $urlRouterProvider.otherwise("/tipfeed");

        $stateProvider

            //Profile pagel endpoint/url
            .state('profile', {
                url: "/profile",
                templateUrl: "/profile.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Profile");
                    }
                }
            })

            //Tipfeed endpoint/url
            .state('tipfeed', {
                url: "/tipfeed",
                templateUrl: "/tipfeed.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Tip Feed");
                    }
                }
            })

            //Video Streams endpoint/url
            .state('video-streams', {
                url: "/video-streams",
                templateUrl: "/video-streams.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Video Streams");
                    }
                }
            })

            //Regional notifications endpoint/url
            .state('regional-notifications', {
                url: "/regional-notifications",
                templateUrl: "/regional-notifications.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Send Notification");
                    }
                }
            })

            //Maps endpoint/url
            .state('maps', {
                url: "/maps",
                templateUrl: "/maps.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Maps");
                    }
                }
            })

            //Most Wanted List endoint/url
            .state('most-wanted', {
                url: "/most-wanted",
                templateUrl: "/most-wanted.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Wanted List");
                    }
                }
            })

            //Most Wanted List endoint/url
            .state('data-analysis', {
                url: "/data-analysis",
                templateUrl: "/data-analysis.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Data Analysis");
                    }
                }
            })

            //Admin-panel endpoint/url
            .state('admin-panel', {
                url: "/admin-panel",
                templateUrl: "/admin-panel.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Administrator Panel");
                    }
                }
            })

            //video-archive endpoint/url
            .state('video-archive', {
                url: "/video-archive",
                templateUrl: "/video-archive.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
                },
                resolve: {
                    // Reads the Routing Service
                    routingService: 'RoutingService',

                    // Receives the Routing Service, checks if user is logged in,
                    // executes the login dialog if needed and waits for the dialog
                    // to close before loading the state.
                    authenticate: function (routingService) {
                        return routingService.checkUserStatus(this.data.authorizedRoles, "Video Archive");
                    }
                }
            });
    }]);

    //Sets up the options for snapRemote, which is
    //the snap.js instance that allows for a slidable
    //drawer
    app.config(['snapRemoteProvider', function (snapRemoteProvider) {
        snapRemoteProvider.globalOptions = {
            disable: 'right',
            touchToDrag: false
        };
    }]);

    app.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
        GoogleMapApi.configure({
            //    key: 'your api key',
            v: '3.16',
            libraries: 'places'
        });
    }]);

    app.config(['$httpProvider', function ($httpProvider) {
        // Session interceptor, checks if the server responded with a 401 and prompts the user to log-in.
        $httpProvider.interceptors.push(['$q', '$window', function ($q, $window) {
            return {
                responseError: function (response) {
                    // if the status matches an 401 (unauthorized) status
                    // response, make the user login again.
                    if (response.status == 401) {
                        // can't use Session service because of circular dependency with $http.
                        // so we destroy the session manually.
                        delete $window.sessionStorage['session'];
                        $window.location.reload();
                    }

                    return $q.reject(response);

                }
            };
        }]);
    }]);

    //Initialize values needed throughout the app
    app.run(function () {
        //Initialize Parse
        //Parse.initialize("csvQJc5N6LOCQbAnzeBlutmYO0e6juVPwiEcW9Hd", "T9wCcLw0g1OBtlVg0s2gQoGITog5a0p77Pg3CIor");
        Parse.initialize("ppejTan0nxzC495cG2et1zIlHfkiHGc9ONUYCkNL", "oC7TEezvGdh3FTZJneATR23UN47E9uAO7rzstK6A");
    });

    //Autorhization events for log in functionality
  app.constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    //User roles for authorization/authentication and
    //content control
    app.constant('USER_ROLES', {
        all: '*',
        demo: 'demo',
        user: 'manager',
        admin: 'admin'
    });

    //All errors are contained in this constant;
    //used with errorFactory service for easy error
    //alerting
    app.constant('ERRORS', {
        'LOGIN-101': {
            title: 'Invalid Login Parameters',
            message: 'The email or password you entered is incorrect',
            code: 'LOGIN-101',
            onClose: function () {
                document.getElementById("login-dialog-username").focus();
            }
        },
        'LOGIN-NO-USERID': {
            title: 'No UserId',
            message: 'You must provide a login ID',
            code: 'LOGIN-NO-USERID',
            onClose: function () {
                document.getElementById("login-dialog-username").focus();
            }
        },
        'LOGIN-NO-PASS': {
            title: 'No Password',
            message: 'You must provide a password',
            code: 'LOGIN-NO-PASS',
            onClose: function () {
                document.getElementById("login-dialog-password").focus();
            }
        },
        'NOTIF-FAILED': {
            title: 'Push Notification Failed',
            message: 'The notification could not be sent. ' +
            'Please try again in a while. If the ' +
            'error persists, contact the tech team.',
            code: 'NOTIF-FAILED',
            onClose: function () {
                //Do nothing

            }
        },
        'NOTIF-NO-MESSAGE': {
            title: 'No Content',
            message: 'The notification must contain a message.',
            code: 'NOTIF-NO-MESSAGE',
            onClose: function () {
                document.getElementById("notification-message").focus();
            }
        },
        'SMS-NO-MESSAGE': {
            title: 'No Content',
            message: 'The must contain a message.',
            code: 'SMS-NO-MESSAGE',
            onClose: function () {
                document.getElementById("notification-message").focus();
            }
        },
        'NOTIF-NO-TITLE': {
            title: 'No Title',
            message: 'The notification must have a title.',
            code: 'NOTIF-NO-TITLE',
            onClose: function () {
                document.getElementById("notification-title").focus();
            }
        },
        'REGIONAL-NOTIF-NO-MESSAGE': {
            title: 'No Content',
            message: 'The notification must contain a message.',
            code: 'REGIONAL-NOTIF-NO-MESSAGE',
            onClose: function () {
                document.getElementById("regional-notification-body").focus();
            }
        },
        'REGIONAL-NOTIF-NO-TITLE': {
            title: 'No Title',
            message: 'The notification must have a title.',
            code: 'REGIONAL-NOTIF-NO-TITLE',
            onClose: function () {
                document.getElementById("regional-notification-title").focus();
            }
        },
        'REGIONAL-NOTIF-NO-REGION': {
            title: 'No Regions Selected',
            message: 'You must select at least one region',
            code: 'REGIONAL-NOTIF-NO-REGION',
            onClose: function () {
                //Do nothing

            }
        },
        'NO-SESSION': {
            title: 'You Are Not Logged In',
            message: 'You need to log in order to use the dashboard.',
            code: 'NO-SESSION',
            onClose: function () {
                //Do nothing

            }
        },
        'NO-AUTH': {
            title: 'You do Not Have Access to This Page',
            message: 'Your access level does not allow you to view this page. ' +
            'If you believe this is an error, contact your dashboard administrator.',
            code: 'NO-AUTH',
            onClose: function () {
                //Do nothing

            }
        },
        'MOST-WANTED-NO-NAME': {
            title: 'No Name Provided',
            message: 'The name field cannot be empty.',
            code: 'MOST-WANTED-NO-NAME',
            onClose: function () {
                //Do nothing

            }
        }
    });

    //Creates a routing service which is passed to ui-router
    //to check if user is logged in and/or has access to the
    //current route; returns a Promise
    app.factory("RoutingService", ['USER_ROLES', '$rootScope', 'AUTH_EVENTS', 'authenticator', 'errorFactory', 'ngDialog',
        function (USER_ROLES, $rootScope, AUTH_EVENTS, authenticator, errorFactory, ngDialog) {

            var routingService = {};

            routingService.checkUserStatus = function (authorizedRoles, stateName) {

                //Check if user can access this page/state
                if (!authenticator.isAuthorized(authorizedRoles)) {

                    //Check if user is logged in
                    if (authenticator.isAuthenticated()) {

                        //User does not have access to content
                        //TODO $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        errorFactory.showError('NO-AUTH');

                        //Return a promise rejection so that the state stops from loading
                        return Promise.reject('NO-AUTH');
                    } else {

                        //User is not logged in
                        //TODO $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                        //Present login dialog for user to log in
                        var loginDialog = ngDialog.open({
                            template: '../login-dialog.html',
                            className: 'ngdialog-theme-plain',
                            closeByDocument: false,
                            closeByEscape: false,
                            showClose: false,
                            scope: $rootScope
                        });

                        //TODO Improve the following documentation:
                        //Return the promise of the login dialog so that the resolve can use
                        //this promise and wait until the dialog is closed before loading the
                        //corresponding state
                        return loginDialog.closePromise.then(function () {
                            //User is now logged in, check for authorization
                            if (!authenticator.isAuthorized(authorizedRoles)) {

                                //User does not have access to content
                                // $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                                errorFactory.showError('NO-AUTH');

                                // Return a promise rejection so that the state stops from loading
                                //TODO Change reject String
                                return Promise.reject("Recently logged in user is not authorized");
                            }

                            //Resolve the promise, proceed to load
                            //the state and change active state in drawer
                            return Promise.resolve("Recently logged in user is authorized to view the page.");
                        });
                    }
                }

                //Resolve the promise, proceed to load
                //the state and change active state in drawer
                return Promise.resolve("User is already logged in and authorized to view the page");
            };

            return routingService;
        }
    ]);

    //Creates a session service that can create
    //and destroy a session which manages (logged in) users
    app.factory('Session', ['$window', '$rootScope', 'AUTH_EVENTS', '$http', function ($window, $rootScope, AUTH_EVENTS, $http) {

        var session = {};

        //Create a session object, along with id, userId and roles
        session.create = function (user, userRoles, client, regions) {
            session.userId = user.objectId;
            session.userRoles = userRoles;
            session.clientId = client.objectId;
            if (client.smsNumber && client.smsNumber.length > 0)
                session.clientPhoneNumber = client.smsNumber[0];

            session.clientLogo = client.logo.url;
            session.regions = regions;
            session.userFullName = user.firstName + " " + user.lastName;
            session.clientAgency = client.agency;
            session.user = user;
            session.client = client;
        };

        //Destroy current session object
        session.destroy = function () {
            session.userId = undefined;
            session.userRoles = undefined;
            session.clientId = undefined;
            session.clientPhoneNumber = undefined;
            session.clientLogo = undefined;
            session.regions = undefined;
            session.userFullName = undefined;
            session.clientAgency = undefined;
            session.user = undefined;
            session.client = undefined;

            //Delete from session window
            $window.sessionStorage.clear();
        };

        session.store = function (user, client) {

            var userObj = {}, property;
            for (property in user) {
                if (user.hasOwnProperty(property)) {
                    userObj[property] = user[property];
                }
            }

            var clientObj = {};
            for (property in client) {
                if (client.hasOwnProperty(property)) {
                    clientObj[property] = client[property];
                }
            }

            var sessionObj = {};
            sessionObj.userId = session.userId;
            sessionObj.userRoles = session.userRoles;
            sessionObj.clientId = session.clientId;
            sessionObj.clientPhoneNumber = session.clientPhoneNumber;
            sessionObj.clientLogo = session.clientLogo;
            sessionObj.regions = session.regions;
            sessionObj.userFullName = session.userFullName;
            sessionObj.clientAgency = session.clientAgency;
            // sessionObj.user = session.user;


            $window.sessionStorage['session'] = JSON.stringify(sessionObj);
            $window.sessionStorage['user'] = JSON.stringify(userObj);
            $window.sessionStorage['client'] = JSON.stringify(clientObj);
        };

        session.restoreSession = function () {
            var storedSession = $window.sessionStorage['session'];
            var storedUser = $window.sessionStorage['user'];
            var storedClient = $window.sessionStorage['client'];

            if (!!storedSession && !!storedUser && !!storedClient) {
                storedSession = JSON.parse(storedSession);
                storedUser = JSON.parse(storedUser);
                storedClient = JSON.parse(storedClient);
                session.userId = storedSession.userId;
                session.userRoles = storedSession.userRoles;
                session.clientId = storedSession.clientId;
                session.clientPhoneNumber = storedSession.clientPhoneNumber;
                session.clientLogo = storedSession.clientLogo;
                session.regions = storedSession.regions;
                session.userFullName = storedSession.userFullName;
                session.clientAgency = storedSession.clientAgency;
                session.user = storedUser;
                session.client = storedClient;

                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, [storedUser, storedClient, session.regions]);
            }
        };

        session.updateUser = function (user) {
            session.userId = user.objectId;
            session.userFullName = user.firstName + " " + user.lastName;
            session.user = user;
            session.store(session.user, session.client);
            $rootScope.$broadcast('update-user', []);
        };

        session.resetPassword = function (email, cb) {
            'use strict';
            //Request tips
            return $http.post('/reset-password', {email: email});
        };

        return session;
    }]);

    //Creates a service that manages login and
    //authentication functionality; manages current session
    app.factory('authenticator', ['$http', 'Session', '$window', 'socket', function ($http, Session, $window, socket) {

        var authenticator = {};

        authenticator.login = function (credentials) {
            return $http.post('/login', credentials);
        };

        authenticator.isAuthenticated = function () {
            Session.restoreSession();
            var isAuth = !!Session.userId;
            //Return true if userId is set; false otherwise

            if (isAuth) {
                // socket.emit('start-session');
            }

            return isAuth;
        };

        authenticator.isAuthorized = function (authorizedRoles) {
            //Get roles; if not an array, make one(for when string is passed)
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            if (this.isAuthenticated()) {
                for (var i = 0; i < Session.userRoles.length; i++) {
                    var role = Session.userRoles[i];
                    if (authorizedRoles.indexOf(role) !== -1) {
                        return true;
                    }
                }
            }

            return false;

            // return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
        };

        socket.on('user-session-timeout', function (data) {
            Session.destroy();
            $window.location.reload();
        });

        return authenticator;
    }]);

    //Creates an injectable socket service that
    //works just like socket.io's client library
    app.factory('socket', function (socketFactory, $location) {
        //var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
        var ioSocket = io.connect($location.host());
        return socketFactory({
            ioSocket: ioSocket
        });
    });

    //Creates an error delivering service that can
    //be called anywhere in the app, be it with
    //pre-made errors fount in ERROR_CODES constant
    //or newly created errors via methods offered
    app.factory('errorFactory', ['ngDialog', function (ngDialog) {

        var errorFactory = {};

        //Denotes if an error is showing on screen
        errorFactory.errorIsActive = false;

        //Not being used; might use in future releases to create
        //on-the-fly errors
        errorFactory.newError = function (title, message, onClose) {
            //Error creation would go here
        };

        //Show pre-made, constant errors with display function
        errorFactory.showError = function (errorCode) {
            if (!errorFactory.errorIsActive) {
                var error = JSON.stringify({
                    errorCode: errorCode
                });
                var errorDialog = ngDialog.open({
                    template: '../error-dialog.html',
                    className: 'ngdialog-error',
                    closeByDocument: false,
                    closeByEscape: false,
                    showClose: false,
                    data: error
                });

                //Note that error is showing on screen
                errorFactory.errorIsActive = true;
            }
        };

        return errorFactory;
    }]);

    //Creates a notification service that constructs
    //Parse notifications and provides methods to
    //save and push those notifications, while associating
    //said notification with corresponding tip;
    //can push to different channels
    app.factory('parseNotificationService', ['$rootScope', function ($rootScope) {

        //Needed to save Parse notifications to
        //the PushNotifications class in Parse
        var PushNotification = Parse.Object.extend("PushNotifications");

        var parseNotificationService = {};

        //Array that contains channels where notifications
        //will be sent; emptied once any notification is sent
        parseNotificationService.channels = [];

        //Creates and returns a new Parse Notification from
        //notification data gathered from controller
        parseNotificationService.newFollowUpNotification = function (notificationData) {
            var notification = new PushNotification();
            notification.set("userId", notificationData.userId);
            notification.set("tipId", notificationData.controlNumber);
            notification.set("title", notificationData.title);
            notification.set("message", notificationData.message);
            notification.set("type", 'follow-up');
            notification.set("channels", parseNotificationService.channels);
            if (notificationData.attachment) {
                notification.set(notificationData.attachmentType, notificationData.attachment);
            }
            return notification;
        };

        //Creates and returns a new Parse Notification from
        //notification data gathered from controller
        parseNotificationService.newRegionalNotification = function (notificationData) {
            var notification = new PushNotification();
            notification.set("title", notificationData.title);
            notification.set("message", notificationData.message);
            notification.set("type", 'regional');
            notification.set("channels", parseNotificationService.channels);
            if (notificationData.attachment) {
                notification.set(notificationData.attachmentType, notificationData.attachment);
            }
            return notification;
        };

        //Saves and Pushes the Parse Notification by calling other methods
        //in chain; it first saves the notification, then calls
        //associateNotificationWithTip(), which in turn calls pushNotification();
        //if anything fails, the error is broadcast throughout the app
        parseNotificationService.saveAndPushNotification = function (notification) {
            //Try and save the notification to Parse, for future viewing
            notification.save(null, {
                success: function (notification) {
                    //Notification saved, now push it to channels
                    parseNotificationService.pushNotification(notification);
                },
                error: function (notification, error) {
                    //Notification could not be saved, pass control back to controller
                    //and reset channels
                    if (notification.attributes.type === 'follow-up') {
                        $rootScope.$broadcast('notification-error', [notification, error]);
                    } else {
                        $rootScope.$broadcast('regional-notification-error', [notification, error]);
                    }
                    parseNotificationService.channels = [];
                }
            });
        };

        //Sends the already saved notification to the user; if pushing
        //failed, tries to revert save or continues as partial success
        parseNotificationService.pushNotification = function (notification) {
            //Send notification
            Parse.Push.send({
                channels: parseNotificationService.channels,
                data: {
                    alert: notification.attributes.message,
                    badge: "Increment",
                    sound: "cheering.caf",
                    title: notification.attributes.title,
                    pushId: notification.id,
                    type: "regional"
                }
            }, {
                success: function () {
                    //Push was successful
                    //Reset channels and alert controller
                    parseNotificationService.channels = [];
                    if (notification.attributes.type === 'follow-up') {
                        $rootScope.$broadcast('notification-success', [notification]);
                    } else {
                        $rootScope.$broadcast('regional-notification-success', [notification]);
                    }
                    // $rootScope.$broadcast('notification-success', [notification]);
                },
                error: function (error) {
                    //Push was unsuccessful
                    //Try and nuke notification
                    parseNotificationService.deleteSavedNotification(notification, error);

                    //Reset channels
                    parseNotificationService.channels = [];
                }
            });

        };

        //Delete saved notification; broadcast notification sent error
        //or partial success, depending on if it was deleted or not
        parseNotificationService.deleteSavedNotification = function (notification, passedError) {
            var parentError = passedError;
            notification.destroy({
                success: function (notification) {
                    //Notification was successfully deleted;
                    //Alert the controller to prompt the user
                    //to try again
                    if (notification.attributes.type === 'follow-up') {
                        $rootScope.$broadcast('notification-error', [notification, parentError]);
                    } else {
                        $rootScope.$broadcast('regional-notification-error', [notification, parentError]);
                    }
                },
                error: function (notification, error) {
                    //Failed to delete notification
                    //Do Nothing, but alert controller
                    //to partial success
                    if (notification.attributes.type === 'follow-up') {
                        $rootScope.$broadcast('notification-partial-success', [notification]);
                    } else {
                        $rootScope.$broadcast('regional-notification-partial-success', [notification]);
                    }
                    // $rootScope.$broadcast('notification-partial-success',[notification]);
                }
            });
        };


        /**NOT BEING USED, BUT MIGHT BE IN THE FUTURE IF WE WANT
         TO ASSOCIATE NOTIFICATION WITH TIP BEFORE PUSHING**/

        // //Associates already saved notification by inserting
        // //it into it's corresponding tips followUpNotifications
        // //attribute; if associating failes, tries to delete
        // //notification and alerts controller
        // parseNotificationService.associateNotificationWithTip = function(notification){
        //   var TipReport = Parse.Object.extend("TipReport");
        //
        //   //Get tip id from notification
        //   var tipId = notification.get("tipId");
        //
        //   //Find the tip to which the notification
        //   //will be saved
        //   var tipQuery = new Parse.Query(TipReport);
        //   tipQuery.equalTo("objectId", tipId);
        //   tipQuery.find({
        //     success: function(results){
        //       //Found the tip; append the notification to the array and
        //       //save everything (including notification to it's own table)
        //       var tip = results[0];
        //       tip.add("followUpNotifications", notification);
        //       tip.save(null, {
        //         success: function(tip){
        //           //Successfully saved tip & notification;
        //           //proceed to push notificatino to user
        //           parseNotificationService.pushNotification(notification);
        //         },
        //         error: function(tip, error){
        //           parseNotificationService.deleteSavedNotification(notification, error);
        //           parseNotificationService.channels = [];
        //         }
        //       })
        //     },
        //     error: function(error){
        //       parseNotificationService.deleteSavedNotification(notification, error);
        //       parseNotificationService.channels = [];
        //     }
        //   });
        //
        // };

        return parseNotificationService;
    }]);

    //Creates a paginator service which
    //handles tip-feed pagination and
    //updates tip- feedcontroller accordingly
    app.factory('tipFeedPaginationService', ['socket', '$rootScope', 'Session', function (socket, $rootScope, Session) {

        //Set up the paginator object
        var paginator = {};

        //Catch socket.io event when a batch is sent
        //Let controller know news tips arrived; update
        //amount of total tips in server, last page, first
        //and last tip dates and paginator set
        socket.on('response-batch', function (data) {
            if (!!data.totalTipCount) {
                paginator.tips = data.tips;
                if (paginator.resetTotalTipCount) {
                    paginator.resetTotalTipCount = false;
                    paginator.totalTipCount = data.totalTipCount;
                }
                paginator.lastVideo = Math.max(Math.ceil(paginator.totalTipCount / 10), 1);
                paginator.firstTipDateInArray = data.tips[0].createdAt;
                paginator.lastTipDateInArray = data.tips[data.tips.length - 1].createdAt;
                if (paginator.currentPage === 1) {
                    paginator.pageSetUpdater(paginator.lastVideo, false);
                }
                //        paginator.changePage(paginator.currentPage);
                $rootScope.$broadcast('new-batch', [paginator.tips, paginator.currentPage]);
            } else {
                $rootScope.$broadcast('no-tips');
            }

            $rootScope.$broadcast('hide-spinner');
        });

        //Catch socket.io event when a tip request
        //failed; manage error accordingly with
        //errorFactory service
        socket.on('response-error', function (data) {
            var error = data.error;
            //TODO MANAGE ERROR
        });

        //Called when tipfeed loads, be it on
        //refresh or navigating to it again;
        //initiliazes tip feed for current client
        paginator.initializeFeed = function (filter) {

            //Need references to current and last page,
            //array of number of pages paginator will print
            //and size of said array
            paginator.totalTipCount = 0;
            paginator.currentPage = 1;
            paginator.lastVideo = 1;
            paginator.paginatorSet = [];
            paginator.paginatorSetSize = 0;
            paginator.tips;
            paginator.resetTotalTipCount = true;

            //Request tips
            socket.emit('request-batch', {
                clientId: Session.clientId,
                filter: filter
                // crimePosition: crimePosition,
                // onDate: date
            });
        };

        //Change the page and ask server for tips present in new page;
        //let controller know the page has changed
        paginator.changePage = function (newPage, filter) {

            var isAfterDate = this.currentPage > newPage;

            if (this.currentPage !== newPage) {
                var tipsToSkip = isAfterDate ? (this.currentPage - newPage - 1) * 10 : (newPage - this.currentPage - 1) * 10;
                this.currentPage = newPage;
                socket.emit('request-batch', {
                    clientId: Session.clientId,
                    lastTipDate: isAfterDate ? paginator.firstTipDateInArray : paginator.lastTipDateInArray,
                    isAfterDate: isAfterDate,
                    tipsToSkip: tipsToSkip,
                    filter: filter
                });
                $rootScope.$broadcast('discard-current-tips', []);
            }
        };

        //Change to previous page; update references
        paginator.prevPage = function (filter) {
            --this.currentPage;
            socket.emit('request-batch', {
                clientId: Session.clientId,
                lastTipDate: paginator.firstTipDateInArray,
                isAfterDate: true,
                filter: filter
            });

            //Discard current shown tips and update paginator
            $rootScope.$broadcast('discard-current-tips', []);

            if (this.currentPage % 10 === 0) {
                this.pageSetUpdater(this.lastVideo, true);
            }
        };

        //Change to next page; update references
        paginator.nextPage = function (filter) {
            socket.emit('request-batch', {
                clientId: Session.clientId,
                lastTipDate: paginator.lastTipDateInArray,
                isAfterDate: false,
                filter: filter
            });

            //Discard current shown tips and update paginator
            $rootScope.$broadcast('discard-current-tips', []);
            ++this.currentPage;

            if ((this.currentPage - 1) % 10 === 0) {
                this.pageSetUpdater(this.lastVideo - (this.currentPage - 1), false);
            }
        };

        //Update paginator set (page numbers that will be printed every 10 pages)
        paginator.pageSetUpdater = function (setSizeLimit, previousSet) {

            //If called from prevPage, gotta set starting limit to
            //previous 10 pages, otherwise start at current page
            var setStartValue = previousSet ? this.currentPage - 9 : this.currentPage;
            this.paginatorSet = [];
            this.paginatorSetSize = Math.min(10, setSizeLimit);
            for (var i = 0; i < this.paginatorSetSize; i++) {
                this.paginatorSet.push(setStartValue + i);
            }

            //Let controller know the set has changed
            $rootScope.$broadcast('paginator-set-update', [paginator.paginatorSet, paginator.lastVideo]);
        };

        return paginator;
    }]);

    app.factory('VideoStreamsService', ['socket', '$rootScope', function (socket, $rootScope) {

        var otKey = '44755992';

        var VideoSession = Parse.Object.extend("VideoSession");

        var VideoStreamsService = {};

        VideoStreamsService.currentSession = null;

        var currStream;
        var storedStreams = [];
        var currSubscriber;

        //Used to create a new div inside the video-streams-video
        //div to subscribe the stream to it.
        var createDivElement = function (sessionId) {
            var div = document.createElement('div'),
                node = document.getElementById('video-streams-video');
            div.setAttribute('id', 'video-streams-video-' + sessionId);
            while (node.hasChildNodes()) {
                node.removeChild(node.firstChild);
            }
            node.appendChild(div);
            return div;
        };

        //Get all active video streams from Parse
        VideoStreamsService.getActiveStreams = function (clientId) {

            socket.emit('get-active-streams', clientId);
            socket.on('get-active-streams-response', function (streams) {
                $rootScope.$broadcast('active-streams-fetched', streams);
            });

        };

        //Restore active session if available if()
        VideoStreamsService.checkActiveStream = function () {
            if (!!VideoStreamsService.currentSession) {
                var subscriber = VideoStreamsService.currentSession.subscribe(currStream, createDivElement(VideoStreamsService.currentSession.id), {
                        insertMode: 'replace',
                        height: '400.6',
                        width: '591'
                    },
                    function (error) {
                        if (!!error) {
                            //TODO
                            //Handle error when couldn't subscribe to published streams
                            console.log(error);

                        }
                    });
                currSubscriber = subscriber;
            }
        };

        //Stop current stream
        VideoStreamsService.stopStream = function () {
            if (!!VideoStreamsService.currentSession) {
                VideoStreamsService.currentSession.unsubscribe(currSubscriber);
                // VideoStreamsService.currentSession.forceUnpublish(currStream);
                currStream.destroy();
                // VideoStreamsService.currentSession.destroy();
            }
        };

        //Subscribe to streams in the current session
        VideoStreamsService.subscribeToStream = function (stream, currentUser) {

            //Create OpenTok Session
            var session = OT.initSession(otKey, stream.sessionId);

            //If another session is active, disconnect
            if (!!VideoStreamsService.currentSession) {
                VideoStreamsService.currentSession.unsubscribe(currSubscriber);
            }

            if (session.isConnected()) {

                for (var i = 0; i < storedStreams.length; i++) {
                    var object = storedStreams[i];
                    if (object.session.id == session.id) {
                        currStream = object.stream;
                        break;
                    }
                }

                var subscriber = session.subscribe(currStream, createDivElement(session.id), {
                        insertMode: 'replace',
                        height: '400.6',
                        width: '591'
                    },
                    function (error) {
                        if (!!error) {
                            //TODO
                            //Handle error when couldn't subscribe to published streams
                            console.log(error);

                        }
                    });

                currSubscriber = subscriber;
            }

            //Set up callback that handles mobileUser's streams
            session.on("streamCreated", function (event) {

                storedStreams.push({
                    session: session,
                    stream: event.stream
                });

                var subscriber = session.subscribe(event.stream, createDivElement(session.id), {
                        insertMode: 'replace',
                        height: '400.6',
                        width: '591'
                    },
                    function (error) {
                        if (!!error) {
                            //TODO
                            //Handle error when couldn't subscribe to published streams
                            console.log(error);
                            return;
                        }

                        var query = new Parse.Query(VideoSession);
                        query.get(stream.connectionId)
                            .then(function (videoSession) {
                                videoSession.set('hasBeenWatched', true);
                                videoSession.set('officerUser', {
                                    __type: "Pointer",
                                    className: "User",
                                    objectId: currentUser.objectId
                                });
                                return videoSession.save();
                            })
                            .then(function (videoSession) {
                                //Session was upated with officer
                            });

                    });

                currStream = event.stream;
                currSubscriber = subscriber;

            });

            //Set up callback that handles when a mobile user disconnects
            session.on("streamDestroyed", function (event) {

                //Remove stream from storedStreams
                for (var i = 0; i < storedStreams.length; i++) {
                    if (storedStreams[i].stream.id === event.stream.id) {
                        storedStreams[i].session.disconnect();
                        storedStreams.splice(i, 1);
                        break;
                    }
                }

                if (currStream.id === event.stream.id) {
                    currStream = null;
                    currSubscriber = null;
                    VideoStreamsService.currentSession = null;
                }

                $rootScope.$broadcast('stream-destroyed', {
                    sessionId: event.target.sessionId
                });
            });

            //TODO VERIFY
            //Set up callback that handles disconnection
            session.on("sessionDisconnected", function (event) {

                // access to disconnected session: event.target
                //TODO Change broadcast so it manages when video call is
                //changed for another one
                // $rootScope.$broadcast('stream-destroyed', {sessionId:event.target.sessionId});
            });

            //Try and connect to the session
            session.connect(stream.webClientToken, function (error) {
                if (!!error) {
                    //TODO
                    //Handle error when couldn't connect to session
                    return;
                }
                //Save current session
                VideoStreamsService.currentSession = session;


            });
        };

        return VideoStreamsService;
    }]);

    //Service to read uploaded images as url
    app.factory("fileReader", ['$q', '$log', function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var onProgress = function (reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress", {
                    total: event.total,
                    loaded: event.loaded
                });
            };
        };

        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }]);

    //Service for the Maps state. It can save, add
    //or delete police stations from the map.
    app.factory("PoliceStationsService", ['$http', '$q',
        function ($http, $q) {
            var PoliceStationsService = {};

            //Current stations downloaded from Parse
            var stationsMarkers = [];

            //Map info
            PoliceStationsService.map = null;

            //Boolean to know if the user is currently adding a new station.
            PoliceStationsService.isAdding = false;

            //'Hack' to avoid maps error where the marker info wasn't
            //getting updated after editing it. It is a bug in the library.
            PoliceStationsService.redrawMarkers = true;

            //Download stations from Parse. If editedMarkerId is not undefined, the
            //window for the edited marker will be open.
            PoliceStationsService.getStationsMarkers = function (editedMarkerId) {
                if (PoliceStationsService.isAdding) {
                  return $q.when(stationsMarkers);
                } else {
                  return $http.get('/stations/list', {
                    params: {
                      editedMarkerId: editedMarkerId
                      }
                    })
                    .then(function (response) {
                      stationsMarkers = angular.copy(response.data);
                      return stationsMarkers;
                    }, function () {
                      return stationsMarkers;
                    });
                }
            };

            //Return the desired marker contained in the array.
            PoliceStationsService.getMarker = function (id) {
                for (var i = 0; i < stationsMarkers.length; i++) {
                    if (stationsMarkers[i].id === id)
                        return stationsMarkers[i];
                }
            };

            PoliceStationsService.getCenter = function () {
              //Get region center-location from Parse
              return $http.get('/stations/center')
                .then(function (response) {
                  return response.data;
                  });
            };

            //Changes the station info in Parse after user saves the edited station
            PoliceStationsService.updateStationInfo = function (stationInfo) {

              PoliceStationsService.saveStation(stationInfo);
            };

            //Add temporary marker.
            PoliceStationsService.addMarker = function (marker) {
                stationsMarkers.push(marker);
            };

            //Cancels the addition of a new station. Removes the temp marker.
            PoliceStationsService.cancel = function () {
                stationsMarkers.pop();
                PoliceStationsService.isAdding = false;
            };

            //Save new station to Parse or update a station in parse if the
            //station object is not undefined.
            PoliceStationsService.saveStation = function (stationInfo) {
                PoliceStationsService.isAdding = false;

                //If station object isn't received, a new station object is
                // created.

                $http.post('/stations/save', {
                    stationInfo: stationInfo,
                    tempMarker: PoliceStationsService.getTempMarker() })
                  .then(function () {
                    PoliceStationsService.getStationsMarkers();
                  });


            };

            //Return the temp marker.
            PoliceStationsService.getTempMarker = function () {
                return stationsMarkers[stationsMarkers.length - 1];
            };

            //Remove the temp marker and update the map.
            PoliceStationsService.removeTempMarker = function () {
                stationsMarkers.splice(stationsMarkers.length - 1, 1);
            };

            //Delete a station from Parse.
            PoliceStationsService.deleteStation = function (id) {
                $http.delete('/mostwanted/remove/' + id)
                  .then(function () {

                  });
            };

            return PoliceStationsService;
        }
    ]);

    //Creates a Data analysis service which retreives the data from Parse
    //and organizes the data that will be used in the charts.
    app.factory("DataAnalysisService", ['$rootScope', '$http', 'usSpinnerService',
        function ($rootScope, $http, usSpinnerService) {

            var analysisService = {};

            analysisService.requestDataAnalysis = function (year, month) {
                usSpinnerService.spin('analizing-data-spinner');

                //socket.emit('analyze-data', data);

                $http.get('/analyze', {
                  params: {
                    month: month,
                    year: year
                  }
                })
                .then(function onSuccess(response) {
                  var charts = response.data;

                  $rootScope.$broadcast('data-analysis', charts);
                  usSpinnerService.stop('analizing-data-spinner');
                }, function onError(response) {
                  var error = response.data;
                  $rootScope.$broadcast('data-analysis-error', error);
                });
            };

            return analysisService;
        }
    ]);

    //Controller which assigns to its $scope
    //all controls necessary for user management;
    //created at body tag so all other $scopes can
    //inherit from its $scope
    app.controller('ApplicationController', ['usSpinnerService', '$rootScope', '$scope', 'USER_ROLES', 'AUTH_EVENTS', 'authenticator', 'Session',
        function (usSpinnerService, $rootScope, $scope, USER_ROLES, AUTH_EVENTS, authenticator, Session) {
            var controllerScope = $scope;
            $scope.currentUser = null;
            $scope.userRoles = USER_ROLES;
            $scope.isAuthorized = authenticator.isAuthorized;

            //TODO
            $scope.setCurrentUser = function (user) {
                $scope.currentUser = user;
            };

            $scope.setCurrentClient = function (client, regions) {
                $scope.currentClient = client;
                $scope.currentRegions = regions;
            };

            //TODO
            $scope.$on(AUTH_EVENTS.loginSuccess, function (event, data) {
                controllerScope.setCurrentUser(data[0]);
                controllerScope.setCurrentClient(data[1], data[2]);
            });
        }
    ]);

    //Controller for login dialog and login
    //landing page
    app.controller('LoginController', ['$rootScope', '$scope', 'authenticator', 'AUTH_EVENTS', 'Session', 'errorFactory', '$state', 'socket', 'ngDialog',
        function ($rootScope, $scope, authenticator, AUTH_EVENTS, Session, errorFactory, $state, socket, ngDialog) {

            var loginCtrl = this;

            this.resetPasswordAvailable = true;
            this.resetPasswordMessage = "Forgot Password?";

            //Credentials that will be passed to the authenticator service
            this.credentials = {
                userId: '',
                password: ''
            };

            //Boolean for Spinner (loading) CSS
            this.submitting = false;

            //Checks to see if username and password are entered;
            //if not, throws appropiate errors, otherwise
            //proceeds to try and login; if login fails, shows
            //corresponding error
            this.login = function () {

                //No username/id entered, throw error
                if (!this.credentials.userId) {
                    errorFactory.showError('LOGIN-NO-USERID');
                    return;
                }
                //No password entered, throw error
                if (!this.credentials.password) {
                    errorFactory.showError('LOGIN-NO-PASS');
                    return;
                }

                //Trying to log in; show spinner (loading icon)
                this.submitting = true;

                //Try and log in
                authenticator.login(this.credentials).then(
                    function (response) {
                        var user = response.data[0];
                        var client = response.data[1];
                        var regions = response.data[2];
                        //Login was successful, create Session
                        Session.create(user, user.roles, client, regions);
                        // socket.emit('start-session');
                        Session.store(user, client);
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, [user, client, regions]);
                        loginCtrl.submitting = false;
                        $scope.closeThisDialog();

                    },
                    function (error) {
                        //Login failed; //Stop Spinner
                        errorFactory.showError('LOGIN-' + error.data.code);
                        loginCtrl.submitting = false;
                    }
                );
            };

            loginCtrl.showResetPasswordForm = function () {
                loginCtrl.resetPasswordAvailable = false;
            };

            loginCtrl.resetPassword = function () {
                if (!this.resetPasswordAvailable) {
                    loginCtrl.submitting = true;
                    Session.resetPassword(loginCtrl.credentials.email).then(function (data, status) {

                        if (status === 200) {
                            loginCtrl.submitting = false;

                            //Show
                            ngDialog.open({
                                template: '../reset-pass.html',
                                className: 'ngdialog-theme-plain'
                            }).closePromise.then(function () {
                                    loginCtrl.resetPasswordAvailable = true;
                                    //Resolve the promise, proceed to load
                                    //the state and change active state in drawer
                                    return Promise.resolve("");
                                });
                        } else {
                            loginCtrl.submitting = false;
                            loginCtrl.resetPasswordAvailable = true;
                            console.log("Error %s status code", status);
                        }
                    });
                }
            };

            loginCtrl.cancelResetPassword = function () {
                loginCtrl.resetPasswordAvailable = true;
            };

        }
    ]);

    //Controller for the header; contains a button
    //that triggers drawer element when clicked
    app.controller('HeaderController', ['snapRemote', function (snapRemote) {

        //Reveals (opens) the drawer by sliding
        //snap-content (main page view) to the right
        this.openDrawer = function () {
            snapRemote.open("left");
        };

    }]);

    //Controller for the drawer, which hides/shows
    //on button click contains navigation options
    app.controller('DrawerController', ['$scope', '$rootScope', 'snapRemote', '$state', 'socket', 'Session', '$window', 'ngToast', '$sce', 'ngAudio',
        function ($scope, $rootScope, snapRemote, $state, socket, Session, $window, ngToast, $sce, ngAudio) {
            var drawer = this;
            this.newTips = 0;
            this.isAdmin = Session.userRoles.indexOf('admin') === -1 ? false : true;
            this.userFullName = Session.userFullName;
            this.clientAgency = Session.clientAgency;
            drawer.clientLogo = Session.clientLogo;
            drawer.sound = ngAudio.load("resources/sounds/notification-sound.mp3"); // returns NgAudioObject

        //Drawer options with name and icon;
        //entries are off by default
        this.entries = [{
            name: 'Tip Feed',
            icon: 'glyphicon glyphicon-inbox',
            state: 'tipfeed'
        }, {
            name: 'Video Streams',
            icon: 'glyphicon glyphicon-facetime-video',
            state: 'video-streams'
        }, {
            name: 'Video Archive',
            icon: 'glyphicon glyphicon-film',
            state: 'video-archive'
        }, {
            name: 'Send Notification',
            icon: 'glyphicon glyphicon-send',
            state: 'regional-notifications'
        }, {
            name: 'Maps',
            icon: 'glyphicon glyphicon-map-marker',
            state: 'maps'
        }, {
            name: 'Wanted List',
            icon: 'glyphicon glyphicon-list-alt',
            state: 'most-wanted'
        }, {
            name: 'Data Analysis',
            icon: 'glyphicon glyphicon-stats',
            state: 'data-analysis'
        }];

            //Hides (closes) the drawer by sliding
            //snap-content (main page view) back to the left
            this.closeDrawer = function () {
                snapRemote.close();
            };

            //Navigates/changes/reloads view to the corresponding state (page)
            this.changeState = function (state) {
                if (state === "tipfeed") {
                    drawer.newTips = 0;
                }
                $state.go(state, {
                    newTips: 0
                }, {
                    reload: true
                });
            };

            this.logOut = function () {
                Session.destroy();
                $window.location.reload();
            };

            $scope.log = function () {
                console.log('clicked toast.');
            };

            //Increase counter of new tips in the drawer button. Display toast.
            socket.on('new-tip', function (data) {
                if (data.clientId === Session.clientId) {
                    drawer.newTips++;
                    //Open toast
                    ngToast.create({
                        content: 'New tip received.',
                        class: 'info'
                    });
                    drawer.sound.play();
                    $scope.$apply();
                }
            });

            //Display toast for new stream
            socket.on('new-video-stream', function (data) {
                //Open toast.
                ngToast.create({
                    //Create content that uses the ToastController to handle onClicks. Maybe put this on a different file?
                    content: $sce.trustAsHtml('<a ng-controller="ToastController as toastCtrl" class="pointer" ng-click="toastCtrl.goToVideoStreams()">New video stream available.</a>'),
                    class: 'info',
                    dismissOnTimeout: $state.current.name !== 'video-streams' ? false : true,
                    dismissButton: true,
                    compileContent: true,
                    dismissOnClick: false
                });
                drawer.sound.play();
            });
        /*
        //Display toast for succesful archive creation
        socket.on('new-video-archive', function (data) {
            //Open toast.
            ngToast.create({
                //Create content that uses the ToastController to handle onClicks. Maybe put this on a different file?
                content: $sce.trustAsHtml('<a ng-controller="ToastController as toastCtrl" class="pointer" ng-click="toastCtrl.goToVideoArchive()">Video stored in archive successfully.</a>'),
                class: 'success',
                dismissOnTimeout: $state.current.name !== 'video-archive' ? false : true,
                dismissButton: true,
                compileContent: true,
                dismissOnClick: false
            });
            drawer.sound.play();
        });
        */

        $scope.$on('update-user', function (event, data) {
            drawer.userFullName = Session.userFullName;
        });

        $scope.$on('refresh-counter', function (event, data) {
            drawer.newTips = 0;
            $scope.$apply();
        });

    }]);

//Controller for the toast that notifies the user that a
//new video stream is available.
    app.controller('ToastController', ['$scope', '$state', 'ngToast', function ($scope, $state, ngToast) {
        var toastCtrl = this;
        toastCtrl.goToVideoStreams = function () {
            if ($state.current.name !== "video-streams") {
                $state.go("video-streams", {
                    newTips: 0
                }, {
                    reload: true
                });
            }
        };

        toastCtrl.goToVideoArchive = function(){
            if($state.current.name !== 'video-archive'){
                $state.go("video-archive", {}, {reload: true});
            }
        }
    }]);

//Controller for VideStreams route; controls
//the video streams view, which contains queue,
//current video, chat with current mobile client,
//information on current call and all other controls
//to swap video calls
    app.controller('VideoStreamsController', ['$scope', 'socket', 'VideoStreamsService', 'ngToast', '$rootScope', function ($scope, socket, VideoStreamsService, ngToast, $rootScope) {
        var vidStrmCtrl = this;
        this.queue = [];
        this.currentStream = {};

        // clear all toasts:
        ngToast.dismiss();

        VideoStreamsService.getActiveStreams($scope.currentClient.objectId);

        VideoStreamsService.checkActiveStream();

        $scope.$on('active-streams-fetched', function (event, data) {
            vidStrmCtrl.queue = data;
            vidStrmCtrl.currentStream = data[0];
            $scope.$apply();
        });

        socket.on('new-video-stream', function (data) {
            var stream = data.stream;
            vidStrmCtrl.queue.unshift(stream);
//            vidStrmCtrl.currentSessionId = stream.sessionId;
        });

        $scope.$on('stream-destroyed', function (event, data) {
            for (var i = 0; i < vidStrmCtrl.queue.length; i++) {
                var stream = vidStrmCtrl.queue[i];
                if (stream.sessionId === data.sessionId) {
                    $rootScope.$emit('delete-stream', vidStrmCtrl.queue[i].userObjectId);  // to anounce which one got deleted
                    vidStrmCtrl.queue.splice(i, 1);
                    break;
                }
            }
            $scope.$apply();
        });

        // $scope.$on('stream-already-connected', function(event){
        //   $scope.$apply();
        // });

        vidStrmCtrl.activateStream = function (stream) {
            this.currentStream = stream;
            VideoStreamsService.subscribeToStream(stream, $scope.currentUser);
        };

        vidStrmCtrl.stopStream = function () {
            VideoStreamsService.stopStream();
        };

    }]);
//Controller for the tip's attachments; must display
//video and images, and play audio files
    app.controller('AttachmentController', ['$scope', '$rootScope', 'ngDialog', '$sce', 'socket', 'usSpinnerService',
        function ($scope, $rootScope, ngDialog, $sce, socket, usSpinnerService) {
            //Needed so that attachment-dialog.html can open the media files from parse.
            this.trustAsResourceUrl = $sce.trustAsResourceUrl;
            this.address = $scope.$parent.ngDialogData.address;
            this.attachType = $scope.$parent.ngDialogData.attachmentType;
            var thisDialogId = $scope.$parent.attachmentDialog.id;

            //Let TipFeed controller know this dialog turned off
            $scope.$on('ngDialog.closed', function (event, $dialog) {
                if (thisDialogId === $dialog.attr('id')) {
                    $rootScope.$broadcast('attachment-dialog-closed');
                }
            });
        }
    ]);

//Controller for Google map in the maps state;
//sets map center and police station position
//in map
    app.controller('GoogleMapController', function () {

        //This position variables will store the position
        //data so that the tip.center variable remain unchanged.
        var markerPosition = {
            latitude: 0,
            longitude: 0
        };
        var mapCenter = {
            latitude: 0,
            longitude: 0
        };
        var markerKey = 0;
        this.zoom = 14;

        this.icon = {
            url: 'resources/images/custom-marker.png',
            // This marker is 25 pixels wide by 39 pixels tall.
            scaledSize: new google.maps.Size(25, 39),
            // The origin for this image is 0,0.
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole.
            anchor: new google.maps.Point(12.5, 39)
        };

        //Checks if the marker coordinates have changed
        //and returns the correct position.
        this.getMarkerPosition = function (point) {

            if (point === undefined) {
                return markerPosition;
            }
            //Change the position if necessary.
            if (markerPosition.latitude !== point.latitude || markerPosition.longitude !== point.longitude) {
                this.zoom = 14;
                markerPosition.latitude = point.latitude;
                markerPosition.longitude = point.longitude;
            }

            return markerPosition;
        };

        //Checks if the map center coordinates have changed
        // and returns the correct position.
        this.getMapCenter = function (point) {

            if (point === undefined || point.latitude === undefined || point.longitude === undefined) {
                return mapCenter;
            }
            // Change the coords if necessary.
            if (mapCenter.latitude !== point.latitude || mapCenter.longitude !== point.longitude) {
                mapCenter.latitude = point.latitude;
                mapCenter.longitude = point.longitude;
            }

            return mapCenter;
        };

        //TODO  Is this needed?
        this.getMarkerIdKey = function (key, currentPage, index) {
            markerKey++;
            return "key" + key + markerKey;
        };
    });

//Controller for user follow-up notification; controls the
//dialog that allows for message/attachment to be sent to users
    app.controller('NotificationController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory', 'socket',
        function ($rootScope, $scope, parseNotificationService, ngDialog, errorFactory, socket) {
            //Get data from ngDialog directive
            this.name = $scope.$parent.ngDialogData.name;
            this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
            this.channel = $scope.$parent.ngDialogData.channel;
            this.userId = this.channel.substring(5);
            this.sending = false;
            this.file = undefined;
            var notificationCtrl = this;
            var thisDialogId = $scope.$parent.notificationDialog.id;

            //Set focus on message box once dialog pops up
            $scope.$on('ngDialog.opened', function (event, $dialog) {
                if (thisDialogId === $dialog.attr('id')) {
                    document.getElementById("notification-message").focus();
                }
            });

            //Let TipFeed controller know this dialog turned off
            $scope.$on('ngDialog.closed', function (event, $dialog) {
                if (thisDialogId === $dialog.attr('id')) {
                    $rootScope.$broadcast('notification-dialog-closed');
                }
            });

            //Notification was successfully saved and pushed (sent)
            $scope.$on('notification-success', function (notification) {
                notificationCtrl.sending = false;
                $scope.$apply();
                $scope.closeThisDialog();
            });

            //Notification was saved, but not pushed
            $scope.$on('notification-partial-success', function (notification) {
                //Right now same as success event, but might change
                notificationCtrl.sending = false;
                $scope.$apply();
                $scope.closeThisDialog();
            });

            //Notification either wasn't saved, or did save
            //but push failed and error clause removed said save
            $scope.$on('notification-error', function (notification) {
                errorFactory.showError('NOTIF-FAILED');
                notificationCtrl.sending = false;
                $scope.$apply();
            });

            socket.on('follow-up-notif-sent', function (data) {
                notificationCtrl.sending = false;
                $scope.$apply();
                $scope.closeThisDialog();
            });

            //    //Once a file is selected, prep file for upload to Parse
            //    this.onFileSelect = function($files){
            //      //Fetch file
            //      this.file = $files[0];
            //
            //      //Set file type
            //      if(this.file.type.match('image.*')){
            //        this.fileType = "image";
            //      }
            //      else if(this.file.type.match('video.*')){
            //        this.fileType = "video";
            //      }
            //      else{
            //        this.fileType = "audio";
            //      }
            //      //Set file name
            //      this.fileLabel = this.file.name
            //    };

            //Send the notification to the user
            this.submitNotification = function () {

                //If no title, show appropiate error and ignore
                if (!this.title) {
                    errorFactory.showError('NOTIF-NO-TITLE');
                    return;
                }
                //If no message or attachment, show appropiate error and ignore
                if (!this.message) {
                    errorFactory.showError('NOTIF-NO-MESSAGE');
                    return;
                }

                //Toggle sending animation
                this.sending = true;

                //--USED FOR NON ENCRYPTED FOLLOW UP--
                //--
                // //Set the channel where notification will be sent
                // parseNotificationService.channels.push(this.channel);
                //--
                //------------------------------------

                //Prepare notification
                var notification = {};
                notification.userId = this.userId;
                notification.controlNumber = this.controlNumber;
                notification.title = this.title;
                notification.message = this.message;
                //If a file is present, attach it and set its type
                if (this.file) {
                    notification.attachment = this.file.base64;
                    notification.attachmentType = this.file.filetype.substring(0, 5);
                }

                socket.emit('new-follow-up-notif', {
                    notificationData: notification
                });

                //--USED FOR NON ENCRYPTED FOLLOW UP--
                //--
                // //Create Parse notification and send it
                // var parseNotification = parseNotificationService.newFollowUpNotification(notification);
                // parseNotificationService.saveAndPushNotification(parseNotification);
                //--
                //------------------------------------

            };

        }
    ]);

//Controller for user follow-up notification; controls the
//dialog that allows for message/attachment to be sent to users
    app.controller('SMSController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory', 'socket', 'Session', '$http',
        function ($rootScope, $scope, parseNotificationService, ngDialog, errorFactory, socket, Session, $http) {
            //Get data from ngDialog directive
            this.phone = $scope.$parent.ngDialogData.phoneNumber;
            // this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
            // this.channel = $scope.$parent.ngDialogData.channel;
            // this.userId = this.channel.substring(5);
            this.sending = false;
            // this.file = undefined;

            var smsCtrl = this;
            var thisDialogId = $scope.$parent.SMSDialog.id;

            //Set focus on message box once dialog pops up
            $scope.$on('ngDialog.opened', function (event, $dialog) {
                if (thisDialogId === $dialog.attr('id')) {
                    document.getElementById("notification-message").focus();
                }
            });

            //Send the notification to the user
            this.sendSMS = function () {

                //If no message or attachment, show appropiate error and ignore
                if (!this.message) {
                    errorFactory.showError('SMS-NO-MESSAGE');
                    return;
                }

                if (!Session.clientPhoneNumber) {
                    return;
                }

                //Toggle sending animation
                this.sending = true;

                var data = {
                    To: this.phone,
                    From: Session.clientPhoneNumber,
                    Body: this.message
                };

                $http.post('/sendSMS', data)
                  .success(function(data){
                      $rootScope.$broadcast('sms-success');
                  })
                  .error(function(error){
                      console.log('Error: ' + error.message);
                      smsCtrl.sending = false;

                  });
            };

            //SMS was successfully saved and sent
            $scope.$on('sms-success', function () {
                smsCtrl.sending = false;
                $scope.$apply();
                $scope.closeThisDialog();
            });
        }
    ]);


//Controller for user follow-up notification; controls the
//dialog that allows for message/attachment to be sent to users
    app.controller('RegionalNotificationController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory',
        function ($rootScope, $scope, parseNotificationService, ngDialog, errorFactory) {

            this.sending = false;
            this.regions = $scope.currentRegions;
            this.allRegions = false;
            var regionalNotificationCtrl = this;

            //Once a file is selected, prep file for upload to Parse
            this.onFileSelect = function ($files) {
                //Fetch file
                this.file = $files[0];

                //Set file type
                if (this.file.type.match('image.*')) {
                    this.fileType = "image";
                } else if (this.file.type.match('video.*')) {
                    this.fileType = "video";
                } else {
                    this.fileType = "audio";
                }
                //Set file name
                this.fileLabel = this.file.name;
            };

            //Send the notification to the user
            this.submitNotification = function () {
                //If no title, show appropiate error and ignore
                if (!this.title) {
                    errorFactory.showError('REGIONAL-NOTIF-NO-TITLE');
                    return;
                }
                //If no message or attachment, show appropiate error and ignore
                if (!this.message) {
                    errorFactory.showError('REGIONAL-NOTIF-NO-MESSAGE');
                    return;
                }

                if (this.allRegions) {
                    parseNotificationService.channels.push($scope.$parent.currentClient.objectId);
                } else {
                    for (var i = 0; i < this.regions.length; i++) {
                        if (!!this.regions[i].selected) {
                            for (var j = 0; j < this.regions[i].zipCodes.length; j++) {
                                parseNotificationService.channels.push($scope.$parent.currentClient.objectId + "_" + this.regions[i].zipCodes[j]);
                            }
                        }
                    }
                }

                if (parseNotificationService.channels.length === 0) {
                    errorFactory.showError('REGIONAL-NOTIF-NO-REGION');
                    return;
                }

                this.sending = true;

                //Prepare notification
                var notification = {};
                notification.title = this.title;
                notification.message = this.message;
                //If a file is present, attach it and set its type
                if (this.file) {
                    notification.attachment = new Parse.File("attachment", this.file);
                    notification.attachmentType = this.fileType;
                }

                //Create Parse notification and send it
                var parseNotification = parseNotificationService.newRegionalNotification(notification);
                parseNotificationService.saveAndPushNotification(parseNotification);
            };

            //Notification was successfully saved and pushed (sent)
            $scope.$on('regional-notification-success', function (notification) {
                regionalNotificationCtrl.sending = false;
                $scope.$apply();
            });

            //Notification was saved, but not pushed
            $scope.$on('regional-notification-partial-success', function (notification) {
                //Right now same as success event, but might change
                regionalNotificationCtrl.sending = false;
                $scope.$apply();
            });

            //Notification either wasn't saved, or did save
            //but push failed and error clause removed said save
            $scope.$on('regional-notification-error', function (notification) {
                errorFactory.showError('NOTIF-FAILED');
                regionalNotificationCtrl.sending = false;
                $scope.$apply();
            });

        }
    ]);

//Controller for error dialog which is reusable throughout the
//app; decoupled from everything else
    app.controller('ErrorController', ['$scope', 'ERRORS', 'errorFactory',
        function ($scope, ERRORS, errorFactory) {
            //Set controller title and message
            var error = ERRORS[$scope.$parent.ngDialogData.errorCode];
            this.title = error.title;
            this.message = error.message;

            $scope.$on('ngDialog.opened', function (event, $dialog) {
                //Set focus on error confirm button
                document.getElementById("confirm-error-button").focus();
            });

            $scope.$on('ngDialog.closed', function (event, $dialog) {
                //Execute error's wrap-up function
                error.onClose();
                //Let errorFactory know that error is no longer active
                errorFactory.errorIsActive = false;
            });

        }
    ]);

//Controller for Google map in the 'Maps' state.
    app.controller('PoliceStationsMapController', ['PoliceStationsService', '$scope', function (PoliceStationsService, $scope) {

        var mapCtrl = this;

        //Hack to avoid google-map directive bug when updating
        //marker's window.
        mapCtrl.redrawMarkers = function () {
            return PoliceStationsService.redrawMarkers;
        };

        mapCtrl.map = {
            zoom: 14,
            center: {
                latitude: 0,
                longitude: 0
            }
        };

        PoliceStationsService.getCenter()
          .then(function (center) {
            mapCtrl.map.center = angular.copy(center);
          });

        PoliceStationsService.map = mapCtrl.map;

        mapCtrl.policeStationsMarkers = [];

        mapCtrl.searchbox = {
            template: 'searchbox.tpl.html',
            position: 'top-left',
            options: {
                bounds: {}
            },
            events: {
                places_changed: function (searchBox) {
                    var places = searchBox.getPlaces();
                    if (places.length === 0) {
                        return;
                    }
                    //Take only the first place on the list.
                    var place = places[0];
                    mapCtrl.map.center = {
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    PoliceStationsService.map.center = mapCtrl.map.center;
                }
            }
        };

        //Retreive markers from the service.


        //Check if the user is adding a new station.
        mapCtrl.isAdding = function () {
            return PoliceStationsService.isAdding;
        };

        mapCtrl.refresh = function () {

          PoliceStationsService.getStationsMarkers()
            .then(function setMarkers(markers) {
                mapCtrl.policeStationsMarkers = markers;
                PoliceStationsService.redrawMarkers = false;
            });
        };

        // get first points
        mapCtrl.refresh();

        $scope.$watch(function () {
          return PoliceStationsService.redrawMarkers;
        }, function (newVal) {
          if (newVal === true) {
            mapCtrl.refresh();
          }
        });

    }]);

//The buttons on the map need a new controller for themselves.
//This is it.
    app.controller('AddStationController', ['PoliceStationsService', '$scope', 'ngDialog', function (PoliceStationsService, $scope, ngDialog) {
        var buttonCtrl = this;

        //Check if the user is adding a new station to
        //enable/disable the buttons.
        buttonCtrl.isAdding = function () {
            return PoliceStationsService.isAdding;
        };

        //Show the dialog to enter station information
        buttonCtrl.showFormDialog = function (data) {
            var loginDialog = ngDialog.open({
                template: '../new-station-form.html',
                className: 'ngdialog-theme-plain',
                closeByDocument: false,
                closeByEscape: false,
                showClose: true,
                scope: $scope,
                data: data
            });
        };

        //Add new temp marker to the map
        buttonCtrl.newStationMarker = function () {
            var marker = {
                id: 'temp',
                name: "",
                address: "",
                email: "",
                phone: "",
                description: "",
                // temp: true,
                latitude: PoliceStationsService.map.center.latitude,
                longitude: PoliceStationsService.map.center.longitude,
                icon: {
                    url: './resources/images/marker-icon.png',
                    // This marker is 29 pixels wide by 40 pixels tall.
                    scaledSize: new google.maps.Size(32, 44),
                    // The origin for this image is 0,0.
                    origin: new google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at 0,32.
                    anchor: new google.maps.Point(16, 44)
                },
                options: {
                    draggable: true,
                    title: "New Station",
                    visible: true
                }
            };
            PoliceStationsService.addMarker(marker);
            PoliceStationsService.isAdding = true;
        };

        //Cancel the addition of a new station.
        buttonCtrl.cancel = function () {
            PoliceStationsService.cancel();
        };

        //Edit station button inside the window of each marker.
        buttonCtrl.editStation = function (id) {
            //Disable Edit button on temp markers.
            if (id === "temp") {
                return;
            }

            //Prepare data to be sent to the form/dialog
            var marker = PoliceStationsService.getMarker(id);
            var data = JSON.stringify({
                name: marker.name,
                address: marker.address,
                email: marker.email,
                phone: marker.phone,
                description: marker.description,
                id: marker.id
            });

            //Show the form to edit the police station
            buttonCtrl.showFormDialog(data);
        };
    }]);

//Controller for the ngDialog pop-up for editing the station.
    app.controller('StationDialogController', ['PoliceStationsService', '$scope', 'ngDialog', function (PoliceStationsService, $scope, ngDialog) {
        var dialogCtrl = this;

        //Populate station data if we are opening the dialog
        //for editing a station
        if ($scope.$parent.ngDialogData) {
            dialogCtrl.station = $scope.$parent.ngDialogData;
        }
        //Is a new station dialog
        else {
            dialogCtrl.station = {
                name: "",
                address: "",
                email: "",
                phone: "",
                description: "",
                id: undefined
            };
        }
        //Save the info for the station
        dialogCtrl.submit = function () {
            //Do not submit if there is no name entered.
            if (dialogCtrl.station.name === "") {
                // TODO throw NO-NAME error.
                return;
            }

            //Start redraw-markers hack
            PoliceStationsService.redrawMarkers = true;

            //Update edited marker. If the id is defined, means
            //that we are editing a previously saved station.
            if (!!dialogCtrl.station.id) {
                PoliceStationsService.updateStationInfo(dialogCtrl.station);
            }
            //Save new marker
            else {
                PoliceStationsService.saveStation(dialogCtrl.station);
            }

            $scope.closeThisDialog();
        };

        //Delete station
        dialogCtrl.delete = function () {
            PoliceStationsService.deleteStation(dialogCtrl.station.id);
            $scope.closeThisDialog();
        };
    }]);

//Controller for Administrator Panel
    app.controller('AdminPanelController', ['socket', 'Session', '$anchorScroll', '$location', 'usSpinnerService', '$http', '$scope', function (socket, Session, $anchorScroll, $location, usSpinnerService, $http, $scope) {

        var adminPanelCtrl = this;
        this.sending = false;
        adminPanelCtrl.hasError = false;

        adminPanelCtrl.viewingAll = true;
        adminPanelCtrl.viewingUsers = false;
        adminPanelCtrl.viewingEmployees = false;
        adminPanelCtrl.viewingAdministrators = false;
        adminPanelCtrl.viewingLoggedIn = false;
        adminPanelCtrl.addingUser = false;


        adminPanelCtrl.states = ["Select","AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VI","VT","VA","WA","WV","WI","WY"];
        adminPanelCtrl.roles = ["Select","employee","admin"];

        adminPanelCtrl.adminPanelUsersArray = [];
        adminPanelCtrl.selectedUsers = [];
        adminPanelCtrl.editedUser;

        //pagination variables
        adminPanelCtrl.currentPageNum = 1;
        adminPanelCtrl.lastPageNum;
        adminPanelCtrl.pageNumbers;
        adminPanelCtrl.limit = 10;
        adminPanelCtrl.skip;
        adminPanelCtrl.userTotal;
        adminPanelCtrl.usersAvailable = true;
        adminPanelCtrl.fetchingUsers = true;
        adminPanelCtrl.rolesFilter = "";

        adminPanelCtrl.getPage = function(pageNum){

            if(pageNum < 1 || (pageNum > adminPanelCtrl.lastPageNum && adminPanelCtrl.lastPageNum > 0)){
                return;
            }

            usSpinnerService.spin('loading-video-archive-spinner');
            adminPanelCtrl.currentPageNum = pageNum;
            adminPanelCtrl.skip = (adminPanelCtrl.currentPageNum - 1) * adminPanelCtrl.limit;

            var params = {
                homeClient: Session.clientId,
                searchString: adminPanelCtrl.searchString,
                registrationDate: adminPanelCtrl.registrationDate,
                role: adminPanelCtrl.rolesFilter,
                lastUserCreatedAt: false, // adminPanelCtrl.adminPanelUsersArray[adminPanelCtrl.limit - 1].createdAt || undefined,
                skip: adminPanelCtrl.skip,
                limit: adminPanelCtrl.limit
            };

            adminPanelCtrl.fetchingUsers = true;
            $http.get('/users/list', {params: params})
              .success(function(data){

                  adminPanelCtrl.lastPageNum = data.lastPageNum;
                  adminPanelCtrl.userTotal = data.userTotal;

                  adminPanelCtrl.adminPanelUsersArray = angular.copy(data.users);

                  if(adminPanelCtrl.adminPanelUsersArray.length===0){
                      adminPanelCtrl.usersAvailable = false;
                  }
                  else{
                      adminPanelCtrl.usersAvailable = true;
                  }

              })
              .error(function(err){
                  adminPanelCtrl.usersAvailable = false;

              }).then(function(){
                  usSpinnerService.stop('loading-video-archive-spinner');
                  $location.hash('top');
                  $anchorScroll();
                  adminPanelCtrl.refreshPageNumbers();
                  adminPanelCtrl.fetchingUsers = false;
              });
        };

        adminPanelCtrl.sortRoles = function(roles){
            roles.sort();
        }

        adminPanelCtrl.refreshPageNumbers = function(){

            var baseNum = Math.floor(adminPanelCtrl.currentPageNum / adminPanelCtrl.limit);
            var firstNum =  adminPanelCtrl.currentPageNum % adminPanelCtrl.limit === 0 ? (baseNum - 1) * adminPanelCtrl.limit + 1 : baseNum  * adminPanelCtrl.limit + 1;
            var lastNum = 0;

            if(adminPanelCtrl.currentPageNum % adminPanelCtrl.limit === 0){
                lastNum = adminPanelCtrl.currentPageNum;
            }
            else if(baseNum * adminPanelCtrl.limit + adminPanelCtrl.limit > adminPanelCtrl.lastPageNum){
                lastNum = adminPanelCtrl.lastPageNum;
            }
            else{
                lastNum = baseNum * adminPanelCtrl.limit + adminPanelCtrl.limit;
            }

            adminPanelCtrl.pageNumbers = [];

            for(var i = 0, j = firstNum; j <= lastNum; i++, j++){
                adminPanelCtrl.pageNumbers[i] = j;
            }
        }

        this.saveUser = function(){

            if(adminPanelCtrl.formUser.state !== 'Select' || adminPanelCtrl.formUser.role !== 'Select') {
                if(/(^\d{1,5}$)|(^\d{1,5}-\d{1,4}$)/.test(adminPanelCtrl.formUser.zipCode)){
                    if (adminPanelCtrl.addingUser) {
                        adminPanelCtrl.addUser(adminPanelCtrl.formUser);
                    }
                    else if (adminPanelCtrl.editingUser) {
                        adminPanelCtrl.updateUser(adminPanelCtrl.formUser);
                    }
                    else {
                        return;
                    }
                }
                else{
                    adminPanelCtrl.successMessage = "Please enter a valid zip code."
                    adminPanelCtrl.hasError = true;
                }
            }

            return;
        }

        //Adds new SentiHelm user
        this.addUser = function (newUser) {

            adminPanelCtrl.successMessage = "";
            adminPanelCtrl.sending = true;

            newUser.roles = [newUser.roles];

            var data = {
                newOfficer: newUser
            }

            $http.post('/users/add', data)
              .success(function(data){
                  adminPanelCtrl.sending = false;
                  adminPanelCtrl.successMessage = data;
                  adminPanelCtrl.hasError = false;
              })
              .error(function(err){
                  adminPanelCtrl.sending = false;
                  adminPanelCtrl.successMessage = err;
                  adminPanelCtrl.hasError =  true;

              }).then(function(){
                  $location.hash('top');
                  $anchorScroll();
              });
        };

        adminPanelCtrl.updateUser = function(user){

            adminPanelCtrl.successMessage = "";
            adminPanelCtrl.sending = true;

            var data = {
                user: user
            }

            $http.post('/users/update', data)
              .success(function(data){
                  adminPanelCtrl.sending = false;
                  adminPanelCtrl.successMessage = data;
                  adminPanelCtrl.hasError = false;
              })
              .error(function(err){
                  adminPanelCtrl.sending = false;
                  adminPanelCtrl.successMessage = err;
                  adminPanelCtrl.hasError =  true;

              }).then(function(){
                  $location.hash('top');
                  $anchorScroll();
              });
        };

        adminPanelCtrl.updateRole = function(action, role){

            adminPanelCtrl.findSelectedUsers();

            if(adminPanelCtrl.selectedUsers.length == 0){
                adminPanelCtrl.successMessage = "Please selected at least one user to apply any actions.";
                adminPanelCtrl.hasError = true;
                return;
            }

            usSpinnerService.spin('loading-video-archive-spinner');

            var roleString;
            var roleAction;
            //determine role string
            if(role === "admin"){
                roleString = "Administrator";
            }
            else{
                roleString = "Officer";
            }

            if(action === "add"){
                roleAction = "ADDED to";
            }
            else{
                roleAction = "REMOVED from";
            }

            var roleChangeConfirm = confirm("The " + roleString + " role will be " + roleAction + " selected user(s).");

            if(roleChangeConfirm){
                var data = {
                    users: adminPanelCtrl.selectedUsers,
                    action: action,
                    role: role
                }

                $http.post('/users/update/role', data)
                  .success(function(data){
                      adminPanelCtrl.successMessage = data;
                      adminPanelCtrl.hasError = false;
                  })
                  .error(function(err){
                      adminPanelCtrl.successMessage = err;
                      adminPanelCtrl.hasError = true;
                  }).then(function(){
                      adminPanelCtrl.getPage(adminPanelCtrl.currentPageNum);
                  });
            }

            usSpinnerService.stop('loading-video-archive-spinner');
        };

        adminPanelCtrl.deleteUser = function(){

            adminPanelCtrl.findSelectedUsers();

            if(adminPanelCtrl.selectedUsers.length == 0){
                adminPanelCtrl.successMessage = "Please selected at least one user to apply any actions.";
                adminPanelCtrl.hasError = true;
                return;
            }

            usSpinnerService.spin('loading-video-archive-spinner');

            var deleteUserConfirm = confirm("The selected user(s) will be DELETED.");

            if(deleteUserConfirm){
                var data = {
                    users: adminPanelCtrl.selectedUsers
                }

                $http.post('/users/delete', data)
                  .success(function(data){
                      adminPanelCtrl.successMessage = data;
                      adminPanelCtrl.hasError = false;
                  })
                  .error(function(err){
                      adminPanelCtrl.successMessage = err;
                      adminPanelCtrl.hasError = true;
                  }).then(function(){
                      adminPanelCtrl.getPage(adminPanelCtrl.currentPageNum);
                  });
            }

            usSpinnerService.stop('loading-video-archive-spinner');
        };

        adminPanelCtrl.selectUser = function(user){
            user.selected = true;
        };

        adminPanelCtrl.findSelectedUsers = function(){

            adminPanelCtrl.selectedUsers = [];

            adminPanelCtrl.adminPanelUsersArray.forEach(function(user){
                if(user.selected){
                    adminPanelCtrl.selectedUsers.push(user);
                }
            });
        };

        adminPanelCtrl.decryptUser = function(user){

            var data = {
                user: user
            }

            $http.post('/users/decrypt', data)
              .success(function(data){
                  adminPanelCtrl.editedUser = angular.copy(data);
              })
              .error(function(err){
                  adminPanelCtrl.successMessage = err;
                  adminPanelCtrl.hasError = true;
              }).then(function(){
                  adminPanelCtrl.formUser = adminPanelCtrl.editedUser;
                  if(adminPanelCtrl.formUser.permissions !== undefined && adminPanelCtrl.formUser.permissions !== null) {
                      adminPanelCtrl.formUser.permissions.forEach(function (perm) {
                          $('#' + perm + '-access').attr('selected', 'selected');
                      });
                  }

                  $('.selectpicker').selectpicker('refresh');
              });
        };

        adminPanelCtrl.changeView = function(view){

            adminPanelCtrl.viewingAll = false;
            adminPanelCtrl.viewingUsers = false;
            adminPanelCtrl.viewingEmployees = false;
            adminPanelCtrl.viewingAdministrators = false;
            adminPanelCtrl.viewingLoggedIn = false;
            adminPanelCtrl.addingUser = false;
            adminPanelCtrl.editingUser = false;

            adminPanelCtrl.successMessage = "";
            adminPanelCtrl.hasError = false;

            switch(view){

                case 'all':
                    adminPanelCtrl.viewingAll = true;
                    adminPanelCtrl.rolesFilter = "";
                    adminPanelCtrl.getPage(1);
                    break;

                case 'users':
                    adminPanelCtrl.viewingUsers = true;
                    // TODO call getPage with corresponding filter
                    break;

                case 'employees':
                    adminPanelCtrl.viewingEmployees = true;
                    adminPanelCtrl.rolesFilter = "employee";
                    adminPanelCtrl.getPage(1);
                    break;

                case 'administrators':
                    adminPanelCtrl.viewingAdministrators = true;
                    adminPanelCtrl.rolesFilter = "admin";
                    adminPanelCtrl.getPage(1);
                    break;

                case 'loggedIn':
                    adminPanelCtrl.viewingLoggedIn = true;
                    // TODO call getPage with corresponding filter
                    break;

                case 'addUser':
                    adminPanelCtrl.addingUser = true;
                    $scope.addOfficerForm.$setPristine();
                    adminPanelCtrl.formUser = {};
                    $('.selectpicker').selectpicker('refresh');
                    break;

                case 'editUser':
                    adminPanelCtrl.editingUser = true;
                    //$scope.addOfficerForm.$set();
                    adminPanelCtrl.formUser = {};
                    break;
            };
        };
        adminPanelCtrl.getPage(adminPanelCtrl.currentPageNum);
        $('.selectpicker').selectpicker();

    }]);

//Controller for Data Analysis page
    app.controller('DataAnalysisController', ['$scope', 'DataAnalysisService', function ($scope, DataAnalysisService) {

        var analysisCtrl = this;
        analysisCtrl.loading = true;
        analysisCtrl.currentYear = new Date().getFullYear();
        analysisCtrl.previousAvailableYears = [];
        analysisCtrl.selectedYear = analysisCtrl.currentYear;
        analysisCtrl.yearInSelector = analysisCtrl.currentYear;
        analysisCtrl.selectedMonth = null;
        analysisCtrl.dateChartCsvHeader = ["Date", "Amount of Tips"];
        analysisCtrl.monthChartCsvHeader = ["Month", "Amount of Tips"];
        analysisCtrl.typeChartCsvHeader = ["Crime Type", "Amount of Tips"];
        analysisCtrl.showErrorMessage = false;

        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"
        ];

        //Get years from current year to 2014
        for (var i = 1; i <= analysisCtrl.currentYear - 2014; i++) {
            analysisCtrl.previousAvailableYears.push(analysisCtrl.currentYear - i);
        }

        //Initiate data analysis
        DataAnalysisService.requestDataAnalysis(analysisCtrl.selectedYear);

        //Receive the data from service
        $scope.$on('data-analysis', function (event, charts) {
            analysisCtrl.tipsDateChart = charts.tipsDateChart;
            analysisCtrl.tipsTypeChart = charts.tipsTypeChart;
            analysisCtrl.loading = false;
            analysisCtrl.showErrorMessage = false;
        });

        //Receive the data from service
        $scope.$on('data-analysis-error', function (event, charts) {
            analysisCtrl.loading = false;
            analysisCtrl.showErrorMessage = true;
            // analysisCtrl.tipsDateChart = charts.tipsDateChart;
            // analysisCtrl.tipsTypeChart = charts.tipsTypeChart;
        });

        var onSelectTipsDateChart = function () {
            var selectedItem = $scope.$$childHead.chartWrapper.getChart().getSelection()[0];
            //User selected one item.
            if (selectedItem && selectedItem.row !== null && $scope.$$childHead.chart.type === "ColumnChart") {
                analysisCtrl.loading = true;
                analysisCtrl.selectedMonth = months[selectedItem.row];
                DataAnalysisService.requestDataAnalysis(analysisCtrl.selectedYear, selectedItem.row);
            }
            $scope.$apply();
        };

        var callback = function () {
            $scope.$$childHead.callback = onSelectTipsDateChart;
        };

        var settings = {
            callback: callback,
            packages: ['corechart']
        };

        google.load('visualization', '1.0', settings);

        analysisCtrl.selectYear = function (selectedYear) {
            analysisCtrl.loading = true;
            analysisCtrl.selectedMonth = null;
            analysisCtrl.selectedYear = selectedYear;
            DataAnalysisService.requestDataAnalysis(selectedYear);
        };

    }]);

})();
