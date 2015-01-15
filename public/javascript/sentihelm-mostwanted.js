/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function (angular, undefined) {
    /**
     * @ngdoc Module
     * @name sh.mostwanted
     * @requires none
     * @description Creates the module for the controllers and directives of most wanted
     * */
    var mostWantedModule = angular.module('sh.mostwanted', []);

    /**
     * @ngdoc Directive
     * @name wantedPerson
     * @param {ngService} $rootScope provide separation between the model and the view, via a mechanism for watching the model for changes.
     * @returns {ngDirective}
     * @restrict EA
     * @scope
     * @description custom angular directive used in html as wanted-person
     * */
    mostWantedModule.directive('wantedPerson', function ($rootScope) {
        return {
            restrict: 'EA',
            scope: {
                change: "&",              // for observing changes in models
                save: "&",                // for saving changes
                confirm: "&",             // for confirming deletion
                fileSelect: "&",          // for selecting image file
                criminal: "=",              // the person object for the model, information should be in person.attributes object
                disableNewButton: "=",    // boolean value, disables/enables new button
                wantedArray: "=",         // array of wanted people
                editedPeopleIndices: "=", // indices of people being edited
                index: "="                // index of current element
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
