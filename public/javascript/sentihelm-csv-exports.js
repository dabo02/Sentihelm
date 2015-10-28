/**
 * Created by brianlandron on 4/30/15.
 */

(function(){
  'use strict';

  angular.module('sentihelm')

    .controller('CSVExportsController', ['$http', function ($http) {

      var csvCtrl = this;


      $http.post('/csvexports/getFile', data)
        .success(function(data){

        })
        .error(function(err){


        });

    }]);


})();