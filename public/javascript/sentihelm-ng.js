(function(){
  var app = angular.module('sentihelm', ['ui.router','btford.socket-io','google-maps'.ns(), 'ngDialog','angularFileUpload', 'angularSpinner', 'snap', 'naif.base64']);

  //Sets up all the states/routes the app will handle,
  //so as to have a one page app with deep-linking
  app.config(['$stateProvider','$urlRouterProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, USER_ROLES){

    // For any unmatched url, redirect to /tipfeed
    $urlRouterProvider.otherwise("/tipfeed");

    $stateProvider
    //Tipfeed endpoint/url
    .state('tipfeed',{
      url:"/tipfeed",
      templateUrl:"/tipfeed.html",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Tip Feed");
        }
      }
    })

    //Video Streams endpoint/url
    .state('video-streams',{
      url:"/video-streams",
      templateUrl:"/video-streams.html",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Video Streams");
        }
      }
    })

    //Regional notifications endpoint/url
    .state('regional-notifications',{
      url:"/regional-notifications",
      templateUrl:"/regional-notifications.html",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Send Notification");
        }
      }
    })

    //Maps endpoint/url
    .state('maps',{
      url:"/maps",
      templateUrl:"/maps.html",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Maps");
        }
      }
    })

    //Most Wanted List endoint/url
    .state('most-wanted',{
      url:"/most-wanted",
      templateUrl:"/most-wanted.html",
      data: {
        authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Wanted List");
        }
      }
    })

    //Admin-panel endpoint/url
    .state('admin-panel',{
      url:"/admin-panel",
      templateUrl:"/admin-panel.html",
      data: {
        authorizedRoles: [USER_ROLES.admin]
      },
      resolve: {
        // Reads the Routing Service
        routingService: 'RoutingService',

        // Receives the Routing Service, checks if user is logged in,
        // executes the login dialog if needed and waits for the dialog
        // to close before loading the state.
        authenticate: function(routingService) {
          return routingService.checkUserStatus(this.data.authorizedRoles, "Administrator Panel");
        }
      }
    });
  }]);

  //Sets up the options for snapRemote, which is
  //the snap.js instance that allows for a slidable
  //drawer
  app.config(['snapRemoteProvider', function(snapRemoteProvider){
    snapRemoteProvider.globalOptions = {
      disable:'right',
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

  //Initialize values needed throughout the app
  app.run(function(){
    //Initialize Parse
    Parse.initialize("csvQJc5N6LOCQbAnzeBlutmYO0e6juVPwiEcW9Hd", "T9wCcLw0g1OBtlVg0s2gQoGITog5a0p77Pg3CIor");
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
    user: 'officer',
    admin: 'admin'
  });

  //All errors are contained in this constant;
  //used with errorFactory service for easy error
  //alerting
  app.constant('ERRORS',{
    'LOGIN-101':{
      title: 'Invalid Login Parameters',
      message: 'The email or password you entered is incorrect',
      code:'LOGIN-101',
      onClose: function(){
        document.getElementById("login-dialog-username").focus();
      }
    },
    'LOGIN-NO-USERID':{
      title: 'No UserId',
      message: 'You must provide a login ID',
      code:'LOGIN-NO-USERID',
      onClose: function(){
        document.getElementById("login-dialog-username").focus();
      }
    },
    'LOGIN-NO-PASS':{
      title: 'No Password',
      message: 'You must provide a password',
      code:'LOGIN-NO-PASS',
      onClose: function(){
        document.getElementById("login-dialog-password").focus();
      }
    },
    'NOTIF-FAILED': {
      title: 'Push Notification Failed',
      message: 'The notification could not be sent. '+
      'Please try again in a while. If the '+
      'error persists, contact the tech team.',
      code: 'NOTIF-FAILED',
      onClose: function(){
        //Do nothing
        return;
      }
    },
    'NOTIF-NO-MESSAGE':{
      title: 'No Content',
      message: 'The notification must contain a message.',
      code: 'NOTIF-NO-MESSAGE',
      onClose: function(){
        document.getElementById("notification-message").focus();
      }
    },
    'NOTIF-NO-TITLE':{
      title: 'No Title',
      message: 'The notification must have a title.',
      code: 'NOTIF-NO-TITLE',
      onClose: function(){
        document.getElementById("notification-title").focus();
      }
    },
    'REGIONAL-NOTIF-NO-MESSAGE':{
      title: 'No Content',
      message: 'The notification must contain a message.',
      code: 'REGIONAL-NOTIF-NO-MESSAGE',
      onClose: function(){
        document.getElementById("regional-notification-body").focus();
      }
    },
    'REGIONAL-NOTIF-NO-TITLE':{
      title: 'No Title',
      message: 'The notification must have a title.',
      code: 'REGIONAL-NOTIF-NO-TITLE',
      onClose: function(){
        document.getElementById("regional-notification-title").focus();
      }
    },
    'REGIONAL-NOTIF-NO-REGION':{
      title: 'No Regions Selected',
      message: 'You must select at least one region',
      code: 'REGIONAL-NOTIF-NO-REGION',
      onClose: function(){
        //Do nothing
        return;
      }
    },
    'NO-SESSION':{
      title: 'You Are Not Logged In',
      message: 'You need to log in order to use the dashboard.',
      code: 'NO-SESSION',
      onClose: function(){
        //Do nothing
        return;
      },
    },
    'NO-AUTH':{
      title: 'You do Not Have Access to This Page',
      message: 'Your access level does not allow you to view this page. '+
      'If you believe this is an error, contact your dashboard administrator.',
      code: 'NO-AUTH',
      onClose: function(){
        //Do nothing
        return;
      }
    },
    'MOST-WANTED-NO-NAME':{
      title: 'No Name Provided',
      message: 'The name field cannot be empty.',
      code: 'MOST-WANTED-NO-NAME',
      onClose: function(){
        //Do nothing
        return;
      }
    }
  });

  //Creates a routing service which is passed to ui-router
  //to check if user is logged in and/or has access to the
  //current route; returns a Promise
  app.factory("RoutingService", ['USER_ROLES', '$rootScope', 'AUTH_EVENTS', 'authenticator', 'errorFactory', 'ngDialog',
  function(USER_ROLES, $rootScope, AUTH_EVENTS, authenticator, errorFactory, ngDialog){

    var routingService =  {};

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
        }
        else {

          //User is not logged in
          //TODO $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

          //Present login dialog for user to log in
          var loginDialog = ngDialog.open({
            template: '../login-dialog.html',
            className: 'ngdialog-theme-plain',
            closeByDocument: false,
            closeByEscape:false,
            showClose: false,
            scope: $rootScope
          });

          //TODO Improve the following documentation:
          //Return the promise of the login dialog so that the resolve can use
          //this promise and wait until the dialog is closed before loading the
          //corresponding state
          return loginDialog.closePromise.then(function(){
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
  }]);

  //Creates a session service that can create
  //and destroy a session which manages (logged in) users
  app.factory('Session',['$window', '$rootScope', 'AUTH_EVENTS', function($window, $rootScope, AUTH_EVENTS){

    var session = {};

    //Create a session object, along with id, userId and roles
    session.create = function (userId, userRoles, clientId, regions) {
      session.userId = userId;
      session.userRoles = userRoles;
      session.clientId = clientId;
      session.regions = regions;
    };

    //Destroy current session object
    session.destroy = function () {
      session.userId = undefined;
      session.userRoles = undefined;
      session.clientId = undefined;
      session.regions = undefined;

      //Delete from session window
      $window.sessionStorage.clear();
      
    };

    session.store = function(user, client){

      var userObj = {};
      for (var property in user) {
        if (user.hasOwnProperty(property)) {
          userObj[property] = user[property];
        }
      }

      var clientObj = {};
      for (var property in client) {
        if (client.hasOwnProperty(property)) {
          clientObj[property] = client[property];
        }
      }

      var sessionObj = {};
      sessionObj.userId = session.userId;
      sessionObj.userRoles = session.userRoles;
      sessionObj.clientId = session.clientId;
      sessionObj.regions = session.regions;

      $window.sessionStorage['session'] = JSON.stringify(sessionObj);
      $window.sessionStorage['user'] = JSON.stringify(userObj);
      $window.sessionStorage['client'] = JSON.stringify(clientObj);
    }

    session.restoreSession = function(){
      var storedSession = $window.sessionStorage['session'];
      var storedUser = $window.sessionStorage['user'];
      var storedClient = $window.sessionStorage['client'];

      if(!!storedSession && !!storedUser && !!storedClient) {
        storedSession = JSON.parse(storedSession);
        storedUser = JSON.parse(storedUser);
        storedClient = JSON.parse(storedClient);
        session.userId = storedSession.userId;
        session.userRoles = storedSession.userRoles;
        session.clientId = storedSession.clientId;
        session.regions = storedSession.regions;

        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, [storedUser, storedClient, session.regions]);
      }
    }

    return session;
  }]);

  //Creates a service that manages login and
  //authentication functionality; manages current session
  app.factory('authenticator', ['$http', 'Session', '$window', function($http, Session, $window){

    var authenticator = {};

    authenticator.login = function(credentials){
      return $http.post('/login', credentials);
    };

    authenticator.isAuthenticated = function () {
      Session.restoreSession();

      //Return true if userId is set; false otherwise
      return !!Session.userId;
    };

    authenticator.isAuthorized = function (authorizedRoles) {
      //Get roles; if not an array, make one(for when string is passed)
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }

      if(this.isAuthenticated()){
        for(var i=0; i<Session.userRoles.length; i++){
          var role = Session.userRoles[i];
          if(authorizedRoles.indexOf(role) !== -1){
            return true;
          }
        }
      }

      return false;

      // return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authenticator;
  }]);

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
//     var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
    var ioSocket = io.connect('http://localhost:80');

    socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

  //Creates an error delivering service that can
  //be called anywhere in the app, be it with
  //pre-made errors fount in ERROR_CODES constant
  //or newly created errors via methods offered
  app.factory('errorFactory', ['ngDialog', '$rootScope', 'ERRORS', function(ngDialog, $rootScope, ERRORS){

    var errorFactory = {};

    //Denotes if an error is showing on screen
    errorFactory.errorIsActive = false;

    //Not being used; might use in future releases to create
    //on-the-fly errors
    errorFactory.newError = function(title, message, onClose){
      //Error creation would go here
    };

    //Show pre-made, constant errors with display function
    errorFactory.showError = function(errorCode){
      if(!errorFactory.errorIsActive){
        var error = JSON.stringify({errorCode:errorCode});
        var errorDialog = ngDialog.open({
          template: '../error-dialog.html',
          className: 'ngdialog-error',
          closeByDocument: false,
          closeByEscape:false,
          showClose: false,
          data:error
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
  app.factory('parseNotificationService', ['$rootScope', function($rootScope){

    //Needed to save Parse notifications to
    //the PushNotifications class in Parse
    var PushNotification = Parse.Object.extend("PushNotifications");

    var parseNotificationService = {};

    //Array that contains channels where notifications
    //will be sent; emptied once any notification is sent
    parseNotificationService.channels = [];

    //Creates and returns a new Parse Notification from
    //notification data gathered from controller
    parseNotificationService.newFollowUpNotification = function(notificationData){
      var notification = new PushNotification();
      notification.set("userId", notificationData.userId);
      notification.set("tipId", notificationData.controlNumber);
      notification.set("title", notificationData.title);
      notification.set("message", notificationData.message);
      notification.set("type", 'follow-up');
      notification.set("channels", parseNotificationService.channels);
      if(notificationData.attachment){
        notification.set(notificationData.attachmentType, notificationData.attachment);
      }
      return notification;
    };

    //Creates and returns a new Parse Notification from
    //notification data gathered from controller
    parseNotificationService.newRegionalNotification = function(notificationData){
      var notification = new PushNotification();
      notification.set("title", notificationData.title);
      notification.set("message", notificationData.message);
      notification.set("type", 'regional');
      notification.set("channels", parseNotificationService.channels);
      if(notificationData.attachment){
        notification.set(notificationData.attachmentType, notificationData.attachment);
      }
      return notification;
    };

    //Saves and Pushes the Parse Notification by calling other methods
    //in chain; it first saves the notification, then calls
    //associateNotificationWithTip(), which in turn calls pushNotification();
    //if anything fails, the error is broadcast throughout the app
    parseNotificationService.saveAndPushNotification = function(notification){
      //Try and save the notification to Parse, for future viewing
      notification.save(null, {
        success: function(notification){
          //Notification saved, now push it to channels
          parseNotificationService.pushNotification(notification);
        },
        error : function(notification, error){
          //Notification could not be saved, pass control back to controller
          //and reset channels
          if(notification.attributes.type==='follow-up'){
            $rootScope.$broadcast('notification-error', [notification, error]);
          }
          else{
            $rootScope.$broadcast('regional-notification-error', [notification, error]);
          }
          parseNotificationService.channels = [];
        }
      });
    };

    //Sends the already saved notification to the user; if pushing
    //failed, tries to revert save or continues as partial success
    parseNotificationService.pushNotification = function(notification){
      //Send notification
      Parse.Push.send({
        channels: parseNotificationService.channels,
        data: {
          alert: notification.attributes.message,
          badge:"Increment",
          sound: "cheering.caf",
          title: notification.attributes.title,
          pushId: notification.id,
          type: "regional"
        }
      },{
        success: function(){
          //Push was successful
          //Reset channels and alert controller
          parseNotificationService.channels = [];
          if(notification.attributes.type==='follow-up'){
            $rootScope.$broadcast('notification-success', [notification]);
          }
          else{
            $rootScope.$broadcast('regional-notification-success', [notification]);
          }
          // $rootScope.$broadcast('notification-success', [notification]);
        },
        error: function(error){
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
    parseNotificationService.deleteSavedNotification = function(notification, passedError){
      var parentError = passedError;
      notification.destroy({
        success: function(notification){
          //Notification was successfully deleted;
          //Alert the controller to prompt the user
          //to try again
          if(notification.attributes.type==='follow-up'){
            $rootScope.$broadcast('notification-error', [notification, parentError]);
          }
          else{
            $rootScope.$broadcast('regional-notification-error', [notification, parentError]);
          }
          // $rootScope.$broadcast('notification-error', [notification, parentError]);
        },
        error: function(notification, error){
          //Failed to delete notification
          //Do Nothing, but alert controller
          //to partial success
          if(notification.attributes.type==='follow-up'){
            $rootScope.$broadcast('notification-partial-success', [notification]);
          }
          else{
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
  app.factory('paginatorService', ['socket', '$rootScope', 'Session', function(socket, $rootScope, Session){

    //Set up the paginator object
    var paginator = {};

    //Catch socket.io event when a batch is sent
    //Let controller know news tips arrived; update
    //amount of total tips in server, last page, first
    //and last tip dates and paginator set
    socket.on('response-batch', function(data){
      if(!!data.totalTipCount){
        paginator.tips = data.tips;
        paginator.totalTipCount = data.totalTipCount;
        paginator.lastPage = Math.max(Math.ceil(paginator.totalTipCount/10), 1);
        paginator.firstTipDateInArray = data.tips[0].createdAt;
        paginator.lastTipDateInArray = data.tips[data.tips.length-1].createdAt;
        if(paginator.currentPage===1){
          paginator.pageSetUpdater(paginator.lastPage, false);
        }
//        paginator.changePage(paginator.currentPage);
        $rootScope.$broadcast('new-batch', [paginator.tips, paginator.currentPage]);
      }
      else{
        $rootScope.$broadcast('no-tips');
      }

      $rootScope.$broadcast('hide-spinner');
    });


    //Catch socket.io event when a tip request
    //failed; manage error accordingly with
    //errorFactory service
    socket.on('response-error', function(data){
      var error = data.error;
      //TODO MANAGE ERROR
    });

    //Called when tipfeed loads, be it on
    //refresh or navigating to it again;
    //initiliazes tip feed for current client
    paginator.initializeFeed = function(){

      //Need references to current and last page,
      //array of number of pages paginator will print
      //and size of said array
      paginator.totalTipCount = 0;
      paginator.currentPage = 1;
      paginator.lastPage = 1;
      paginator.paginatorSet = [];
      paginator.paginatorSetSize = 0;
      paginator.tips;

      //Request tips
      socket.emit('request-batch', {
        clientId: Session.clientId,
        isAfterDate: false
      });
    }

    //Change the page and ask server for tips present in new page;
    //let controller know the page has changed
    paginator.changePage = function(newPage){

      var isAfterDate = this.currentPage > newPage;

      if(this.currentPage !== newPage) {
        var tipsToSkip = isAfterDate? (this.currentPage - newPage - 1)*10: (newPage - this.currentPage - 1)*10;
        this.currentPage = newPage;
        socket.emit('request-batch', {
          clientId: Session.clientId,
          lastTipDate: isAfterDate? paginator.firstTipDateInArray: paginator.lastTipDateInArray,
          isAfterDate: isAfterDate,
          tipsToSkip: tipsToSkip
        });
        $rootScope.$broadcast('discard-current-tips',[]);
      }
      else {
        var currentTips = this.tips;
      }

//      $rootScope.$broadcast('new-batch', [currentTips, paginator.currentPage]);
    };

    //Change to previous page; update references
    paginator.prevPage = function(){
      --this.currentPage;
        socket.emit('request-batch', {
          clientId: Session.clientId,
          lastTipDate: paginator.firstTipDateInArray,
          isAfterDate: true
        });

        //Discard current shown tips and update paginator
        $rootScope.$broadcast('discard-current-tips',[]);

        if(this.currentPage%10===0){
          this.pageSetUpdater(this.lastPage, true);
        }
    };

    //Change to next page; update references
    paginator.nextPage = function(){
      socket.emit('request-batch', {
        clientId: Session.clientId,
        lastTipDate: paginator.lastTipDateInArray,
        isAfterDate: false
      });

      //Discard current shown tips and update paginator
      $rootScope.$broadcast('discard-current-tips',[]);
      ++this.currentPage;

      if(this.currentPage-1%10===0){
        this.pageSetUpdater(this.lastPage, false);
      }
    };

    //Update paginator set (page numbers that will be printed every 10 pages)
    paginator.pageSetUpdater = function(setSizeLimit, previousSet){

      //If called from prevPage, gotta set starting limit to
      //previous 10 pages, otherwise start at current page
      var setStartValue = previousSet ? this.currentPage-9 : this.currentPage;
      this.paginatorSet = [];
      this.paginatorSetSize = Math.min(10, setSizeLimit);
      for(var i=0; i<this.paginatorSetSize;i++){
        this.paginatorSet.push(setStartValue+i);
      }

      //Let controller know the set has changed
      $rootScope.$broadcast('paginator-set-update',[paginator.paginatorSet, paginator.lastPage]);
    }

    return paginator;
  }]);

  app.factory('VideoStreamsService', ['socket', '$rootScope', function(socket, $rootScope){

    var otKey = '44755992';

    var VideoSession = Parse.Object.extend("VideoSession");

    var VideoStreamsService = {};

    VideoStreamsService.currentSession = null;

    var currStream;
    var storedStreams = []
    var currSubscriber;

    //Used to create a new div inside the video-streams-video
    //div to subscribe the stream to it.
    var createDivElement = function(sessionId){
      var div = document.createElement('div');
      div.setAttribute('id', 'video-streams-video-'+sessionId);
      document.getElementById('video-streams-video').appendChild(div);
      return div;
    };

    //Get all active video streams from Parse
    VideoStreamsService.getActiveStreams = function(clientId){
      var query = new Parse.Query(VideoSession);

      query.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: clientId
      });
      query.containedIn("status", ['pending', 'active']);
      query.include("mobileUser");

      query.find().then(function(results){
        //Format each result for front-end
        //keep them in modifiedStreams array
        var modifiedStreams = [];
        for(var i=0; i<results.length; i++){
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
          newStream.firstName = results[i].attributes.mobileUser.attributes.firstName;
          newStream.lastName = results[i].attributes.mobileUser.attributes.lastName;
          newStream.email = results[i].attributes.mobileUser.attributes.email;
          newStream.phone = results[i].attributes.mobileUser.attributes.phoneNumber;

          //Add modified stream to collection
          modifiedStreams.push(newStream);
        }
        //Send modified results to controller
        $rootScope.$broadcast('active-streams-fetched', modifiedStreams);
      }, function(error){
        //TODO
        //Manage error when couldn't fetch active video streams
        var err = error;
      });
    };

    //Restore active session if available if()
    VideoStreamsService.checkActiveStream = function(){
      if(!!VideoStreamsService.currentSession){
        var subscriber = VideoStreamsService.currentSession.subscribe(currStream, createDivElement(VideoStreamsService.currentSession.id),
        {insertMode:'replace', height:'400.6', width:'591'},
        function(error){
          if(!!error){
            //TODO
            //Handle error when couldn't subscribe to published streams
            console.log(error);
            return;
          }
        });
        currSubscriber = subscriber;
      }
    };

    //Stop current stream
    VideoStreamsService.stopStream = function(){
      if(!!VideoStreamsService.currentSession){
        VideoStreamsService.currentSession.unsubscribe(currSubscriber);
        // VideoStreamsService.currentSession.forceUnpublish(currStream);
        currStream.destroy();
        // VideoStreamsService.currentSession.destroy();
      }
    };

    //Subscribe to streams in the current session
    VideoStreamsService.subscribeToStream = function(stream, currentUser){

      //Create OpenTok Session
      var session = OT.initSession(otKey, stream.sessionId);

      //If another session is active, disconnect
      if(!!VideoStreamsService.currentSession){
        VideoStreamsService.currentSession.unsubscribe(currSubscriber);
        console.log("a");
      }

      if(session.isConnected()){

        for(var i =0; i < storedStreams.length; i++) {
          var object = storedStreams[i];
          if(object.session.id == session.id) {
            currStream = object.stream;
            break;
          }
        }

        var subscriber = session.subscribe(currStream, createDivElement(session.id),
        {insertMode:'replace', height:'400.6', width:'591'},
        function(error){
          if(!!error){
            //TODO
            //Handle error when couldn't subscribe to published streams
            console.log(error);
            return;
          }
        });

        currSubscriber = subscriber;
      }

      //Set up callback that handles mobileUser's streams
      session.on("streamCreated", function(event){

        storedStreams.push({session: session, stream: event.stream});

        var subscriber = session.subscribe(event.stream, createDivElement(session.id),
        {insertMode:'replace', height:'400.6', width:'591'},
        function(error){
          if(!!error){
            //TODO
            //Handle error when couldn't subscribe to published streams
            console.log(error);
            return;
          }

          var query = new Parse.Query(VideoSession);
          query.get(stream.connectionId)
          .then(function(videoSession){
            videoSession.set('officerUser', {
              __type:"Pointer",
              className:"User",
              objectId:currentUser.objectId
            });
            return videoSession.save();
          })
          .then(function(videoSession){
            //Session was upated with officer
          });

        });

        currStream = event.stream;
        currSubscriber = subscriber;

      });

      //Set up callback that handles when a mobile user disconnects
      session.on("streamDestroyed", function(event){

        //Remove stream from storedStreams
        for(var i = 0; i < storedStreams.length; i++) {
          if(storedStreams[i].stream.id === event.stream.id) {
            storedStreams[i].session.disconnect();
            storedStreams.splice(i, 1);
            break;
          }
        }

        if(currStream.id === event.stream.id) {
          currStream = null;
          currSubscriber = null;
          VideoStreamsService.currentSession = null;
        }

        $rootScope.$broadcast('stream-destroyed', {sessionId:event.target.sessionId});
      });

      //TODO VERIFY
      //Set up callback that handles disconnection
      session.on("sessionDisconnected", function(event) {

        // access to disconnected session: event.target

        //TODO Change broadcast so it manages when video call is
        //changed for another one
        // $rootScope.$broadcast('stream-destroyed', {sessionId:event.target.sessionId});
      });

      //Try and connect to the session
      session.connect(stream.webClientToken, function(error){
        if(!!error){
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
        var onLoad = function(reader, deferred, scope) {
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

        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };

        var getReader = function(deferred, scope) {
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

  //Service for managing the most wanted list. It can save, add
  //or delete most wanted people to/from Parse
  app.factory("MostWantedService", ['Session', '$rootScope', 'errorFactory',
  function(Session, $rootScope, errorFactory){
    var mostWantedService =  {};
    var mostWantedArray = [];
    var clientParseObj;

    //Request must wanted list from Parse
    mostWantedService.fetchMostWantedList = function() {

      //Request and receive the most wanted list
      // var clientId = Session.clientId;
      var Client = Parse.Object.extend("Client");
      var clientQuery = new Parse.Query(Client);
      clientQuery.include('mostWantedList');
      clientQuery.get(Session.clientId, {
        success: function(client){
          clientParseObj = client;
          mostWantedArray = client.get('mostWantedList');
          $rootScope.$broadcast('MostWantedList', mostWantedArray);
        },
        error: function(object, error){
          console.log("Error fetching most-wanted list.");
        }
      });

      return mostWantedArray;
    };

    //Save one most wanted person, whether
    //it is a new one or an old one
    mostWantedService.saveMostWanted = function(person, index) {

      if (!person.attributes.name){
        //TODO show 'must have a name' error MOST-WANTED-NO-DATA
        errorFactory.showError('MOST-WANTED-NO-NAME');
        return;
      }

      var wantedPerson;
      if (index < 0) {
        var MostWanted = Parse.Object.extend("MostWanted");
        wantedPerson = new MostWanted();
      }
      else{
        wantedPerson = mostWantedArray[index];
      }
      wantedPerson.set("age", person.attributes.age);
      wantedPerson.set("alias", person.attributes.alias);
      wantedPerson.set("birthdate", person.attributes.birthdate);
      wantedPerson.set("characteristics", person.attributes.characteristics);
      wantedPerson.set("eyeColor", person.attributes.eyeColor);
      wantedPerson.set("hairColor", person.attributes.hairColor);
      wantedPerson.set("height", person.attributes.height);
      wantedPerson.set("name", person.attributes.name);
      wantedPerson.set("race", person.attributes.race);
      wantedPerson.set("summary", person.attributes.summary);
      wantedPerson.set("weight", person.attributes.weight);
      wantedPerson.set("photo", person.attributes.photo);

      wantedPerson.save(null, {
        success: function(wantedPerson) {
          // Execute any logic that should take place after the object is saved.
          // alert('New object created with objectId: ' + wantedPerson.id);

          //Add the wanted person to the array in the client object
          //and save in parse
          if(index < 0) {
            clientParseObj.add("mostWantedList", {
              __type: "Pointer",
              className: "MostWanted",
              objectId: wantedPerson.id
            });
            clientParseObj.save();
            mostWantedArray.push(wantedPerson);
            $rootScope.$broadcast('MostWantedList', mostWantedArray);
          }
          else {
            clientParseObj.save();
            $rootScope.$broadcast('UpdateMostWanted', [mostWantedArray[index], index]);
          }
        },
        error: function(wantedPerson, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          alert('Failed to create new object, with error code: ' + error.message);
        }
      });

      return;
    };

    //Delete a most wanted from parse
    mostWantedService.deleteMostWanted = function(index){
      var wantedPerson = mostWantedArray[index];
      return wantedPerson.destroy({
        success: function(deletedPerson) {
          //Do something with the deleted object?
          clientParseObj.remove("mostWantedList", {
            __type: "Pointer",
            className: "MostWanted",
            objectId: deletedPerson.id
          });
          clientParseObj.save();
          mostWantedArray.splice(index, 1);
        },
        error: function(object, error) {
          //Delete failed, do something about it?
          alert("Explotó esto!!!");
        }
      });
    };

    return mostWantedService;
  }]);

  //Controller which assigns to its $scope
  //all controls necessary for user management;
  //created at body tag so all other $scopes can
  //inherit from its $scope
  app.controller('ApplicationController', ['usSpinnerService', '$rootScope', '$scope','USER_ROLES', 'AUTH_EVENTS','authenticator', 'Session',
  function(usSpinnerService, $rootScope, $scope, USER_ROLES, AUTH_EVENTS, authenticator, Session){
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
    $scope.$on(AUTH_EVENTS.loginSuccess, function(event, data){
      controllerScope.setCurrentUser(data[0]);
      controllerScope.setCurrentClient(data[1], data[2]);
    });
  }]);

  //Controller for login dialog and login
  //landing page
  app.controller('LoginController', ['$state', '$rootScope', '$scope', 'authenticator', 'AUTH_EVENTS', 'Session', 'errorFactory', '$state',
  function($state, $rootScope, $scope, authenticator, AUTH_EVENTS, Session, errorFactory, $state){

    var loginCtrl = this;

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
    this.login = function(){

      //No username/id entered, throw error
      if(!this.credentials.userId){
        errorFactory.showError('LOGIN-NO-USERID');
        return;
      }
      //No password entered, throw error
      if(!this.credentials.password){
        errorFactory.showError('LOGIN-NO-PASS');
        return;
      }

      //Trying to log in; show spinner (loading icon)
      this.submitting = true;

      //Try and log in
      authenticator.login(this.credentials).then(
        function(response){
          var user = response.data[0];
          var client = response.data[1];
          var regions = response.data[2];
          //Login was successful, create Session
          Session.create(user.objectId, user.roles, client.objectId, regions);
          Session.store(user, client);
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, [user, client, regions]);
          loginCtrl.submitting = false;
          $scope.closeThisDialog();

        },
        function(error){
          //Login failed; //Stop Spinner
          errorFactory.showError('LOGIN-'+error.data.code);
          loginCtrl.submitting = false;
        }
      );
    };

  }]);

  //Controller for the header; contains a button
  //that triggers drawer element when clicked
  app.controller('HeaderController', ['snapRemote', '$state', 'Session', '$window', function(snapRemote, $state, Session, $window){

    //Reveals (opens) the drawer by sliding
    //snap-content (main page view) to the right
    this.openDrawer = function(){
      snapRemote.open("left");
    };
    this.logOut = function() {
      Session.destroy();
      $window.location.reload();
    };
  }]);

  //Controller for the drawer, which hides/shows
  //on button click contains navigation options
  app.controller('DrawerController', ['$scope', '$rootScope', 'snapRemote', '$state', 'socket', 'Session', function($scope, $rootScope, snapRemote, $state, socket, Session) {
    var drawer = this;
    this.newTips = 0;
    this.isAdmin = Session.userRoles.indexOf('admin')===-1? false : true;


    //Drawer options with name and icon;
    //entries are off by default
    this.entries=[
      {name:'Tip Feed', icon:'glyphicon glyphicon-inbox', state:'tipfeed'},
      {name:'Video Streams', icon:'glyphicon glyphicon-facetime-video', state:'video-streams'},
      {name:'Send Notification', icon:'glyphicon glyphicon-send', state:'regional-notifications'},
      {name:'Maps', icon:'glyphicon glyphicon-map-marker', state:'maps'},
      {name:'Wanted List', icon:'glyphicon glyphicon-list-alt', state:'most-wanted'},
      {name:'Data Analysis', icon:'glyphicon glyphicon-stats', state:'analysis'}
    ];

    //Hides (closes) the drawer by sliding
    //snap-content (main page view) back to the left
    this.closeDrawer = function(){
      snapRemote.close();
    };

    //Navigates/changes/reloads view to the corresponding state (page)
    this.changeState = function(state){
      if(state==="tipfeed"){
        drawer.newTips = 0;
      }
      $state.go(state, {newTips:0}, {reload:true});
    };

    socket.on('new-tip', function(data){
      if(data.clientId===Session.clientId){
        drawer.newTips++;
        $scope.$apply();
      } 
    });

  }]);

  //Controller for VideStreams route; controls
  //the video streams view, which contains queue,
  //current video, chat with current mobile client,
  //information on current call and all other controls
  //to swap video calls
  app.controller('VideoStreamsController', ['$scope', 'socket', 'VideoStreamsService', function($scope, socket, VideoStreamsService){
    var vidStrmCtrl = this;
    this.queue = [];
    this.currentStream ={};

    VideoStreamsService.getActiveStreams($scope.currentClient.objectId);

    VideoStreamsService.checkActiveStream();

    $scope.$on('active-streams-fetched', function(event, data){
      vidStrmCtrl.queue = data;
      vidStrmCtrl.currentStream = data[0];
      $scope.$apply();
    });

    socket.on('new-video-stream', function(data){
      var stream = data.stream;
      vidStrmCtrl.queue.unshift(stream);
    });

    $scope.$on('stream-destroyed', function(event, data){
      for(var i = 0; i < vidStrmCtrl.queue.length; i++){
        var stream = vidStrmCtrl.queue[i];
        if(stream.sessionId === data.sessionId){
          vidStrmCtrl.queue.splice(i, 1);
          break;
        }
      }
      $scope.$apply();
    });

    // $scope.$on('stream-already-connected', function(event){
    //   $scope.$apply();
    // });

    vidStrmCtrl.activateStream = function(stream){
      this.currentStream = stream;
      VideoStreamsService.subscribeToStream(stream, $scope.currentUser);
    };

    vidStrmCtrl.stopStream = function(){
      VideoStreamsService.stopStream();
    };

  }]);

  //Controller for tipfeed route; handles the tip feed
  //which lets you interact with tips, depends heavily
  //on paginatorService
  app.controller('TipFeedController', ['$scope', 'socket', 'ngDialog', 'paginatorService', 'usSpinnerService', '$location', '$anchorScroll',
  function($scope, socket, ngDialog, paginatorService, usSpinnerService, $location, $anchorScroll){

    //Vars needed for pagination; paginatorSet contains
    //number of total pages, divided by groups of 10
    var tipfeed = this;
    this.tipsAvailable = true;
    this.currentTips = [];
    this.currentPage = paginator.currentPage;
    this.lastPage = paginator.lastPage;
    this.paginatorSet = paginator.paginatorSet;
    this.showMediaSpinner = false;

    //Set scroll position to top
    //when pages change
    $location.hash('top');

    //Notification and Attachment
    //dialogs are off by default
    this.notificationDialogIsOn = false;
    this.attachmentDialogIsOn = false;

    //Get tips on page load/refresh
    paginatorService.initializeFeed();

    //No tips available; hide paginator and
    //feed and display appropiate text
    $scope.$on('no-tips', function(event){
      tipfeed.tipsAvailable = false;
    });

    //Stop tipfeed spinner
    $scope.$on('hide-spinner', function(event){
      usSpinnerService.stop('loading-tips-spinner');
      tipfeed.showPaginator = true;
    });

    //Catch event when paginator has new tips
    $scope.$on('new-batch', function(event, data){
      //Change current tips being displayed
      //and current page
      tipfeed.currentTips = data[0];
      tipfeed.currentPage = data[1];
    });

    //Catch event when page sets change (every 10 pages)
    $scope.$on('paginator-set-update', function(event, data){
      tipfeed.paginatorSet = data[0];
      tipfeed.lastPage = data[1];
    });

    //Catch event when paginator Service is fetching
    //new tips; discard current shown tips
    $scope.$on('discard-current-tips', function(){
      tipfeed.currentTips = [];
      usSpinnerService.spin('loading-tips-spinner');
      tipfeed.showPaginator = false;
    });

    //Note that notification dialog is off
    $scope.$on('notification-dialog-closed', function(event, data){
      tipfeed.notificationDialogIsOn = false;
    });

    //Note that attachment dialog is off
    $scope.$on('attachment-dialog-closed', function(event, data){
      tipfeed.attachmentDialogIsOn = false;
    });

    //Change page to passed value;
    //scroll to top
    this.changePage = function(newPage){
      paginatorService.changePage(newPage);
      $anchorScroll();
    };

    //Change to next page;
    //scroll to top
    this.nextPage = function(){
      paginatorService.nextPage();
      $anchorScroll();
    };

    //Change to previous page;
    //scroll to top
    this.prevPage = function(){
      paginatorService.prevPage();
      $anchorScroll();
    };

    //Shows dialog that allows client to send
    //message and attachment to a specific user
    this.showNotificationDialog = function(firstName, lastName, controlNumber, channel){
      //Only show dialog if it, and attachmentDialog,
      //are not showing
      if(!this.notificationDialogIsOn && !this.attachmentDialogIsOn){
        //ngDialog can only handle stringified JSONs
        var data = JSON.stringify({
          name: firstName+" "+lastName,
          controlNumber: controlNumber,
          channel:channel
        });

        //Open dialog, and add it to the $scope
        //so it can identify itself once open
        $scope.notificationDialog = ngDialog.open({
          template: '../notification-dialog.html',
          className: 'ngdialog-theme-plain',
          closeByDocument: false,
          closeByEscape: false,
          scope: $scope,
          data:data
        });

        //NotificationDialog is now showing
        this.notificationDialogIsOn = true;
      }
    };

    //Shows dialog that contains attachment which
    //triggered it; video, image or audio
    this.showAttachmentDialog = function(tip, type) {

      this.attachmentType = type;

      //Only show dialog if it, and notificationDialog,
      //are not showing
      if(!this.notificationDialogIsOn && !this.attachmentDialogIsOn){

        this.showMediaSpinner = true;
        usSpinnerService.spin('loading-media-spinner');
        var parseFile;
        if(type === 'IMG') {
          parseFile = tip.attachmentPhoto;
        }
        else if (type === 'VID') {
          parseFile = tip.attachmentVideo;
        }
        else {
          parseFile = tip.attachmentAudio;
        }


        //Request decrypted media url
        socket.emit('request-media-url', {
          parseFile:parseFile,
          passPhrase:tip.anonymous? tip.anonymousPassword: tip.username,
          anonymous:tip.anonymous,
          type:type
        });

        //Receive url
        socket.on('response-media-url', function(address){

          if(tipfeed.attachmentDialogIsOn) {
            return;
          }

          usSpinnerService.stop('loading-media-spinner');
          tipfeed.showMediaSpinner = false;

          //ngDialog can only handle stringified JSONs
          var data = JSON.stringify({
            attachmentType:tipfeed.attachmentType,
            address: address
          });

          //If attachment is an audio file,
          //don't show close control (X)
          var showClose = tipfeed.attachmentType !== 'AUDIO';

          //Open dialog and pass control to AttachmentController
          $scope.attachmentDialog = ngDialog.open({
            template: '../attachment-dialog.html',
            className: 'ngdialog-attachment',
            showClose: showClose,
            scope: $scope,
            data:data
          });

          //Attachment dialog is now showing
          tipfeed.attachmentDialogIsOn = true;
        });
      }
    };
  }]);

  //Controller for the tip's attachments; must display
  //video and images, and play audio files
  app.controller('AttachmentController', ['$scope', '$rootScope', 'ngDialog', '$sce', 'socket', 'usSpinnerService',
  function($scope, $rootScope, ngDialog, $sce, socket, usSpinnerService){
    //Needed so that attachment-dialog.html can open the media files from parse.
    this.trustAsResourceUrl = $sce.trustAsResourceUrl;
    this.address = $scope.$parent.ngDialogData.address;
    this.attachType = $scope.$parent.ngDialogData.attachmentType;
    var thisDialogId = $scope.$parent.attachmentDialog.id;

    //Let TipFeed controller know this dialog turned off
    $scope.$on('ngDialog.closed', function (event, $dialog) {
      if(thisDialogId===$dialog.attr('id')){
        $rootScope.$broadcast('attachment-dialog-closed');
      }
    });
  }]);

  //Controller for Google map in the maps state;
  //sets map center and police station position
  //in map
  app.controller('GoogleMapController', function() {

    //This position variables will store the position
    //data so that the tip.center variable remain unchanged.
    var markerPosition = {latitude: 0, longitude: 0};
    var mapCenter = {latitude: 0, longitude: 0};
    var markerKey = 0;
    this.zoom = 14;

    this.icon = {
      url: 'resources/images/custom-marker.png',
      // This marker is 25 pixels wide by 39 pixels tall.
      scaledSize: new google.maps.Size(25, 39),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole.
      anchor: new google.maps.Point(12.5,39)
    };

    //Checks if the marker coordinates have changed
    //and returns the correct position.
    this.getMarkerPosition = function(point) {

      if(point===undefined){
        return markerPosition;
      }
      //Change the position if necessary.
      if(markerPosition.latitude !== point.latitude || markerPosition.longitude !== point.longitude) {
        this.zoom = 14;
        markerPosition.latitude = point.latitude;
        markerPosition.longitude = point.longitude;
      }

      return markerPosition;
    };

    //Checks if the map center coordinates have changed
    // and returns the correct position.
    this.getMapCenter = function(point) {

      if(point===undefined || point.latitude===undefined || point.longitude===undefined){
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
    this.getMarkerIdKey = function(key, currentPage, index) {
      markerKey++;
      return "key"+key+markerKey;
    };
  });

  //Controller for user follow-up notification; controls the
  //dialog that allows for message/attachment to be sent to users
  app.controller('NotificationController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory', 'socket',
  function($rootScope, $scope, parseNotificationService, ngDialog, errorFactory, socket){
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
      if(thisDialogId===$dialog.attr('id')){
        document.getElementById("notification-message").focus();
      }
    });

    //Let TipFeed controller know this dialog turned off
    $scope.$on('ngDialog.closed', function (event, $dialog) {
      if(thisDialogId===$dialog.attr('id')){
        $rootScope.$broadcast('notification-dialog-closed');
      }
    });

    //Notification was successfully saved and pushed (sent)
    $scope.$on('notification-success',function(notification){
      notificationCtrl.sending = false;
      $scope.$apply();
      $scope.closeThisDialog();
    });

    //Notification was saved, but not pushed
    $scope.$on('notification-partial-success',function(notification){
      //Right now same as success event, but might change
      notificationCtrl.sending = false;
      $scope.$apply();
      $scope.closeThisDialog();
    });

    //Notification either wasn't saved, or did save
    //but push failed and error clause removed said save
    $scope.$on('notification-error',function(notification){
      errorFactory.showError('NOTIF-FAILED');
      notificationCtrl.sending = false;
      $scope.$apply();
    });

    socket.on('follow-up-notif-sent', function(data){
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
    this.submitNotification = function(){

      //If no title, show appropiate error and ignore
      if(!this.title){
        errorFactory.showError('NOTIF-NO-TITLE');
        return;
      }
      //If no message or attachment, show appropiate error and ignore
      if(!this.message){
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
      if(this.file){
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

  }]);

  //Controller for user follow-up notification; controls the
  //dialog that allows for message/attachment to be sent to users
  app.controller('RegionalNotificationController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory',
  function($rootScope, $scope, parseNotificationService, ngDialog, errorFactory){

    this.sending = false;
    this.regions = $scope.currentRegions;
    this.allRegions = false;
    var regionalNotificationCtrl = this;

    //Once a file is selected, prep file for upload to Parse
    this.onFileSelect = function($files){
      //Fetch file
      this.file = $files[0];

      //Set file type
      if(this.file.type.match('image.*')){
        this.fileType = "image";
      }
      else if(this.file.type.match('video.*')){
        this.fileType = "video";
      }
      else{
        this.fileType = "audio";
      }
      //Set file name
      this.fileLabel = this.file.name
    };

    //Send the notification to the user
    this.submitNotification = function(){
      //If no title, show appropiate error and ignore
      if(!this.title){
        errorFactory.showError('REGIONAL-NOTIF-NO-TITLE');
        return;
      }
      //If no message or attachment, show appropiate error and ignore
      if(!this.message){
        errorFactory.showError('REGIONAL-NOTIF-NO-MESSAGE');
        return;
      }

      if(this.allRegions){
        parseNotificationService.channels.push($scope.$parent.currentClient.objectId);
      }
      else{
        for(var i=0; i<this.regions.length;i++){
          if(!!this.regions[i].selected){
            for(var j=0; j< this.regions[i].zipCodes.length;j++){
              parseNotificationService.channels.push($scope.$parent.currentClient.objectId+"_"+this.regions[i].zipCodes[j]);
            }
          }
        }
      }

      if(parseNotificationService.channels.length==0){
        errorFactory.showError('REGIONAL-NOTIF-NO-REGION');
        return;
      }

      this.sending = true;

      //Prepare notification
      var notification = {};
      notification.title = this.title;
      notification.message = this.message;
      //If a file is present, attach it and set its type
      if(this.file){
        notification.attachment = new Parse.File("attachment", this.file);
        notification.attachmentType = this.fileType;
      }

      //Create Parse notification and send it
      var parseNotification = parseNotificationService.newRegionalNotification(notification);
      parseNotificationService.saveAndPushNotification(parseNotification);
    };

    //Notification was successfully saved and pushed (sent)
    $scope.$on('regional-notification-success',function(notification){
      regionalNotificationCtrl.sending = false;
      $scope.$apply();
    });

    //Notification was saved, but not pushed
    $scope.$on('regional-notification-partial-success',function(notification){
      //Right now same as success event, but might change
      regionalNotificationCtrl.sending = false;
      $scope.$apply();
    });

    //Notification either wasn't saved, or did save
    //but push failed and error clause removed said save
    $scope.$on('regional-notification-error',function(notification){
      errorFactory.showError('NOTIF-FAILED');
      regionalNotificationCtrl.sending = false;
      $scope.$apply();
    });

  }]);

  //Controller for error dialog which is reusable throughout the
  //app; decoupled from everything else
  app.controller('ErrorController', ['$scope', 'ERRORS', 'errorFactory',
  function($scope, ERRORS, errorFactory){
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

  }]);

  //Controller for the Most-Wanted state
  app.controller('MostWantedController', ['MostWantedService', '$scope', 'fileReader', 'ngDialog',
  function(MostWantedService, $scope, fileReader, ngDialog){

    var MostWantedCtrl = this;
    this.wantedArray = [];
    this.parseArrayLength = 0;
    this.disableNewButton = false;
    this.editedPeopleIndices = [];

    //Request most wanted list from Parse
    MostWantedService.fetchMostWantedList();

    //Once a file is selected, prep file for upload to Parse
    //Used for attaching files to a most-wanted person
    this.onFileSelect = function($files, index){
      //Fetch file
      var file = $files[0];
      var mostWanted = MostWantedCtrl.wantedArray[index];

      fileReader.readAsDataUrl(file, $scope)
                      .then(function(result) {
                          mostWanted.attributes.photoUrl =  result;
                          MostWantedCtrl.editedPeopleIndices[index] = true;
                      });

      mostWanted.attributes.photo = new Parse.File(file.name, file);
    };

    //Add new wanted to the controller array. Must
    //use 'save' function to save to Parse
    this.add = function() {
      this.wantedArray.push({ attributes:{} });
      this.disableNewButton = true;
    };

    //Save new most wanted, or update an old one,
    //to Parse
    this.save = function(index) {
      //Check if it is a new most wanted
      if(index === this.parseArrayLength) {
        MostWantedService.saveMostWanted(this.wantedArray[index], -1);
      }
      else {
        MostWantedService.saveMostWanted(this.wantedArray[index], index);
      }
    };

    //Delete most wanted from local array and from
    //Parse
    this.delete = function(index) {
      MostWantedService.deleteMostWanted(index).then(function(result) {
          MostWantedCtrl.wantedArray.splice(index, 1);
          MostWantedCtrl.parseArrayLength--;
          MostWantedCtrl.editedPeopleIndices.splice(index, 1);
          $scope.$apply();
      });
    };

    //Enables the Save button if a change on an input
    //field is detected
    this.onChange = function (index) {
      this.editedPeopleIndices[index] = true;
    };

    //Dialog to confirm if the user really wants to
    //delete the most wanted from the list
    this.showConfirmDialog = function (index) {
      this.aboutToDeleteName = this.wantedArray[index].attributes.firstName;
      ngDialog.openConfirm({
        template: '../most-wanted-confirm-dialog.html',
        className: 'ngdialog-theme-plain',
        scope: $scope
      }).then(function(){
        MostWantedCtrl.delete(index);
      });
    };

    //Receive the most wanted list from the Most Wanted
    //service
    $scope.$on('MostWantedList', function(event, data){
      for (var i = 0; i < data.length; i++) {
        MostWantedCtrl.wantedArray[i] = data[i];
      }

      MostWantedCtrl.disableNewButton = false;
      MostWantedCtrl.editedPeopleIndices[data.length-1] = false;
      MostWantedCtrl.parseArrayLength = data.length;
      $scope.$apply();
    });

    //Update the info of one of the most wanted
    $scope.$on('UpdateMostWanted', function(event, data){
      var updatedMostWanted = data[0];
      var index = data[1];
      MostWantedCtrl.editedPeopleIndices[index] = false;
      MostWantedCtrl.wantedArray[index] = updatedMostWanted;
      $scope.$apply();
    });

  }]);

  //Service for managing the most wanted list. It can save, add
  //or delete most wanted people to/from Parse
  app.factory("PoliceStationsService", ['$rootScope', 'Session',
  function($rootScope, Session){
    var PoliceStationsService =  {};

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
    PoliceStationsService.getStationsMarkers = function(editedMarkerId) {
      stationsMarkers = [];
      var PoliceMap = Parse.Object.extend("PoliceMap");
      var query = new Parse.Query(PoliceMap);
      //Filter by clientId
      query.equalTo('client', {
        __type: "Pointer",
        className: "Client",
        objectId: Session.clientId
      });
      query.find({
        success: function(results){

          //Create markers for each station.
          for (var i = 0; i<results.length; i++) {
            var station = results[i];

            // Create a marker for each place.
            var marker = {
              id:station.id,
              place_id: station.attributes.placeId,
              latitude: station.attributes.latitude,
              longitude: station.attributes.longitude,
              name: station.attributes.stationName,
              address: station.attributes.address,
              email: station.attributes.email,
              phone: station.attributes.phone,
              description: station.attributes.description,
              options: {
                draggable: false,
                title: station.attributes.stationName,
                visible: true
              },
              templateurl:'window.tpl.html',
              show: editedMarkerId === station.id
            };
            marker.onClick = function() {
                marker.show = !marker.show;
            };
            stationsMarkers.push(marker);
          }

          //Send new markers to the controller.
          $rootScope.$broadcast('stations-markers-fetched', stationsMarkers);

        },
        error: function(error){
          console.log("Error receiving police stations from parse. " + error.message);
        }
      });
    };

    //Return the desired marker contained in the array.
    PoliceStationsService.getMarker = function(id) {
      for (var i = 0; i < stationsMarkers.length; i++) {
        if(stationsMarkers[i].id === id)
          return stationsMarkers[i];
      }
    };

    //Changes the station info in Parse after user saves the edited station
    PoliceStationsService.updateStationInfo = function(stationInfo) {
      var PoliceMap = Parse.Object.extend("PoliceMap");
      var query = new Parse.Query(PoliceMap);
      query.get(stationInfo.id, {
        success: function(station){
          PoliceStationsService.saveStation(stationInfo, station);
        },
        error: function(station, error){
          console.log("Error fetching police station");
        }
      });
    };

    //Add temporary marker.
    PoliceStationsService.addMarker = function(marker) {
      stationsMarkers.push(marker);
      $rootScope.$broadcast('stations-markers-fetched', stationsMarkers);
    };

    //Cancels the addition of a new station. Removes the temp marker.
    PoliceStationsService.cancel = function() {
      stationsMarkers.pop();
      PoliceStationsService.isAdding = false;
      $rootScope.$broadcast('stations-markers-fetched', stationsMarkers);
    };

    //Save new station to Parse or update a station in parse if the
    //station object is not undefined.
    PoliceStationsService.saveStation = function(stationInfo, station) {
      PoliceStationsService.isAdding = false;

      //If station object isn't received, a new station object is created.
      if(!station) {
        var PoliceMap = Parse.Object.extend("PoliceMap");
        station = new PoliceMap();
        station.set("latitude", PoliceStationsService.getTempMarker().latitude);
        station.set("longitude", PoliceStationsService.getTempMarker().longitude);
        station.set("coordinates", new Parse.GeoPoint({latitude: PoliceStationsService.getTempMarker().latitude, longitude: PoliceStationsService.getTempMarker().longitude}))
        station.set("client", {
          __type: "Pointer",
          className: "Client",
          objectId: Session.clientId
        });
      }

      station.set("stationName", stationInfo.name);
      station.set("address", stationInfo.address);
      station.set("phone", stationInfo.phone);
      station.set("description", stationInfo.description);
      station.set("email", stationInfo.email);
      station.save(null, {
        success: function(station) {
          // Execute any logic that should take place after the object is saved.
          PoliceStationsService.getStationsMarkers(station.id);
        },
        error: function(station, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and message.
          console.log('Failed to create/update  Police Station on Parse. Error: ' + error.message);
        }
      });
    };

    //Return the temp marker.
    PoliceStationsService.getTempMarker = function() {
      return stationsMarkers[stationsMarkers.length-1];
    };

    //Remove the temp marker and update the map.
    PoliceStationsService.removeTempMarker = function() {
      stationsMarkers.splice(stationsMarkers.length-1, 1);
      $rootScope.$broadcast('stations-markers-fetched', stationsMarkers);
    };

    //Delete a station from Parse.
    PoliceStationsService.deleteStation = function(id) {
      var PoliceMap = Parse.Object.extend("PoliceMap");
      var query = new Parse.Query(PoliceMap);
      query.get(id, {
        success: function(station){
          station.destroy({
            success: function(myObject) {
              PoliceStationsService.getStationsMarkers();
            },
            error: function(myObject, error) {
              // The delete failed.
              // error is a Parse.Error with an error code and message.
            }
          });
        },
        error: function(station, error){
          console.log("Error fetching police station");
        }
      });
    };

    return PoliceStationsService;
  }]);

  //Controller for Google map in the 'Maps' state.
  app.controller('PoliceStationsMapController', ['PoliceStationsService', '$scope', 'Session', function(PoliceStationsService, $scope, Session) {

    var mapCtrl = this;

    //Hack to avoid google-map directive bug when updating
    //marker's window.
    mapCtrl.redrawMarkers = function() {
      return PoliceStationsService.redrawMarkers;
    };

    mapCtrl.map = {
      zoom: 14,
      center: {latitude: 0, longitude: 0},
    };

    //Get region center-location from Parse
    var Client = Parse.Object.extend("Client");
    var clientQuery = new Parse.Query(Client);
    clientQuery.get(Session.clientId, {
      success: function(client){
        if(!!client.attributes.location) {
          mapCtrl.map.center = {latitude: client.attributes.location._latitude, longitude: client.attributes.location._longitude};
        }
      },
      error: function(object, error){
        console.log("Error fetching client: " + error.message);
      }
    });

    PoliceStationsService.map = mapCtrl.map;

    mapCtrl.policeStationsMarkers = [];

    mapCtrl.searchbox = {
      template:'searchbox.tpl.html',
      position:'top-left',
      options: {
        bounds: {}
      },
      events: {
        places_changed: function (searchBox) {
          var places = searchBox.getPlaces()
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
    PoliceStationsService.getStationsMarkers();

    //Checks if an "$scope.$apply" is in progress before
    //starting a new one.
    $scope.safeApply = function(fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };

    //Receive the markers from Parse.
    $scope.$on('stations-markers-fetched', function(event, markers){
      mapCtrl.policeStationsMarkers = markers;
      PoliceStationsService.redrawMarkers = false;
      $scope.safeApply();

    });

    //Check if the user is adding a new station.
    mapCtrl.isAdding = function() {
      return PoliceStationsService.isAdding;
    };

  }]);

  //The buttons on the map need a new controller for themselves.
  //This is it.
  app.controller('AddStationController', ['PoliceStationsService', '$scope', 'ngDialog', function(PoliceStationsService, $scope, ngDialog) {
    var buttonCtrl = this;
    var tempIdNum = 0;

    //Check if the user is adding a new station to
    //enable/disable the buttons.
    buttonCtrl.isAdding = function() {
      return PoliceStationsService.isAdding;
    };

    //Show the dialog to enter station information
    buttonCtrl.showFormDialog = function (data) {
       var loginDialog = ngDialog.open({
        template: '../new-station-form.html',
        className: 'ngdialog-theme-plain',
        closeByDocument: false,
        closeByEscape:false,
        showClose: true,
        scope: $scope,
        data:data
      });
    };

    //Add new temp marker to the map
    buttonCtrl.newStationMarker = function() {
      var marker = {
        id:'temp'+tempIdNum++,
        name: "",
        address: "",
        email: "",
        phone: "",
        description: "",
        latitude: PoliceStationsService.map.center.latitude,
        longitude: PoliceStationsService.map.center.longitude,
        icon: {
          url: './resources/images/marker-icon.png',
          // This marker is 20 pixels wide by 32 pixels tall.
          scaledSize: new google.maps.Size(29, 44),
          // The origin for this image is 0,0.
          origin: new google.maps.Point(0,0),
          // The anchor for this image is the base of the flagpole at 0,32.
          anchor: new google.maps.Point(14.5,44)
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
    buttonCtrl.cancel = function() {
      PoliceStationsService.cancel();
    };

    //Edit station button inside the window of each marker.
    buttonCtrl.editStation = function(id) {
      var marker = PoliceStationsService.getMarker(id);
      var data = JSON.stringify({
        name: marker.name,
        address: marker.address,
        email:marker.email,
        phone:marker.phone,
        description:marker.description,
        id:marker.id
      });
      buttonCtrl.showFormDialog(data);
    };
  }]);

  //Controller for the ngDialog pop-up for editing the station.
  app.controller('StationDialogController', ['PoliceStationsService', '$scope', 'ngDialog', function(PoliceStationsService, $scope, ngDialog) {
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
    dialogCtrl.submit = function() {
      //Do not submit if there is no name entered.
      if(dialogCtrl.station.name==="") {
        // TODO throw NO-NAME error.
        return;
      }

      //Start redraw-markers hack
      PoliceStationsService.redrawMarkers = true;

      //Update edited marker. If the id is defined, means
      //that we are editing a previously saved station.
      if(!!dialogCtrl.station.id) {
        PoliceStationsService.updateStationInfo(dialogCtrl.station);
      }
      //Save new marker
      else {
        PoliceStationsService.saveStation(dialogCtrl.station);
      }
      $scope.closeThisDialog();
    };

    //Delete station
    dialogCtrl.delete = function() {
      PoliceStationsService.deleteStation(dialogCtrl.station.id);
      $scope.closeThisDialog();
    };
  }]);

  //Controller for Administrator Panel
  app.controller('AdminPanelController', ['socket', function(socket){

    //Adds new SentiHelm user
    this.addUser = function(newUser){
      socket.emit('add-new-officer', {newOfficer : newUser});
    };

  }]);

  })();
