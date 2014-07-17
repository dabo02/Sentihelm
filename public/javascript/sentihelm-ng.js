(function(){
  var app = angular.module('sentihelm',[]);

  //Creates the header element, along with all
  //its functionality
  app.directive('header', ['$rootScope', function(){
    return{
      restrict:'E',
      templateUrl:'header.html',

      controller: function($rootScope){
        //Icon for drawer button and page logo
        this.drawerOn = false;
        this.drawerButton = 'fa fa-reorder fa-lg';
        this.logo = '../resources/images/sentihelm.png';

        //Toggles the drawer, and set its
        //state on boolean for next toggle
        this.toggleDrawer = function(){
          $rootScope.$broadcast('toggleDrawer',[this.drawerOn]);
          this.drawerOn=!this.drawerOn;
        }
      },

      controllerAs:'header'
    };
  }]);

  //Creates the drawer element, along with all
  //its functionality
  app.directive('drawer', function(){
    return{
      restrict:'E',
      templateUrl:'drawer.html',

      controller: function($scope){
        //Drawer options with name and icon;
        //entries are off by default
        this.entries=[
          {name:'Tip Feed', icon:'fa fa-inbox'},
          {name:'Video Streams', icon:'fa fa-video-camera'},
          {name:'Send Notification', icon:'fa fa-send-o'},
          {name:'Maps', icon:'fa fa-globe'},
          {name:'Wanted List', icon:'fa fa-warning'},
          {name:'Data Analysis', icon:'fa fa-bar-chart-o'}
        ];

        this.entriesOn = false;

        //Toggles drawer
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

  //Creates the tip-feed element, along with all
  //its functionality
  app.directive('tipFeed', function(){
    return{
      restrict:'E',
      templateUrl:'tip-feed.html'
    };
  });

})();
