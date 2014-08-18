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

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
    var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
    socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

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
      ngDialog.open({
        template: '../notification-dialog.html',
        controller: 'NotificationController',
        className: 'ngdialog-theme-plain',
        data:data
      });
    };

  }]);

  //Controller for user follow-up notification; controls the
  //dialog that allows for message/attachment to be sent to users
  app.controller('NotificationController', ['$scope', '$rootScope', function($scope, $rootScope){
    //Get data from ngDialog directive
    this.name = $scope.$parent.ngDialogData.name;
    this.controlNumber = $scope.$parent.ngDialogData.controlNumber;
    this.channel = $scope.$parent.ngDialogData.channel;

    //Set focus on message box once dialog pops up
    $rootScope.$on('ngDialog.opened', function (event, $dialog) {
      document.getElementById("notification-message").focus();
    });

    //Once a file is selected, upload to Parse
    this.onFileSelect = function($files){
      var file = $files[0];
      var fileName = file.name;
    };
  }]);

})();
