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
   * [ParseModel description]
   * @param {[type]} Model [description]
   */
  function ParseModel(Model) {
    var self = this;
    self.Model = Model;
    var self._promise = Q.Promise();

    self.set = function (properties) {

      var self._promise = Q.Promise(function (resolve, reject) {
        if (arguments.length == 2) {
          var prop = arguments[0];
          var value = arguments[1];

          self.Model.set(prop, value, {
            success: function (model) {
              self.Model = model;
              resolve(self);
            },
            error: function (error) {
              reject(error);
            }
          });
        } else {
          if (typeof properties === 'object') {
            Object.keys(properties)
              .forEach(function (prop) {
                self.Model.set(prop, properties[prop]);
                self.Model.then(function (mod) {
                  self.Model = mod;
                  resolve(self);
                }, function (e) {
                  reject(e);
                });
              });
          }
        }
      });

      return self;
    };

    /**
     * save the model with it's properties
     * @return {ParseModel} The current object
     */
    self.save = function () {
      self._promise = Q.Promise(function (resolve, reject) {
        self.Model.save({
          success: function (model) {
            self.Model = model;
            resolve(self);
          },
          error: function (error) {
            reject(error);
          }
        });
      });

      return self;
    };
    /**
     * returns the value of the property, or a promise with the value
     * if deep is set to true.
     * @param  {String} property the name of the property to get
     * @param  {Boolean} [deep] weather to look for a property deeply, such as a pointer object
     * @return {any:Q.Promise}          the value of the property or a promise containing the value only if deep is set to true.
     */
    self.get = function (property) {
      var deep = false;

      if (arguments.length == 2) {
        if (arguments[1] instanceof Boolean) {
          deep = arguments[1];
        }
      }

      if (deep) {
        return Q.Promise(function (resolve, reject) {
          new Parse.Query(Collection)
            .include(property)
            .get(self.Model.id, {
              success: function (model) {
                self.Model = model;
                var val = model.get(property);
                resolve(val);
              },
              error: function (e) {
                reject(e);
              }
            });
        });
      } else {
        return self.Model.get(property);
      }

    };

    self.delete = function () {
      return Q.Promise(function (resolve, reject) {
        self.Model.destroy({
          success: function (ob) {
            resolve();
          },
          error: function (obj, error) {
            reject(error);
          }
        });
      });
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

    self.findOne = function (query) {
      return self.find(query)
        .then(function (models) {
          return models[0];
        });
    };

    self.find = function (query) {
      return Q.Promise(function (resolve, reject) {
        var q = new Parse.Query(Collection);

        if (typeof query === 'object') {
          Object.keys(query)
            .forEach(function (key) {
              if (query[key] instanceof Array) {
                q.containsAll(key, query[key]);
              } else {
                q.equalTo(key, query[key]);
              }
            });

          q.find({
            success: function (obs) {
              var models = [];

              obs.forEach(function (model) {
                models.push(new ParseModel(model));
              });

              resolve(models);

            },
            error: function (error) {
              reject(error);
            }
          });
        } else {
          reject(Error ("Need to have at least one key value pair."));
        }
      });
    };



    self.get = function (id) {
      self._promise = Q.Promise(function (resolve, reject) {
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

      return self;
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

  module.exports = setDB;
})();
