/**
 * Created by vectorhacker on 4/1/15.
 */
(function () {
  'use strict';

  angular.module('sentihelm')
    .config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', '$sceDelegateProvider',
      function ($stateProvider, $urlRouterProvider, USER_ROLES, $sceDelegateProvider) {
        $stateProvider
          .state('tip', {
            url: '/tip/:tipId',
            templateUrl: '/tip.html',
            data: {
              authorizedRoles: [USER_ROLES.admin, USER_ROLES.user]
            },
            resolve: {
              //  Reads the Routing Service
              routingService: 'RoutingService',

              //  Receives the Routing Service, checks if user is logged in,
              //  executes the login dialog if needed and waits for the dialog
              //  to close before loading the state.
              authenticate: function (routingService) {
                return routingService.checkUserStatus(this.data.authorizedRoles, "Tip");
              }
            }
          });
      }
    ])
    .config(['$httpProvider', function ($httpProvider) {
      //  this line ensures that people are able to download audio
      //  and video from sentihelm.
      $httpProvider.defaults.timeout = 5000;
    }])
    .factory('Tip', ['$http', 'ngDialog', '$log', '$q', '$location', 'socket', function ($http, ngDialog, $log, $q, $location, socket) {

      var newTips = [];

      socket.on('new-tip', function (tipId) {
        newTips.push({
          tipId: tipId,
          date: new Date()
        });
        tip.newTipCount += 1;
      });

      var tip = {};

      tip.newTipCount = 0;

      tip.getTips = function (searchParams) {
        return $http.get('/tips/list', {
          params: searchParams
        })
          .then(function (response) { //  success
            tip.newTipCount = 0;
            var i;
            for (i = newTips.length - 1; i > 0; i--) {
              delete newTips[i];
              newTips.pop()
            }
            return response.data;
          }, function (errResponse) { //  error
            return $q.reject(errorResponse);
          });
      };
      tip.getTip = function (tipId) {
        return $http.get('/tip/' + tipId)
          .then(function (r) {
            return r.data;
          }, function (r) {
            return $q.reject('couldn\'t retrieve tip, sorry. status: ' + r.status);
          });
      };
      /**
       * Returns an ngDialog with the requested media on a tip
       * @param {String} type  The type of media 'VID', 'AUDIO', 'IMG'
       * @param {[type]} tipId [description]
       */
      tip.getMedia = function (type, tipId, showClose, $scope) {
        var url = $location.protocol() + '://' + $location.host() + ':' + $location.port();
        url += '/tip/' + tipId + '/media?type=' + type;

        var data = JSON.stringify({
          attachmentType: type,
          address: url
        });

        return ngDialog.open({
          template: '../attachment-dialog.html',
          className: 'ngdialog-attachment',
          showClose: showClose,
          scope: $scope,
          data: data
        });
      };

      tip.getNewTips = function () {
        return newTips;
      };

      return tip;
    }])
    .factory('tipSocket', ['socketFactory', '$location', function (socketFactory, $location) {
      var tipSocket = io.connect($location.host());
      return socketFactory({
        ioSocket: tipSocket
      });
    }])
    .controller('TipFeedController', ['usSpinnerService', '$anchorScroll', '$state', '$scope', 'Tip', '$location',
      function (usSpinnerService, $anchorScroll, $state, $scope, Tip, $location) {
        var self = this;


        var self = this;
        var spinner = 'loading-tips-spinner';
        self.hasError = false;

        self.tabs = ['All', 'Crime Reports', 'Tips'];
        self.currentTab = self.tabs[0];

        // pagination variables
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

        self.notificationDialogIsOn = false;
        self.attachmentDialogIsOn = false;

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

        self.newTips = function () {
          return {
            newTips: Tip.getNewTips().length > 0,
            howMany: Tip.getNewTips().length
          };
        }

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
            crimeType: self.selectedCrimeType,
            skip: self.skip,
            limit: self.limit,
            type: self.currentTab
          };

          Tip.getTips(params)
            .then(function (data) {
              self.lastPageNum = data.lastPageNum;
              self.totalTips = data.totalTips;

              self.tips = angular.copy(data.tips);

              self.tipsAvailable = self.tips.length !== 0;
            }, function (err) {
              self.tipsAvailable = false;
              self.hasError = true;
              self.successMessag = err.message;
            })
            .then(function () {
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

        self.showTip = function (tip) {
          $state.go('tip', {
            tipId: tip.objectId
          }, {
            location: true
          });
        };

        self.showAttachmentDialog = function (tip, type) {
          // Only show dialog if it, and notificationDialog,
          // are not showing
          if (!self.notificationDialogIsOn && !self.attachmentDialogIsOn) {

            self.showMediaSpinner = true;

            if (self.attachmentDialogIsOn) {
              return;
            }

            // If attachment is an audio file,
            // don't show close control (X)
            var showClose = self.attachmentType !== 'AUDIO';

            // Open dialog and pass control to AttachmentController
            $scope.attachmentDialog = Tip.getMedia(type, tip.objectId, showClose, $scope);

            $scope.attachmentDialog.closePromise.then(function () {
              self.attachmentDialogIsOn = false;
            });

            // Attachment dialog is now showing
            self.attachmentDialogIsOn = true;
          }
        };

        self.loadNewTips = function () {
          self.getPage(1);
        };

        self.count = function () {
          return Tip.newTipCount;
        };

        self.getPage(self.currentPageNum);
      }
    ])
    .controller('TipController', ['$http', '$stateParams', '$scope', 'Tip', 'ngDialog', function ($http, $stateParams, $scope, Tip, ngDialog) {
      var self = this;

      self.tipError = null;
      self.tip = null;
      self.notificationDialogIsOn = false;
      self.attachmentDialogIsOn = false;

      self.showSMSDialog = function () {
        // ngDialog can only handle stringified JSONs
        var data = JSON.stringify({
          phoneNumber: self.tip.phone
        });

        // Open dialog and pass control to AttachmentController
        $scope.SMSDialog = ngDialog.open({
          template: '/sms-dialog.html',
          className: 'ngdialog-theme-plain',
          showClose: true,
          scope: $scope,
          data: data
        });
      };

      self.showNotificationDialog = function (firstName, lastName, controlNumber, channel) {
        // Only show dialog if it, and attachmentDialog,
        // are not showing
        if (!this.notificationDialogIsOn && !this.attachmentDialogIsOn) {
          // ngDialog can only handle stringified JSONs
          var data = JSON.stringify({
            name: firstName + " " + lastName,
            controlNumber: controlNumber,
            channel: channel
          });

          // Open dialog, and add it to the $scope
          // so it can identify itself once open
          $scope.notificationDialog = ngDialog.open({
            template: '/notification-dialog.html',
            className: 'ngdialog-theme-plain',
            closeByDocument: false,
            closeByEscape: false,
            scope: $scope,
            data: data
          });

          // NotificationDialog is now showing
          this.notificationDialogIsOn = true;
        }
      };


      self.showAttachmentDialog = function (type) {
        // Only show dialog if it, and notificationDialog,
        // are not showing
        if (!self.notificationDialogIsOn && !self.attachmentDialogIsOn) {

          self.showMediaSpinner = true;

          if (self.attachmentDialogIsOn) {
            return;
          }

          // If attachment is an audio file,
          // don't show close control (X)
          var showClose = self.attachmentType !== 'AUDIO';

          // Open dialog and pass control to AttachmentController
          $scope.attachmentDialog = Tip.getMedia(type, self.tip.objectId, showClose, $scope);

          $scope.attachmentDialog.closePromise.then(function () {
            self.attachmentDialogIsOn = false;
          });

          // Attachment dialog is now showing
          self.attachmentDialogIsOn = true;
        }
      };

      Tip.getTip($stateParams.tipId)
        .then(function (data) {
          self.tip = angular.copy(data);
        }, function (e) {
          self.tip = null;
          self.tipError = e;
        });

    }]);

})();
