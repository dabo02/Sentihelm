/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function (angular) {
    var mostWantedModule = angular.module('sh.mostwanted', []);

    /// TODO: Add toggle button, remove list styling bullets, finally test
    mostWantedModule.directive('wantedPerson', function () {
        return {
            restrict: 'E',
            scope: {
                person: "=",
                rank: "="
            },
            templateUrl: '/wanted-person-template.html',
            transclude: false,
            link: function (scope, element, attrs) {

                scope.editing = true;

                scope.toggleEditing = function () {
                    scope.editing = !scope.editing;
                };

            }

        };
    });

    /// TODO: test if this still works.
    mostWantedModule.directive('wantedEditor', function () {
        return {
            restrict: 'E',
            templateUrl: '/most-wanted-editor.html',
            replace: true,
            require: '^?wantedPerson'
        };
    });

    /// TODO: Finish creating most wanted card and add css styling
    mostWantedModule.directive('wantedCard', function () {
        return {
            restrict: 'E',
            templateUrl: '/most-wanted-card.html',
            require: '^?wantedPerson',
            replace: true
        };
    });

})(angular);
