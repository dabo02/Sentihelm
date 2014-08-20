(function(){
  var app = angular.module('sentihelm', ['ngRoute','btford.socket-io','google-maps','ngDialog','angularFileUpload']);

  //Sets up all the routes the app will handle,
  //so as to have a one page app with deep-linking
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/tipfeed', {
      templateUrl: 'tip-feed.html',
      controller: 'TipFeedController'
    }).
    when('/notifications', {
      templateUrl: 'notifications.html',
      controller: 'GlobalNotificationsController'
    }).
    otherwise({
      redirectTo: '/tipfeed'
    });
  }]);

  //Initialize values needed throughout the app
  app.run(function(){
    Parse.initialize("Q5ZCIWpcM4UWKNmdldH8PticCbywTRPO6mgXlwVE", "021L3xL2O3l7sog9qRybPfZuXmYaLwwEil5x1EOk");
  });

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
    var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
    socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

  //Creates a notification service that constructs
  //Parse notifications and provides methods to
  //save and push those notifications to different channels
  app.factory('notificationService', ['$rootScope', function($rootScope){

    //Needed to create Parse notifications
    var PushNotification = Parse.Object.extend("PushNotifications");

    var notificationService = {};

    //Array that contains channels where notifications
    //will be sent; emptied once any notification is sent
    notificationService.channels = [];

    //Creates and returns a new Parse Notification from
    //notification data gathered from controller
    notificationService.newNotification = function(notificationData){
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
    notificationService.saveAndPushNotification = function(notification){
      //Try and save the notification to parse, for future viewing
      notification.save(null, {
        success: function(notification){
          //Notification saved, now push to user
          notificationService.pushNotification(notification);
        },
        error : function(notification, error){
          //Notification could not be saved, pass control back to controller
          //and reset channels
          $rootScope.$broadcast('notification-error', [notification, error]);
          notificationService.channels = [];
        }
      });
    };

    //Sends the already saved notification to the user;
    //if pushing failed, reverts save or continues as partial success
    notificationService.pushNotification = function(notification){
      //Send notification
      Parse.Push.send({
        channels: notificationService.channels,
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
          //Reset channels and alert controller know
          notificationService.channels = [];
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
          notificationService.channels = [];
        }
      });
    };

    return notificationService;
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
          {name:'Tip Feed', icon:'fa fa-inbox', action:'#/tipfeed'},
          {name:'Video Streams', icon:'fa fa-video-camera', action:'#/streams'},
          {name:'Send Notification', icon:'fa fa-send-o', action:'#/notifications'},
          {name:'Maps', icon:'fa fa-globe', action:'#/maps'},
          {name:'Wanted List', icon:'fa fa-warning', action:'#/wanted'},
          {name:'Data Analysis', icon:'fa fa-bar-chart-o', action:'#/analysis'}
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

  //Controller for tipfeed route; handles the tip feed
  //which lets you interact with tips, depends heavily
  //on pagintorService
  app.controller('TipFeedController', ['$scope', 'socket', 'ngDialog', 'paginatorService',
  function($scope, socket, ngDialog, paginatorService){
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

    this.changePage = function(newPage){
      paginatorService.changePage(newPage);
    };

    this.nextPage = function(){
      paginatorService.nextPage();
    };

    this.prevPage = function(){
      paginatorService.prevPage();
    };

    //!!!!!!!!!!!!!!!!!!!!
    //TODO Uncomments and implement functionality
    // this.showAttachment = function(address){
    //   ngDialog.open({
    //     template: '<img style="width:100%, height:50%;" src='+"\""+address+"\""+'/>',
    //     plain: true,
    //     className: 'ngdialog-theme-plain'
    //   });
    // };
    //!!!!!!!!!!!!!!!!!!!!

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
        controller: 'NotificationController',
        className: 'ngdialog-theme-plain',
        data:data
      });

      var testing;
    };

  }]);

  //Controller for user follow-up notification; controls the
  //dialog that allows for message/attachment to be sent to users
  app.controller('NotificationController', ['$scope', 'notificationService',function($scope, notificationService){
    //Get data from ngDialog directive
    this.name = $scope.$parent.ngDialogData.name;
    this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
    this.channel = $scope.$parent.ngDialogData.channel;
    this.userId = this.channel.substring(5);

    //Set focus on message box once dialog pops up
    $scope.$on('ngDialog.opened', function (event, $dialog) {
      document.getElementById("notification-message").focus();
    });

    //Notification was successfully saved and pushed (sent)
    $scope.$on('notification-success',function(notification){
      $scope.closeThisDialog();
      this.sending = false;
    });

    //Notification was saved, but not pushed
    $scope.$on('notification-partial-success',function(notification){
      //Right now same as success event, but might change
      $scope.closeThisDialog();
      this.sending = false;
    });

    //Notification either wasn't saved, or did save
    //but push failed and error clause removed said save
    $scope.$on('notification-error',function(notification){
      //TODO Test this
      $scope.notificationDialog = ngDialog.open({
        template: '<p>An error has occurred. Please try again.</p>',
        plain:true,
        className: 'ngdialog-theme-plain'
      });
      this.sending = false;
    });

    //Once a file is selected, prep file for upload to Parse
    this.onFileSelect = function($files){
      this.file = $files[0];
      if(this.file.type.match('image.*')){
        this.fileType = "image";
      }
      else if(this.file.type.match('video.*')){
        this.fileType = "video";
      }
      else{
        this.fileType = "audio";
      }
      this.fileLabel = this.file.name
    };

    this.submitNotification = function(){
      //Toggle sending animation
      this.sending = true;

      //Set the channel where notification will be sent
      notificationService.channels.push(this.channel);

      //Prepare notification
      var notification = {};
      notification.userId = this.userId;
      notification.controlNumber = this.controlNumber;
      notification.title = this.title;
      notification.message = this.message;
      //If an file is present, attach it and set its type
      if(this.file){
        notification.attachment = new Parse.File("attachment", this.file);
        notification.attachmentType = this.fileType;
      }

      //Create Parse notification and send it
      var parseNotification = notificationService.newNotification(notification);
      notificationService.saveAndPushNotification(parseNotification);
    };

  }]);

})();
