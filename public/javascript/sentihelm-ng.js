(function(){
  var app = angular.module('sentihelm', ['ngRoute','btford.socket-io','google-maps']);

  //Creates an injectable socket service that
  //works just like socket.io's client library
  app.factory('socket', function (socketFactory) {
    var ioSocket = io.connect('http://sentihelm.elasticbeanstalk.com');
    socket = socketFactory({
      ioSocket: ioSocket
    });
    return socket;
  });

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
      controller: 'NotificationsController'
    }).
    otherwise({
      redirectTo: '/tipfeed'
    });
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

  //Creates the notification modal,
  //along with all its functionality
  app.directive('notificationModal', function(){
    return{
      restrict: 'E',
      templateUrl:'notification-modal.html',

      controller: function(){
        this.active = false;
        this.sendNotification = function(){

        };
      },

      controllerAs: 'modal'
    }
  });

  app.controller('TipFeedController', function(socket){
    var tipfeed = this;
    this.currentTips = [];
    this.totalTipCount = 0;
    this.currentPage = 1;
    this.lastPage = 1;
    this.paginatorSet = [];
    this.paginatorSetSize = 0;
    socket.emit('request-batch', {upperBound: (this.currentPage*10)});

    socket.on('respond-batch', function(data){
      tipfeed.currentTips = data.currentTips;
      tipfeed.totalTipCount = data.totalTipCount;
      tipfeed.lastPage = Math.ceil(tipfeed.totalTipCount/10) || 1;
      if(tipfeed.currentPage===1){
        tipfeed.pageSetUpdater(tipfeed.lastPage);
      }
    });

    this.changePage = function(newPage){
      this.currentPage = newPage;
      socket.emit('request-batch', {upperBound: (this.currentPage*10)});
    };

    this.nextPage = function(){
      if(this.currentPage!=this.lastPage){
        if(this.currentPage%10===0){
          this.pageSetUpdater(this.lastPage - this.currentPage);
        }
        this.changePage(this.currentPage+=1);
      }
    };

    this.prevPage = function(){
      if(this.currentPage!==1){
        if((this.currentPage-1)%10===0){
          this.pageSetUpdater(this.lastPage);
        }
        this.changePage(this.currentPage-=1);
      }
    };

    this.pageSetUpdater = function(value){
      this.paginatorSet = [];
      this.paginatorSetSize = 10 && value;
      for(var i=0; i<this.paginatorSetSize;i++){
        this.paginatorSet.push(this.currentPage+i);
      }
    }

  });

})();
