(function () {
  'use strict';
  angular.module('sentihelm')

    .factory('dashboardService', ['$http', '$q', function ($http, $q) {

      var values = {};

      values.unreadTips = function () {
        return $http.get('/dashboard/unreadTipsCount');
      };

      values.unwatchVideos = function () {
        return $http.get('/dashboard/newVideosCount');
      };

      values.ave = function () {
        return $http.get('/dashboard/averageResponseTime');
      };

      values.getTips = function (searchParams) {
        return $http.get('/tips/list', {
          params: searchParams
        })
          .then(function (response) { //  success
            return response.data;
          }, function (errResponse) { //  error
            return $q.reject(errResponse);
          });
      };

      values.getVideos = function (videoParams) {
        return $http.get('/videosessions/list', {params: videoParams})
          .success(function (response) {

            return response.data;
          })
          .error(function (err) {
          });
      };


      return values;

    }])

////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('DashboardController', ['languageService', 'dashboardService', '$http',
      function (languageService, dashboardService, $http) {
        var self = this;
        self.unreadTips = 0;
        self.unwatch = 0;
        self.unreadChats = 0;
        self.responseTime = 0;
        self.lang = languageService.getlang().then(function(response){
          self.lang = response;
        });
        self.dashService = dashboardService;
        self.d = new Date().toISOString();
        self.currentDate = self.d;
        console.log(self.currentDate);


        self.params = {
          list: 0,
          searchString: null,
          registrationDate: null,
          crimeType: 0,
          skip: 0,
          limit: 4,
          type: 0
        };


        self.getTips = self.dashService.getTips(self.params).then(function (response) {

          var tips = response.tips;
          tips.forEach(function (element, index, array) {
            var currentTime = new Date();
            currentTime = Date.parse(currentTime);

            element.timeAgo = Math.floor((currentTime - Date.parse(element.createdAt))/60000);
          });
          self.getTips = tips;
        });

        var videoParams = {
          lastVideoCreatedAt: false, // adminPanelCtrl.adminPanelUsersArray[adminPanelCtrl.limit - 1].createdAt || undefined,
          skip: 0,
          limit: 4
        };

        self.getVideos = self.dashService.getVideos(videoParams).then(function (response) {
          var videos = response.data.videos;
          videos.forEach(function (element, index, array) {
            var currentTime = new Date();
            currentTime = Date.parse(currentTime);

            element.timeAgo = Math.floor((currentTime - Date.parse(element.createdAt))/60000);
          });

          self.getVideos = videos;
        });


        self.chat = [
          {type: 'Assult', time: '4 miuntes ago'},
          {type: 'Robbery', time: '25 miuntes ago'},
          {type: 'Assult', time: '4 miuntes ago'},
          {type: 'Assult', time: '11:32 AM'}

        ];

        self.fetchTotalTips = function () {
          self.dashService.unreadTips().then(function (response) {

            self.unreadTips = response.data.unreadTipsCount;
          });
        };
        self.fetchTotalStreams = function () {
          self.dashService.unwatchVideos().then(function (response) {

            self.unwatch = response.data.newVideosCount;
          });
        };
        self.fetchTotalChats = function () {
          self.unreadChats = 2;
        };
        self.fetchResponceTime = function () {
          self.dashService.ave().then(function (response) {
            var responseTimeData = response.data;
            var sum = 0;
            responseTimeData.forEach(function (element, index, array) {
              var firstRead = element.readBy[0].date;
              for (var i = 0; i<element.readBy.length; i++) {
                if (element.readBy[i].date < firstRead) {

                  firstRead = element.readBy[i].date;
                }
              }

              var created = Date.parse(element.createdAt);
              var timeSince = Math.floor((firstRead - created) / 60000);
              sum = sum + timeSince;
            });

            if ( Math.floor(sum/response.data.length) >60){
              self.responseTime = Math.floor((sum/response.data.length)/60);
              console.log((sum/response.data.length)/60);
              self.time = self.lang.dashboardHour;
            }
            else{
              self.responseTime = Math.floor(sum/response.data.length);
              self.time = self.lang.dashboardMinutes;
            }

            console.log(self.responseTime);
          });
        };

        self.fetchTotalTips();
        self.fetchTotalChats();
        self.fetchTotalStreams();
        self.fetchResponceTime();


      }]);


})();