(function () {
  'use strict';
  var Parse, Colletion;
  var Q = require('q');
  var _ = require('lodash');

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
    var self._promise = Q.Promise();

    self.set = function (properties) {
      if (arguments.length == 2) {
      } else {
        if (typeof properties === 'object') {
          Object.keys(properties)
            .forEach(function (prop) {
              self.Model.set(prop, properties[prop]);
            });
        }
      }
    };

    self.save = function () {

    };

    // implementing promise funcitons, simply calling the promise stuff.
    self.then = function () {
      self._promise = self._promise.then.apply(self._promise, arguments);
      return self;
    };

    self.fail = function () {
      self._promise = self._promise.fail.apply(self._promise, arguments);
      return self;
    };

    self.fin = function () {
      self._promise = self._promise.fin.apply(self._promise, arguments);
      return self;
    };
  }

  ParseModel.prototype = _.create()

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
