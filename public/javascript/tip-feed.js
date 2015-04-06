/**
 * Created by vectorhacker on 4/1/15.
 */
(function () {
  'use strict';

  angular.module('sentihelm')
    .controller('TipFeedCtrl', ['socket', 'Session', 'usSpinnerService', '$http', '$location', '$anchorScroll',
      function (socket, Session, usSpinnerService, $http, $location, $anchorScroll) {
        var self = this;


        var self = this;
        var spinner = 'loading-tips-spinner';
        self.hasError = false;

        self.tabs = ['All', 'Crime Reports', 'Tips'];
        self.currentTab = self.tabs[0];

        //pagination variables
        self.currentPageNum = 1;
        self.lastPageNum;
        self.pageNumbers;
        self.limit = 10;
        self.skip;
        self.tipsAvailable = false;
        self.tips;
        self.totalTips;
        self.crimeTypes = ['All', 'Assault', 'Child Abuse', 'Elderly Abuse',
          'Domestic Violence', 'Drugs', 'Homicide', 'Animal Abuse', 'Roberry',
          'Robbery', 'Sex Offenses', 'Bullying', 'Police Misconduct', 'Bribery',
          'Vehicle Theft', 'Vandalism', 'Auto Accident', 'Civil Rights', 'Arson',
          'Other'
        ].sort();
        self.selectedCrimeType = 'All';

        self.setCrimeType = function (type) {
          var index = self.crimeTypes.indexOf(type);
          self.selectedCrimeType = self.crimeTypes[index] || 'All';
          self.getPage(1);
        };

        self.getTabClass = function (filter) {
          var b = self.currentTab === filter;
          return {
            'selected-filter': b
          };
        };

        self.showHidePanel = function () {
          return {
            'active': self.tipsAvailable
          };
        };

        self.getPage = function (pageNum) {

          if (pageNum < 1 || (pageNum > self.lastPageNum && self.lastPageNum > 0)) {
            return;
          }

          usSpinnerService.spin(spinner);
          self.currentPageNum = pageNum;
          self.skip = (self.currentPageNum - 1) * self.limit;

          var params = {
            list: self.currentTab,
            searchString: self.searchString,
            registrationDate: self.registrationDate,
            crimeTypes: self.selectedCrimeType,
            skip: self.skip,
            limit: self.limit,
            type: self.currentTab
          };


          $http.get('/tips/list', {
              params: params
            })
            .success(function (data, headers) {

              self.lastPageNum = data.lastPageNum;
              self.totalTips = data.totalTips;

              self.tips = angular.copy(data.tips);

              self.tipsAvailable = self.tips.length !== 0;

            })
            .error(function (err) {
              self.tipsAvailable = false;
              self.hasError = true;
              self.successMessag = err.message;

            }).then(function () {
              usSpinnerService.stop(spinner);
              $location.hash('top');
              $anchorScroll();
              self.refreshPageNumbers();
            });
        };

        self.refreshPageNumbers = function () {

          var baseNum = Math.floor(self.currentPageNum / self.limit);
          var firstNum = self.currentPageNum % self.limit === 0 ? (baseNum - 1) * self.limit + 1 : baseNum * self.limit + 1;
          var lastNum = 0;

          if (self.currentPageNum % self.limit === 0) {
            lastNum = self.currentPageNum;
          } else if (baseNum * self.limit + self.limit > self.lastPageNum) {
            lastNum = self.lastPageNum;
          } else {
            lastNum = baseNum * self.limit + self.limit;
          }

          self.pageNumbers = [];

          for (var i = 0, j = firstNum; j <= lastNum; i++, j++) {
            self.pageNumbers[i] = j;
          }
        };


        self.changeView = function (filter) {

          var tabIndex = self.tabs.indexOf(filter);
          self.successMessage = "";
          self.hasError = false;
          self.currentTab = self.tabs[tabIndex] || self.currentTab;
          self.getPage(1);
        };

        self.getPage(self.currentPageNum);
      }
    ]);

})();
