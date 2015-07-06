/**
 * Created by Victor Martinez <victoramartinez@optivon.net> on 1/12/2015.
 */

(function () {
  /**
   * @ngdoc Module
   * @name sh.mostwanted
   * @requires none
   * @description Creates the module for the controllers and directives of most wanted
   * */
  angular.module('sentihelm')

  /**
   * @ngdoc Directive
   * @name wantedPerson
   * @param {ngService} $rootScope provide separation between the model and
   * the view, via a mechanism for watching the model for changes.
   * @returns {ngDirective}
   * @restrict EA
   * @scope
   * @description custom angular directive used in html as wanted-person
   * */
  .directive('wantedPerson', function ($rootScope) {
    return {
      restrict: 'EA',
      scope: {
        change: "&", // for observing changes in models
        save: "&", // for saving changes
        confirm: "&", // for confirming deletion
        fileSelect: "&", // for selecting image file
        criminal: "=", // the person object for the model, information should be in person.attributes object
        disableNewButton: "=", // boolean value, disables/enables new button
        wantedArray: "=", // array of wanted people
        editedPeopleIndices: "=", // indices of people being edited
        index: "=" // index of current element
      },
      templateUrl: '/wanted-person-template.html',
      link: function (scope, element) {
        // creates boolean value from expression, if true this element was just created and added to the list
        // by the new button. Otherwise, just normal ngRpeat directive.
        scope.justCreated = scope.editing = (scope.index === $rootScope.lastPersonAddedIndex);

        // templates
        scope.wantedCardTemplate = '/most-wanted-card.html';
        scope.wantedEditorTemplate = '/most-wanted-editor.html';

        // toggles state of editing, shows and hides editing form and card respectively.
        scope.toggleEditing = function () {
          scope.editing = !scope.editing;
        };

        // discards current card and editor for the wanted person
        // can only be run if the card was just created and not saved
        // to the database.
        scope.discard = function () {
          scope.toggleEditing();
          element.controller().wantedArray.pop();
          element.controller().disableNewButton = false;
          element[0].remove();
        };
      }

    };
  })

  /**
   * @ngdoc Filter
   * @name limitName
   * @description limits the name to only two words for neater fit.
   * */
  .filter('limitName', function () {
    function limitName(inputName) {
      if (!inputName) {
        return '';
      }
      var nameArray = inputName.split(' '),
        first = nameArray[0] || '', // fixes undefined error
        last = nameArray[1] || ''; // fixes undefined error

      return first + ' ' + last;
    }

    return limitName;
  })

  /**
   * @ngdoc Filter
   * @name limitSummary
   * @description limits the summary of a criminal to only 35 words.
   * */
  .filter('limitSummary', function () {
      function limitSummary(inputSummary) {
        if (!inputSummary) {
          return '';
        }
        return inputSummary.split(' ').map(function (word, count) {
          var theWord = '';
          if (count < 35) {
            if (count === 0) {
              theWord = word[0].toUpperCase() + word.split('').slice(1).join('').toLowerCase();
            } else if (count === 34) {
              theWord = word + '...';
            } else {
              theWord = word.toLowerCase();
            }
            return theWord;
          }
        }).join(' ');
      }

      return limitSummary;
    })
    //Service for managing the most wanted list. It can save, add
    //or delete most wanted people to/from Parse
    .factory("MostWantedService", ['errorFactory', '$http', '$upload',
      function (errorFactory, $http, Upload) {
        var mostWantedService = {};
        var mostWantedArray = [];

        //Request must wanted list from Parse
        mostWantedService.fetchMostWantedList = function () {
          return $http.get('/mostwanted/list').then(function (response) {
            mostWantedArray = angular.copy(response.data);
            return mostWantedArray;
          });
        };

        //Save one most wanted person, whether
        //it is a new one or an old one
        mostWantedService.saveMostWanted = function (person, index) {
          var fields = {
              person: person,
              new: index === -1 ? true : false
            };

          if (!person.name) {
            //TODO show 'must have a name' error MOST-WANTED-NO-DATA
            errorFactory.showError('MOST-WANTED-NO-NAME');
            return;
          }
          /**
           * Ok, so here's the deal, we can't send too weird of objects to
           * the server or else nothing will get through, especially object that
           * need to be flattened. So what we do here is send the image that was
           * newly added as a base64 array in string format. Otherwise we delete
           * the image and we detect a new image in the server.
           */


          if (person.file) {
            return Upload.upload({
              url: '/mostwanted/save',
              data: fields,
              file: person.file
            });
          } else {
            return $http.post('/mostwanted/save', fields)
              .then(null, function (errResponse) {
                return;
              });
          }




        };

        //Delete a most wanted from parse
        mostWantedService.deleteMostWanted = function (index) {
          var wantedPerson = mostWantedArray[index];

          $http.delete('/mostwanted/remove/' + wantedPerson.objectId)
            .then(null, function (errResponse) {
              return;
            });
        };


        mostWantedService.rearrangeList = function (newList) {
          if (newList instanceof Array && newList.length === mostWantedArray.length) {

            return $http.put('/mostwanted/list', {
              list: newList
            });
          }
        };

        return mostWantedService;
      }
    ])
    //Controller for the Most-Wanted state
    .controller('MostWantedController', ['MostWantedService', '$scope', 'fileReader', 'ngDialog', '$rootScope', 'languageService',
      function (MostWantedService, $scope, fileReader, ngDialog, $rootScope, languageService) {

        var MostWantedCtrl = this,
          oldList = [],
          newList = [];
        languageService.getlang().then(function(response){
          console.log('mostwanted');
          console.log(response);
          MostWantedCtrl.lang = response;
        });

        function listUpdating(e, ui) {
          oldList = angular.copy(MostWantedCtrl.wantedArray);
        }

        function listSettled(e, ui) {
          newList = angular.copy(MostWantedCtrl.wantedArray);

          for (var i = 0; i < newList.length; i++) {
            if (oldList[i] !== newList[i]) {
              console.log('new list order!');
              MostWantedService.rearrangeList(newList)
                .then(getList);
              return;
            }
          }
        }

        this.sortableOptions = {
          handle: '.most-wanted-move-handle',
          update: listUpdating,
          stop: listSettled
        };

        this.wantedArray = [];
        this.parseArrayLength = 0;
        this.disableNewButton = false;
        this.editedPeopleIndices = [];


        function getList(count) {
          count = count|0;
          // Request most wanted list from Parse
          // Receive the most wanted list from the Most Wanted
          // service
          MostWantedService.fetchMostWantedList()
            .then(function (list) {
              // make sure the list is an Array of elements and that it has a length,
              // otherwise try again.
              list = list instanceof Array ? list : [];
              if (list.length >= 1) {
                MostWantedCtrl.wantedArray = angular.copy(list);

                MostWantedCtrl.disableNewButton = false;
                MostWantedCtrl.editedPeopleIndices = [];
                MostWantedCtrl.parseArrayLength = list.length;
              } else {
                // list was delivered blank, let's try fetching it again,
                // at a maximum of 10 times.
                if (count < 10) {
                  getList(count+1);
                }
              }
            });
        }

        //Once a file is selected, prep file for upload to Parse
        //Used for attaching files to a most-wanted person
        this.onFileSelect = function ($files, index) {
          //Fetch file
          var file = $files[0];
          var mostWanted = MostWantedCtrl.wantedArray[index];

          fileReader.readAsDataUrl(file, $scope)
            .then(function (result) {
              mostWanted.photoUrl = result;
              MostWantedCtrl.editedPeopleIndices[index] = true;
            });

          mostWanted.file = file;
        };

        //Add new wanted to the controller array. Must
        //use 'save' function to save to Parse
        this.add = function () {
          this.wantedArray.push({});
          this.disableNewButton = true;
          $rootScope.lastPersonAddedIndex = this.wantedArray.length - 1;
        };

        //Save new most wanted, or update an old one,
        //to Parse
        this.save = function (index) {
          //Check if it is a new most wanted
          MostWantedService
            .saveMostWanted(this.wantedArray[index], index === this.parseArrayLength ? -1 : index)
            .then(getList);
        };

        // Delete most wanted from local array and from
        // Parse
        this.delete = function (index) {
          MostWantedService.deleteMostWanted(index).then(getList);
        };

        //Enables the Save button if a change on an input
        //field is detected
        this.onChange = function (index) {
          this.editedPeopleIndices[index] = true;
        };

        //Dialog to confirm if the user really wants to
        //delete the most wanted from the list
        this.showConfirmDialog = function (index) {
          //this.aboutToDeleteName = this.wantedArray[index].attributes.firstName;
          ngDialog.openConfirm({
            template: '../most-wanted-confirm-dialog.html',
            className: 'ngdialog-theme-plain',
            scope: $scope
          }).then(function () {
            MostWantedCtrl.delete(index);
          });
        };

        getList();
      }
    ]);

})();
