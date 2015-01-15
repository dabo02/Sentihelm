/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function (angular, undefined) {
    var mostWantedModule = angular.module('sh.mostwanted', []);

    mostWantedModule.directive('wantedPerson', function ($rootScope) {
        return {
            restrict: 'EA',
            scope: {
                change: "&",
                save: "&",
                confirm: "&",
                fileSelect: "&",
                person: "=",
                disableNewButton: "=",
                wantedArray: "=",
                editedPeopleIndices: "=",
                index: "="
            },
            templateUrl: '/wanted-person-template.html',
            transclude: true,
            link: function (scope, element) {
                scope.justCreated = scope.editing = (scope.index === $rootScope.lastPersonAddedIndex);
                scope.wantedCardTemplate = '/most-wanted-card.html';
                scope.wantedEditorTemplate = '/most-wanted-editor.html';

                scope.toggleEditing = function() {
                    scope.editing = !scope.editing;
                };

                scope.discard = function() {
                    scope.toggleEditing();
                    element.controller().wantedArray.pop();
                    element.controller().disableNewButton = false;
                    element[0].remove();
                };
            }

        };
    });

})(window.angular);
