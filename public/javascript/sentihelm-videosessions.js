  /**
 * Created by brianlandron on 4/30/15.
 */

(function () {
  'use strict';

  angular.module('sentihelm')

    .controller('VideoArchiveController', ['$scope', 'Session', 'socket', 'languageService', 'ngDialog', 'usSpinnerService', '$location', '$anchorScroll', '$http', '$sce', function ($scope, Session, socket, languageService, ngDialog, usSpinnerService, $location, $anchorScroll, $http, $sce) {

      var videoArchiveCtrl = this;
      videoArchiveCtrl.videoArchiveArray;
      videoArchiveCtrl.lang = languageService.getlang().then(function(response){

        videoArchiveCtrl.lang = response;
      });
        videoArchiveCtrl.videoWatchStatuses = ['Watched', 'Unwatched', 'All'];
      videoArchiveCtrl.videosAvailable = true;
      //pagination variables
      videoArchiveCtrl.currentPageNum = 1;
      videoArchiveCtrl.lastPageNum;
      videoArchiveCtrl.pageNumbers;
      videoArchiveCtrl.limit = 10;
      videoArchiveCtrl.skip;
      videoArchiveCtrl.videoTotal;

      videoArchiveCtrl.getPage = function (pageNum) {

        if (pageNum < 1 || pageNum > videoArchiveCtrl.lastPageNum) {
          return;
        }

        usSpinnerService.spin('loading-video-archive-spinner');
        var parseSkipLimit = 10000;
        var watchStatusQuery;
        videoArchiveCtrl.videoArchiveArray = [];
        videoArchiveCtrl.currentPageNum = pageNum;
        videoArchiveCtrl.skip = (videoArchiveCtrl.currentPageNum - 1) * videoArchiveCtrl.limit;
        if(videoArchiveCtrl.watchStatusFilter === 'Visto'){
          watchStatusQuery = "Watched";
        }
        else if(videoArchiveCtrl.watchStatusFilter === 'No-Visto'){
          watchStatusQuery = "Unwatched";
        }
        else{
          watchStatusQuery = "All";
        }
        var params = {
          videoDateFilter: videoArchiveCtrl.videoDateFilter,
          watchStatusFilter: watchStatusQuery,
          lastVideoCreatedAt: false, // adminPanelCtrl.adminPanelUsersArray[adminPanelCtrl.limit - 1].createdAt || undefined,
          skip: videoArchiveCtrl.skip,
          limit: videoArchiveCtrl.limit
        };

        $http.get('/videosessions/list', {params: params})
          .success(function (data) {

            videoArchiveCtrl.lastPageNum = data.lastPageNum;
            videoArchiveCtrl.videoTotal = data.videoTotal;

            videoArchiveCtrl.videoArchiveArray = angular.copy(data.videos);

            if (videoArchiveCtrl.videoArchiveArray.length === 0) {
              videoArchiveCtrl.videosAvailable = false;
            }
            else {
              videoArchiveCtrl.videosAvailable = true;
            }

          })
          .error(function (err) {
            videoArchiveCtrl.videosAvailable = false;

          }).then(function () {
            usSpinnerService.stop('loading-video-archive-spinner');
            $location.hash('top');
            $anchorScroll();
            videoArchiveCtrl.refreshPageNumbers();
          });
      };

      videoArchiveCtrl.refreshPageNumbers = function () {

        var baseNum = Math.floor(videoArchiveCtrl.currentPageNum / videoArchiveCtrl.limit);
        var firstNum = videoArchiveCtrl.currentPageNum % videoArchiveCtrl.limit === 0 ? (baseNum - 1) * videoArchiveCtrl.limit + 1 : baseNum * videoArchiveCtrl.limit + 1;
        var lastNum = 0;

        if (videoArchiveCtrl.currentPageNum % videoArchiveCtrl.limit === 0) {
          lastNum = videoArchiveCtrl.currentPageNum;
        }
        else if (baseNum * videoArchiveCtrl.limit + videoArchiveCtrl.limit > videoArchiveCtrl.lastPageNum) {
          lastNum = videoArchiveCtrl.lastPageNum;
        }
        else {
          lastNum = baseNum * videoArchiveCtrl.limit + videoArchiveCtrl.limit;
        }

        videoArchiveCtrl.pageNumbers = [];

        for (var i = 0, j = firstNum; j <= lastNum; i++, j++) {
          videoArchiveCtrl.pageNumbers[i] = j;
        }
      }

      videoArchiveCtrl.showVideo = function (video) {

        /*
         AWS.config.update({accessKeyId: 'AKIAI7FBDAXKQOTH7A5Q', secretAccessKey: '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'});
         AWS.config.region = 'us-east-1';
         var s3 = new AWS.S3();

         // This URL will expire in one minute (60 seconds)
         var params = {Bucket: 'stream-archive', Key: '44755992/' + video.archiveId + '/archive.mp4', Expires: 500};
         var videoUrl = s3.getSignedUrl('getObject', params);
         */

        //$sce.trustAsResourceUrl('https://stream-archive.s3.amazonaws.com/44755992/**');
        var videoUrl = '';

        var params = {
          archiveId: video.archiveId
        }


        $http.get('videosessions/getVideoUrl', {params: params})
          .success(function (data) {
            videoUrl = data;
          })
          .error(function (error) {
            //TODO add error management
          }).then(function () {

            if (videoArchiveCtrl.watchStatusFilter === 'Unwatched') {
              // inform user of unwatched list updates when video is watched
              ngDialog.open({
                template: '../info-dialog.html',
                className: 'ngdialog-theme-plain',
                showClose: false
              }).closePromise.then(function () {
                  //ngDialog can only handle stringified JSONs
                  var data = JSON.stringify({
                    attachmentType: 'VID',
                    address: videoUrl
                  });

                  // show video
                  //Open dialog and pass control to AttachmentController
                  $scope.attachmentDialog = ngDialog.open({
                    template: '../attachment-dialog.html',
                    className: 'ngdialog-attachment',
                    showClose: true,
                    scope: $scope,
                    data: data
                  });
                });
            }
            else {
              //ngDialog can only handle stringified JSONs
              var data = JSON.stringify({
                attachmentType: 'VID',
                address: videoUrl
              });

              // show video
              //Open dialog and pass control to AttachmentController
              $scope.attachmentDialog = ngDialog.open({
                template: '../attachment-dialog.html',
                className: 'ngdialog-attachment',
                showClose: true,
                scope: $scope,
                data: data
              });
            }

          });

        var data = {
          videoId: video.objectId
        }

        $http.post('videosessions/updateWatchersList', data)
          .success(function (data) {
            videoArchiveCtrl.getPage(videoArchiveCtrl.currentPageNum);
          })
          .error(function (error) {
            //TODO add error management
          });

        /*
         //Update VideoSession's lastWatcher
         var VideoSession = Parse.Object.extend("VideoSession");
         var videoSessionQuery = new Parse.Query(VideoSession);
         videoSessionQuery.get(video.id, {
         success: function(videoSession) {
         videoSession.set('hasBeenWatched', true);
         videoSession.set('lastWatcher', {
         __type: "Pointer",
         className: "User",
         objectId: Session.userId
         });
         videoSession.save().then(videoArchiveCtrl.getPage(videoArchiveCtrl.currentPageNum));
         },
         error: function(object, error) {
         // The object was not retrieved successfully.
         console.log("Error fetching video for lastWatcher update.");
         }
         });*/
      };

      videoArchiveCtrl.fetchDownloadUrl = function (archiveId, index) {

        var params = {
          archiveId: archiveId
        }

        $http.get('videosessions/getVideoUrl', {params: params})
          .success(function (data) {
            videoArchiveCtrl.videoArchiveArray[index].downloadLink = data;
            $('.downloadLink' + index)[0].click();
          })
          .error(function (error) {

          });
      };

      videoArchiveCtrl.getPage(videoArchiveCtrl.currentPageNum);

    }]);

})();