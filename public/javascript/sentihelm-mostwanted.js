/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function (angular) {
    var mostWantedModule = angular.module('sh.mostwanted', []);

    /// TODO: Add toggle button, finally test
    mostWantedModule.directive('wantedPerson', function () {
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
                scope.editing = true;
                scope.wantedCardTemplate = '/most-wanted-card.html';
                scope.wantedEditorTemplate = '/most-wanted-editor.html';
            }

        };
    });

})(angular);
