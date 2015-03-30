(function () {
  'use strict';
  var Parse, Colletion;
  var Q = require('q');

  function setDB(db, col) {
    Parse = db;
    Collection = col;
    return {
      Model: ParseModel,
      Collection: new ParseCollection(col)
    };
  }

  /**
   *
   *
   */
  function ParseModel(Model) {
    var self = this;
    self.Model = Model;

    self.set = function () {

    };

    self.save = function () {

    };
  }

  function ParseCollection(CollectionClass) {
    var self = this;
    self.Collection = typeof CollectionClass === 'string' ?
      Parse.Object.extend(CollectionClass) :
      (CollectionClass instanceof Parse.Object === true ?
        CollectionClass :
        null);

    self.find = function (option) {

    };



    self.get = function (id) {
      return Q.Promise(function (resolve, reject) {
        new db.Query(self.Collection)
          .get(id, {
            success: function (object) {
              if (object) {
                resolve(new ParseModel(object));
              } else {
                reject(Error("Couldn't find object"));
              }
            },
            error: function (error) {
              reject(error);
            }
          });
      });
    };
  }

  module.exports = setDB;
})();
