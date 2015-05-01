/**
 * Created by brianlandron on 4/30/15.
 */

(function(){
  'use strict';

  angular.module('sentihelm')

    .controller('ProfileController', ['socket', 'Session', '$scope', function (socket, Session, $scope) {

      var profileCtrl = this;
      profileCtrl.hasError = false;
      profileCtrl.user = Session.user;

      profileCtrl.savingUser = false;
      profileCtrl.savingPass = false;

      profileCtrl.showPasswordChanger = false;

      profileCtrl.states = ["Select","AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VI","VT","VA","WA","WV","WI","WY"];

      //Adds new SentiHelm user
      profileCtrl.saveUser = function (user) {
        this.savingUser = true;
        profileCtrl.userChanged = false;
        socket.emit('save-user', {
          user: user
        });
      };

      profileCtrl.savePassword = function (prevPass, newPass, confirmPass) {
        this.savingPass = true;
        profileCtrl.passwordChanged = false;

        socket.emit('save-user-password', {
          prevPass: prevPass,
          newPass: newPass,
          confirmPass: confirmPass
        });

      };

      socket.on('save-user-success', function (data) {
        profileCtrl.savingUser = false;
        profileCtrl.successMessage = "Succeeded";
        profileCtrl.hasError = false;
        Session.updateUser(profileCtrl.user);
      });

      socket.on('save-user-failed', function (data) {
        profileCtrl.savingUser = false;
        profileCtrl.successMessage = "Failed";
        profileCtrl.hasError = true;
      });
      socket.on('save-user-password-success', function (data) {
        profileCtrl.savingPass = false;
        profileCtrl.successMessage = "Succeeded";
        profileCtrl.hasError = false;
      });

      socket.on('save-user-password-failed', function (data) {
        profileCtrl.savingPass = false;
        profileCtrl.successMessage = "Incorrect password";
        profileCtrl.hasError = true;
      });

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