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
                person: "="
            },
            templateUrl: '/wanted-person-template.html',
            transclude: true,
            link: function (scope, element) {
                scope.editing = false;

                console.log(scope.person);

                scope.$watch('editing', function (editing) {
                    element.children('.editor').toggle(0, function () {
                        if (editing) {
                            element.children('.card').hide();
                        } else {
                            element.children('.card').show();
                        }
                    });

                });
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
