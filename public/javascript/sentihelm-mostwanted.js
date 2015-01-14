/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function (angular) {
    var mostWantedModule = angular.module('sh.mostwanted', []);

    /// TODO: Add toggle button, finally test
    mostWantedModule.directive('wantedPerson', function ($rootScope) {
        return {
            restrict: 'EA',
            scope: {
                change: "&",
                save: "&",
                confirm: "&",
                person: "=",
                disableNewButton: "=",
                wantedArray: "=",
                editedPeopleIndices: "=",
                index: "="
            },
            templateUrl: '/wanted-person-template.html',
            transclude: true,
            link: function (scope) {
                scope.editing = false;
                scope.wantedCardTemplate = '/most-wanted-card.html';
                scope.wantedEditorTemplate = '/most-wanted-editor.html';

                scope.toggleEditing = function () {
                    scope.editing = !scope.editing;
                    console.log(scope.editing);
                }
            }

        };
    });

})(angular);
