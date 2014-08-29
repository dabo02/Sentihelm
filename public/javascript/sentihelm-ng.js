(function(){
  var app = angular.module('sentihelm', ['ui.router','btford.socket-io','google-maps','ngDialog','angularFileUpload']);

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
      }
    })

    //Global notifications endpoint/url
    .state('global-notifications',{
      url:"/global-notifications",
      templateUrl:"/global-notifications.html"
    });
  }]);

  //Initialize values needed throughout the app
  app.run(['$rootScope', 'AUTH_EVENTS', 'authenticator', 'errorFactory', 'ngDialog', function($rootScope, AUTH_EVENTS, authenticator, errorFactory, ngDialog){
    //Initialize Parse
    Parse.initialize("Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE", "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk");

    //Check for user autherization every time page loads
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!authenticator.isAuthorized(authorizedRoles)) {
        //Stop page from loading
        // event.preventDefault();

        //Check if user can access this page
        if (authenticator.isAuthenticated()) {
          //User does not have access to content
          $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
          errorFactory.showError('NO-AUTH');
        }
        else {
          //User is not logged in
          $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

          //Present login dialog for user to log in
          // ngDialog.open({
          //   template: '../login-dialog.html',
          //   className: 'ngdialog-theme-plain',
          //   closeByDocument: false,
          //   closeByEscape:false,
          //   showClose: false
          // });
        }
      }
    });

  }]);

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
    user: 'user',
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
      message: 'Your access level does not allow you to view this page.'+
      'If you believe this is an error, contact your dashboard administrator.',
      code: 'NO-AUTH',
      onClose: function(){
        //Do nothing
        return;
      }
    }
  });

  //Creates a session service that can create
  //and destroy a session which manages (logged in) users
  app.factory('Session', function(){
    //Create a session object, along with id, userId and role
    this.create = function (sessionId, userId, userRole) {
      this.id = sessionId;
      this.userId = userId;
      this.userRole = userRole;
    };

    //Destroy current session object
    this.destroy = function () {
      this.id = null;
      this.userId = null;
      this.userRole = null;
    };

    return this;
  });

  //Creates a service that manages login and
  //authentication functionality; manages current session
  app.factory('authenticator', ['$http', 'Session', function($http, Session){

    var authenticator = {};

    authenticator.login = function(credentials){
      return $http.post('/login', credentials);
    };

    authenticator.isAuthenticated = function () {
      //Return true if userId is set; false otherwise
      return !!Session.userId;
    };

    authenticator.isAuthorized = function (authorizedRoles) {
      //Get roles; if not an array, make one(for when string is passed)
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }

      //Check if user is authenticated and if his role(s)
      //is in the authorized roles for this specific page
      return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authenticator;

  }]);

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
    // var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
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
    parseNotificationService.newNotification = function(notificationData){
      var notification = new PushNotification();
      notification.set("userId", notificationData.userId);
      notification.set("tipId", notificationData.controlNumber);
      notification.set("title", notificationData.title);
      notification.set("message", notificationData.message);
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
          $rootScope.$broadcast('notification-error', [notification, error]);
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
          pushId: notification.id
        }
      },{
        success: function(){
          //Push was successful
          //Reset channels and alert controller
          parseNotificationService.channels = [];
          $rootScope.$broadcast('notification-success', [notification]);
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
          $rootScope.$broadcast('notification-error', [notification, parentError]);
        },
        error: function(notification, error){
          //Failed to delete notification
          //Do Nothing, but alert controller
          //to partial success
          $rootScope.$broadcast('notification-partial-success',[notification]);
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
  app.factory('paginatorService', ['socket', '$rootScope', function(socket, $rootScope){

    //Set up the paginator object
    //Need references to current and last page,
    //array of number of pages paginator will print
    //and size of said array
    var paginator = {};
    paginator.currentTips = [];
    paginator.totalTipCount = 0;
    paginator.currentPage = 0;
    paginator.lastPage = 1;
    paginator.paginatorSet = [];
    paginator.paginatorSetSize = 0;

    //Catch socket.io event when a batch is sent
    //Let controller know news tips arrvied; update
    //amount of total tips in server, last page and paginator set
    socket.on('respond-batch', function(data){
      //TODO CHECK
      $rootScope.$broadcast('new-batch',[data.currentTips]);
      paginator.totalTipCount = data.totalTipCount;
      paginator.lastPage = Math.max(Math.ceil(paginator.totalTipCount/10), 1);
      if(paginator.currentPage===0){
        paginator.pageSetUpdater(paginator.lastPage, false);
      }
    });

    //Catch socket.io event when a tip request
    //failed; manage error accordingly with
    //errorFactory service
    socket.on('respond-error', function(data){
      var error = data.error;
      //TODO MANAGE ERROR
    });

    //Called when tipfeed loads, be it on
    //refresh or navigating to it again
    paginator.initializeFeed = function(){
      //TODO Set Client Id
      paginator.currentPage = 0;
      socket.emit('request-batch', {
        clientId: user,
        isAfterDate: false
      });

      //TODO QUERY TIPS FROM PARSE

      // var Client = Parse.Object.extend("Client");
      // var clientQuery = new Parse.Query(Client);
      // clientQuery.get('YgYS51sK0D',{
      //   success: function(user){
      //     var TipReport = Parse.Object.extend("TipReport");
      //     var query = new Parse.Query(TipReport);
      //     query.equalTo("clientId", {
      //       __type: "Pointer",
      //       className: "Client",
      //       objectId: "YgYS51sK0D"
      //     });
      //     query.find({
      //       success: function(results) {
      //      //Check total tip count for client
      //      var countQuery = new Parse.Query(Sequence);
      //      countQuery.equalTo("clientId", clientId);
      //      countQuery.find({
      //        success: function(countResults){
      //          var count = countResults[0].count;
      //          //Count was successful, emit an event
      //          //with both tips and total tip count
      //          socket.emit('respond-batch', {currentTips : tips, totalTipCount : count});
      //        },
      //        error: function(error){
      //          //Count failed, emit response error
      //          //along with error object
      //          socket.emit('respond-error', {error: error});
      //        }
      //      });
      //    },
      //    error: function(error){
      //      //Tip fetching failed, emit response error
      //      //along with error object
      //      socket.emit('respond-error', {error: error});
      //    }
      //       });
      //
      //   },
      //   error: function(error){
      //     var x = error;
      //   }
      // });
    }

    //Change the page and ask server for tips present in new page;
    //let controller know the page has changed
    paginator.changePage = function(newPage){
      this.currentPage = newPage;
      $rootScope.$broadcast('page-change',[this.currentPage]);
      socket.emit('request-batch', {upperBound: (this.currentPage*10)});
    };

    //Change to previous page; update references
    paginator.prevPage = function(){
      if((this.currentPage-1)%10===0){
        this.pageSetUpdater(this.lastPage, true);
      }
      this.changePage(this.currentPage-=1);
    };

    //Change to next page; update references
    paginator.nextPage = function(){
      this.currentPage = this.currentPage===0 ? this.currentPage+1 : this.currentPage;
      if(this.currentPage%10===0){
        this.pageSetUpdater(this.lastPage - this.currentPage, false);
      }
      this.changePage(this.currentPage+=1);
    };

    //Update paginator set (page numbers that will be printed, every 10 pages)
    paginator.pageSetUpdater = function(setSizeLimit, previousSet){

      //If called from prevPage, gotta set startihg limit to
      //previous 10 pages, otherwise start at current page
      var setValueLimit = previousSet ? this.currentPage-11 : this.currentPage;
      this.paginatorSet = [];
      this.paginatorSetSize = Math.min(10, setSizeLimit);
      for(var i=1; i<=this.paginatorSetSize;i++){
        this.paginatorSet.push(setValueLimit+i);
      }

      //Let controller know the set has changed
      $rootScope.$broadcast('paginator-set-update',[paginator.paginatorSet, paginator.lastPage]);
    }

    return paginator;

  }]);

  //Controller which assigns to its $scope
  //all controls necessary for session control
  //and login functionality; created at body tag
  //so all other $scopes can inherit from
  //its $scope
  app.controller('SessionController', ['$scope','USER_ROLES','authenticator',function($scope, USER_ROLES, authenticator){
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = authenticator.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };

  }]);

  //Controller for login dialog and login
  //landing page
  app.controller('LoginController', ['$scope', 'authenticator', 'Session', 'errorFactory', function($scope, authenticator, Session, errorFactory){

    var loginCtrl = this;

    //Credentials that will be passed to the authenticator service
    this.credentials = {
      username: '',
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
      if(!this.credentials.username){
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
        function(user){
          //Login was successful, create Session
          //and stop spinner
          //TODO
          // Session.create(user.objectId, user.user.id, res.user.role);
          $scope.setCurrentUser(user);
          loginCtrl.submitting = false;
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
  app.controller('HeaderController', ['$rootScope', function($rootScope){
    //Emits event that toggles the drawer directive's view;
    //toggles a boolean value that checks when drawer is active
    this.toggleDrawer = function(){
      $rootScope.$broadcast('toggleDrawer',[this.drawerOn]);
      this.drawerOn=!this.drawerOn;
    };
  }]);

  //Controller for the drawer, which hides/shows
  //on button click contains navigation options
  app.controller('DrawerController', ['$scope', function($scope){
    //The drawer is hidden by default
    this.isOn = false;

    //TODO TESTING
    //this.count = 1;
    //TODO TESTING


    //Drawer options with name and icon;
    //entries are off by default
    this.entries=[
      {name:'Tip Feed', icon:'fa fa-inbox', state:'#/tipfeed'},
      {name:'Video Streams', icon:'fa fa-video-camera', state:'#/streams'},
      {name:'Send Notification', icon:'fa fa-send-o', state:'#/global-notifications'},
      {name:'Maps', icon:'fa fa-globe', state:'#/maps'},
      {name:'Wanted List', icon:'fa fa-warning', state:'#/wanted'},
      {name:'Data Analysis', icon:'fa fa-bar-chart-o', state:'#/analysis'}
    ];

    //Shows/hides drawer on toggled drawer event
    //(emitted from the header directive)
    var drawer = this;
    $scope.$on('toggleDrawer', function(event){
      drawer.isOn = !drawer.isOn;
    });

  }]);

  //Controller for tipfeed route; handles the tip feed
  //which lets you interact with tips, depends heavily
  //on paginatorService
  app.controller('TipFeedController', ['$scope', 'socket', 'ngDialog', 'paginatorService', function($scope, socket, ngDialog, paginatorService){

    //Vars needed for pagination; paginatorSet contains
    //number of total pages, divided by groups of 10
    var tipfeed = this;
    this.currentPage = paginator.currentPage;
    this.lastPage = paginator.lastPage;
    this.paginatorSet = paginator.paginatorSet;

    //Notification and Attachment dialogs are
    //off by default
    this.notificationDialogIsOn = false;
    this.attachmentDialogIsOn = false;

    //Get tips on page load/refresh
    paginatorService.initializeFeed();

    //Catch event when paginator has new tips
    $scope.$on('new-batch', function(event, data){
      tipfeed.currentTips = data[0];
    });

    //Catch even when page changes
    $scope.$on('page-change', function(event, data){
      tipfeed.currentPage = data[0];
    });

    //Catch event when page sets change (every 10 pages)
    $scope.$on('paginator-set-update', function(event, data){
      tipfeed.paginatorSet = data[0];
      tipfeed.lastPage = data[1];
    });

    //Note that notification dialog is off
    $scope.$on('notification-dialog-closed', function(event, data){
      tipfeed.notificationDialogIsOn = false;
    });

    //Note that attachment dialog is off
    $scope.$on('attachment-dialog-closed', function(event, data){
      tipfeed.attachmentDialogIsOn = false;
    });

    //Change page to passed value
    this.changePage = function(newPage){
      paginatorService.changePage(newPage);
    };

    //Change to next page
    this.nextPage = function(){
      paginatorService.nextPage();
    };


    //Change to previous page
    this.prevPage = function(){
      paginatorService.prevPage();
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
    this.showAttachmentDialog = function(address, type) {
      //Only show dialog if it, and notificationDialog,
      //are not showing
      if(!this.notificationDialogIsOn && !this.attachmentDialogIsOn){
        //ngDialog can only handle stringified JSONs
        var data = JSON.stringify({
          address:address,
          attachmentType:type
        });

        var showClose = type !== 'AUDIO';

        //Open dialog and pass control to AttachmentController
        $scope.attachmentDialog = ngDialog.open({
          template: '../attachment-dialog.html',
          className: 'ngdialog-attachment',
          showClose: showClose,
          scope: $scope,
          data:data
        });

        //Attachment dialog is now showing
        this.attachmentDialogIsOn = true;
      }
    };

  }]);

  //Controller for the tip's attachments; must display
  //video and images, and play audio files
  app.controller('AttachmentController', ['$scope', '$rootScope', 'ngDialog', '$sce', function($scope, $rootScope, ngDialog, $sce){
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

  //Controller for Google map in each tip;
  //sets map center and crime position in map
  app.controller('GoogleMapController', function() {

    //This position variables will store the position
    //data so that the tip.center variable remain unchanged.
    var markerPosition = {latitude: 0, longitude: 0};
    var mapCenter = {latitude: 0, longitude: 0};
    this.zoom = 14;
    this.icon = {
      url: 'resources/images/custom-marker.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      scaledSize: new google.maps.Size(25, 39),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
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

      if(point===undefined){
        return mapCenter;
      }
      // Change the coords if necessary.
      if (mapCenter.latitude !== point.latitude || mapCenter.longitude !== point.longitude) {
        mapCenter.latitude = point.latitude;
        mapCenter.longitude = point.longitude;
      }

      return mapCenter;
    };
  });

  //Controller for user follow-up notification; controls the
  //dialog that allows for message/attachment to be sent to users
  app.controller('NotificationController', ['$rootScope', '$scope', 'parseNotificationService', 'ngDialog', 'errorFactory', function($rootScope, $scope, parseNotificationService, ngDialog, errorFactory){
    //Get data from ngDialog directive
    this.name = $scope.$parent.ngDialogData.name;
    this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
    this.channel = $scope.$parent.ngDialogData.channel;
    this.userId = this.channel.substring(5);
    this.sending = false;
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

      //Set the channel where notification will be sent
      parseNotificationService.channels.push(this.channel);

      //Prepare notification
      var notification = {};
      notification.userId = this.userId;
      notification.controlNumber = this.controlNumber;
      notification.title = this.title;
      notification.message = this.message;
      //If a file is present, attach it and set its type
      if(this.file){
        notification.attachment = new Parse.File("attachment", this.file);
        notification.attachmentType = this.fileType;
      }

      //Create Parse notification and send it
      var parseNotification = parseNotificationService.newNotification(notification);
      parseNotificationService.saveAndPushNotification(parseNotification);
    };

  }]);

  //Controller for error dialog which is reusable throughout the
  //app; decoupled from everything else
  app.controller('ErrorController', ['$scope', 'ERRORS', 'errorFactory', function($scope, ERRORS, errorFactory){
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

})();
