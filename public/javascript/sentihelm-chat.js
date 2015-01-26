/**
 * Created by marti_000 on 1/26/2015.
 */

(function (angular, undefined) {
    angular.module('sh.chat', [])
        .factory('messageService', function () {
            var Message = (function (){
                function Message() {

                }

                return Message;
            })();

            return {
                Message: Message
            };
        })
        .controller('ChatController', ['$scope', 'messageService', function ($scope) {
            var self = this;

            this.send = function () {

            };

            this.recieve = function () {

            }

            this.save = function () {

            }
        }]);
})(window.angular);
