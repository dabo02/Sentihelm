(function(){
  var app = angular.module('sentihelm', ['ui.router','btford.socket-io','google-maps','ngDialog','angularFileUpload']);

  //Sets up all the states/routes the app will handle,
  //so as to have a one page app with deep-linking
  app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /tipfeed
    $urlRouterProvider.otherwise("/tipfeed");

    $stateProvider
    //Tipfeed endpoint/url
    .state('tipfeed',{
      url:"/tipfeed",
      templateUrl:"/tipfeed.html"
    })

    .state('maps',{
      url:"/maps",
      templateUrl:"/global-notifications.html"
    })

    //Global notifications endpoint/url
    .state('global-notifications',{
      url:"/global-notifications",
      templateUrl:"/global-notifications.html"
    });
  });

  //Initialize values needed throughout the app
  app.run(function(){
    //Initialize Parse
    Parse.initialize("Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE", "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk");
  });

  //All errors are contained in this constant;
  //used with errorFactory service for easy error
  //alerting
  app.constant('ERROR_CODES',{
    'NOTIF-FAILED': {
      title: 'Push Notification Failed',
      message: 'The notification could not be sent. '+
      'Please try again in a while. If the '+
      'error persists, contact the tech team.'
    },
    'NOTIF-NO-CONTENT':{
      title: 'No Content',
      message: 'You must write a message and/or attach a file.'
    },
    'NOTIF-NO-TITLE':{
      title: 'No Title',
      message: 'The notification must have a title.'
    }
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
    user: 'user',
    admin: 'admin'
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
      var request = $http.post('/login', credentials);
      return request.then(function(result){
        //login was successful
        Session.create(result.id, result.user.id, result.user.role);
        return result.user;
      });
    };

    authenticator.isAuthenticated = function () {
      return !!Session.userId;
    };

    authenticator.isAuthorized = function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }

      return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    };

    return authenticator;

  }]);

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
    var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
    socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

  //Creates an error delivering service that can
  //be called anywhere in the app, be it with
  //pre-made errors fount in ERROR_CODES constant
  //or newly created errors via methods offered
  app.factory('errorFactory', ['ngDialog', '$rootScope', 'ERROR_CODES', function(ngDialog, $rootScope,ERROR_CODES){

    var errorFactory = {};

    //Not being used; might use in future releases to create
    //on-the-fly errors
    errorFactory.newError = function(title, message){
      //TODO
    };

    //Display passed error via ngDialog service
    errorFactory.display = function(error){
      var parsedError = JSON.stringify(error);
      ngDialog.open({
        template: '../error-dialog.html',
        className: 'ngdialog-error',
        closeByDocument: false,
        closeByEscape:false,
        data:parsedError
      });
    };

    //Show pre-made, constant errors with display function
    errorFactory.showErrorWithCode = function(errorCode){
      var error = ERROR_CODES[errorCode];
      errorFactory.display(error);
    };

    return errorFactory;
  }]);

  //Creates a notification service that constructs
  //Parse notifications and provides methods to
  //save and push those notifications to different channels
  app.factory('parseNotificationService', ['$rootScope', function($rootScope){

    //Needed to create Parse notifications
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

    //Saves the Parse Notification; once successful, calls
    //pushNotification() so notification can be sent to user,
    //otherwise alerts controller about failure
    parseNotificationService.saveAndPushNotification = function(notification){
      //Try and save the notification to parse, for future viewing
      notification.save(null, {
        success: function(notification){
          //Notification saved, now push to user
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

    //Sends the already saved notification to the user;
    //if pushing failed, reverts save or continues as partial success
    parseNotificationService.pushNotification = function(notification){
      //Send notification
      Parse.Push.send({
        channels: parseNotificationService.channels,
        data: {
          alert: notification.message,
          badge:"Increment",
          sound: "cheering.caf",
          title: notification.title,
          pushId: notification.id
        }
      },{
        success: function(){
          //Push was successful
          //Reset channels and alert controller
          parseNotificationService.channels = [];
          $rootScope.$broadcast('notification-success',[notification]);
        },
        error: function(error){
          //Push was unsuccessful
          //Try and nuke notification
          var parentError = error;
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

          //Reset channels
          parseNotificationService.channels = [];
        }
      });
    };

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

    //Get first batch of tips
    socket.emit('request-batch', {upperBound: (10)});

    //Catch socket.io event when a batch is sent
    //Let controller know news tips arrvied; update
    //amount of total tips in server, last page and paginator set
    socket.on('respond-batch', function(data){
      $rootScope.$broadcast('new-batch',[data.currentTips]);
      paginator.totalTipCount = data.totalTipCount;
      paginator.lastPage = Math.max(Math.ceil(paginator.totalTipCount/10), 1);
      if(paginator.currentPage===0){
        paginator.pageSetUpdater(paginator.lastPage);
      }
    });

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

  //Creates the header element,
  //along with all its functionality
  app.directive('header', ['$rootScope', function(){
    return{
      restrict:'E',
      templateUrl:'header.html',

      controller: function($rootScope){
        //Icon for drawer button and page logo
        this.drawerOn = false;
        this.drawerButton = 'fa fa-reorder fa-lg';
        this.logo = '../resources/images/sentihelm.png';

        //Emits event that toggles the drawer directive's view;
        //toggles a boolean value that checks when drawer is active
        this.toggleDrawer = function(){
          $rootScope.$broadcast('toggleDrawer',[this.drawerOn]);
          this.drawerOn=!this.drawerOn;
        }
      },

      controllerAs:'header'
    };
  }]);

  //Creates the drawer element,
  //along with all its functionality
  app.directive('drawer', function(){
    return{
      restrict:'E',
      templateUrl:'drawer.html',

      controller: function($scope){
        //Drawer options with name and icon;
        //entries are off by default
        this.entries=[
          {name:'Tip Feed', icon:'fa fa-inbox', state:'tipfeed'},
          {name:'Video Streams', icon:'fa fa-video-camera', state:'streams'},
          {name:'Send Notification', icon:'fa fa-send-o', state:'global-notifications'},
          {name:'Maps', icon:'fa fa-globe', state:'maps'},
          {name:'Wanted List', icon:'fa fa-warning', state:'wanted'},
          {name:'Data Analysis', icon:'fa fa-bar-chart-o', state:'analysis'}
        ];

        this.entriesOn = false;

        //Shows/hides drawer on toggled drawer event
        //(emitted from the header directive)
        var drawer = this;
        $scope.$on('toggleDrawer', function(event, drawerOn){
          if(drawerOn[0]){
            drawer.entriesOn = false;
            drawer.style={'width':'3%'};
          }
          else{
            drawer.entriesOn = true;
            drawer.style={'width':'15%'};
          }
        });
      },

      controllerAs: 'drawer'
    };
  });

  app.controller('SessionController', ['$scope','USER_ROLES','authenticator',function($scope, USER_ROLES, authenticator){
    $scope.currentUser = null;
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = authenticator.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };

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
    this.showDialog = function(firstName, lastName, controlNumber, channel){
      //ngDialog can only handle stringified JSONs
      var data = JSON.stringify({
        name: firstName+" "+lastName,
        controlNumber: controlNumber,
        channel:channel
      });

      //Open dialog and pass control to NotificationController
      $scope.notificationDialog = ngDialog.open({
        template: '../notification-dialog.html',
        className: 'ngdialog-theme-plain',
        closeByDocument: false,
        data:data
      });
    };

    this.showAttachment = function(address, type) {
      //ngDialog can only handle stringified JSONs
      var data = JSON.stringify({
        address:address,
        attachmentType:type
      });

      //Open dialog and pass control to AttachmentController
      ngDialog.open({
        template: '../attachment-dialog.html',
        className: 'ngdialog-attachment',
        data:data
      });
    };
  }]);

  //Controller for the tip's attachments; must display
  //video and images, and play audio files
  app.controller('AttachmentController', ['$scope', 'ngDialog', '$sce', function($scope, ngDialog, $sce){
    //Needed so that attachment-dialog.html can open the media files from parse.
    this.trustAsResourceUrl = $sce.trustAsResourceUrl;
    this.address = $scope.$parent.ngDialogData.address;
    this.attachType = $scope.$parent.ngDialogData.attachmentType;
  }]);

  //Controller for Google map in each tip;
  //sets map center and crime position in map
  app.controller('GoogleMapController', function() {

    //This position variables will store the position
    //data so that the tip.center variable remain unchanged.
    var markerPosition = {latitude: 0, longitude: 0};
    var mapCenter = {latitude: 0, longitude: 0};
    this.zoom = 14;

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
  app.controller('NotificationController', ['$scope', 'parseNotificationService', 'ngDialog', 'errorFactory', function($scope, parseNotificationService, ngDialog, errorFactory){

    //Get data from ngDialog directive
    this.name = $scope.$parent.ngDialogData.name;
    this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
    this.channel = $scope.$parent.ngDialogData.channel;
    this.userId = this.channel.substring(5);
    this.sending = false;
    var notificationCtrl = this;

    //Set focus on message box once dialog pops up
    $scope.$on('ngDialog.opened', function (event, $dialog) {
      document.getElementById("notification-message").focus();
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
      errorFactory.showErrorWithCode('NOTIF-FAILED');
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
        errorFactory.showErrorWithCode('NOTIF-NO-TITLE');
        return;
      }
      //If no message or attachment, show appropiate error and ignore
      if(!this.message && !this.file){
        errorFactory.showErrorWithCode('NOTIF-NO-CONTENT');
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
  app.controller('ErrorController', ['$scope', function($scope){
    this.title = $scope.$parent.ngDialogData.title;
    this.message = $scope.$parent.ngDialogData.message;

    //Set focus on message box once error dialog closes
    $scope.$on('ngDialog.closed', function (event, $dialog) {
      document.getElementById("notification-message").focus();
    });

  }]);

})();
