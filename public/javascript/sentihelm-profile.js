/**
 * Created by brianlandron on 4/30/15.
 */

(function(){
  'use strict';

  angular.module('sentihelm')

    .controller('ProfileController', ['socket', 'Session', '$scope', '$http', 'languageService', function (socket, Session, $scope, $http, languageService) {

      var profileCtrl = this;
      profileCtrl.states = ["Select","AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VI","VT","VA","WA","WV","WI","WY"];
      profileCtrl.hasError = false;
      profileCtrl.savingUser = false;
      profileCtrl.savingPass = false;
      profileCtrl.showPasswordChanger = false;
      profileCtrl.user = angular.copy(Session.user);
      profileCtrl.lang = languageService;
      console.log(profileCtrl.lang);

      //Adds new SentiHelm user
      profileCtrl.saveUser = function (user) {
        this.savingUser = true;
        profileCtrl.userChanged = false;

        var data = {
          user: user
        }

        $http.post('/users/update', data)
          .success(function(data){
            profileCtrl.savingUser = false;
            profileCtrl.successMessage = data;
            profileCtrl.hasError = false;
            Session.updateUser(profileCtrl.user);
          })
          .error(function(err){
            profileCtrl.savingUser = false;
            profileCtrl.successMessage = err;
            profileCtrl.hasError =  true;

          });
        
      };

      profileCtrl.savePassword = function (prevPass, newPass, confirmPass) {
        this.savingPass = true;
        profileCtrl.passwordChanged = false;

        var data = {
          prevPass: prevPass,
          newPass: newPass,
          confirmPass: confirmPass,
          user: profileCtrl.user
        };

        $http.post('/users/update/password', data)
          .success(function(data){
            profileCtrl.savingPass = false;
            profileCtrl.successMessage = data;
            profileCtrl.hasError = false;
            Session.updateUser(profileCtrl.user);
          })
          .error(function(err){
            profileCtrl.savingPass = false;
            profileCtrl.successMessage = err;
            profileCtrl.hasError =  true;

          });
      };

      profileCtrl.changePassword = function(){
        profileCtrl.showPasswordChanger = true;
        profileCtrl.successMessage = "";
        profileCtrl.hasError = false;
      };

      profileCtrl.editProfile = function(){
        profileCtrl.showPasswordChanger = false;
        profileCtrl.successMessage = "";
        profileCtrl.hasError = false;
      };

    }]);


})();