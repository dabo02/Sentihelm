/**
 * Created by israel on 10/14/15.
 */
(function() {

    "use strict";

    var express = require('express');
    var db = require('../lib/db');
    var util = require('../lib/util');
    var Q = require('q');
    var _ = require('lodash');
    var multiparty = require('connect-multiparty');
    var config = require('../config');
    var fs = require('fs');
    var Client = db.Object.extend("Client");
    var MostWanted = db.Object.extend("MostWanted");


    module.exports.getMostWantedList = function (session){

        return Q.Promise(function(resolve,reject, notify) {
            var clientQuery = new db.Query(Client);
            clientQuery.include('mostWantedList');
            clientQuery.get(session.user.homeClient.objectId, {
                success: function (client) {
                    var mostWantedArray = client.get('mostWantedList');
                    var list = mostWantedArray.map(function (item) {
                        return item ? item.toJSON() : {};
                    });

                    // Performming deep copy, as reference to object dies once this function, exits
                    resolve(list);
                },
                error: function (object, error) {
                    reject(error);
                }
            });
        });
    };

    module.exports.saveMostWantedList = function(body, session){
        return Q.Promise(function(resolve,reject,notify){
            var newList = body.list;

            new db.Query(Client)
                .get(session.user.homeClient.objectId)
                .then(function (clientParseObj) {
                    return Q.Promise(function (resolve, reject) {
                        clientParseObj.unset('mostWantedList');
                        _.forEach(newList, function (person, index, array) {
                            var personData = {
                                __type: "Pointer",
                                className: "MostWanted",
                                objectId: person.objectId
                            };
                            //clientParseObj.remove('mostWantedList', personData);
                            clientParseObj.add('mostWantedList', personData);
                            clientParseObj.save()
                                .then(function (client) {
                                    //client.add('mostWantedList', personData);
                                    if (index === array.length - 1) {
                                        //client.save();
                                        resolve();
                                    }
                                });
                        });
                    });
                })
                .then(function () {
                    resolve();
                }, function (e) {
                    reject(error);
                });
        });

    };

    module.exports.deleteFromMostWanted = function (params,session) {
        return Q.Promise(function(resolve,reject,notify){
            new db.Query(Client)
                .get(session.user.homeClient.objectId)
                .then(function (clientParseObj) {
                    new db.Query(MostWanted)
                        .get(params.personId)
                        .then(function (wantedPerson) {
                            return wantedPerson.destroy().then(function (deletedPerson) {
                                //Do something with the deleted object?
                                clientParseObj.remove("mostWantedList", {
                                    __type: "Pointer",
                                    className: "MostWanted",
                                    objectId: deletedPerson.id
                                });
                                return clientParseObj.save();
                            });
                        })
                        .then(function () {
                            resolve();
                        }, function (d, e) {
                            reject(error);
                        });
                });
        });
    };

    module.exports.saveMostWanted = function (body,session,files) {
        return Q.Promise(function(resolve,reject,notify){
            var person = typeof body.person !== 'string' ? body.person : JSON.parse(body.person);
            var newTip = JSON.parse(body.new) || false;
            if (files) {
                var imageFile = files.file || null;
            }

            function getPerson() {
                return Q.Promise(function (resolve, reject) {
                    if (newTip) {
                        resolve(new MostWanted());
                    } else {
                        // otherwhise the prson already exists, so let's look for 'em.
                        new db.Query(MostWanted)
                            .get(person.objectId)
                            .then(function (person) {
                                resolve(person);
                            }, function (e) {
                                // something went wrong, handle it somewhere!
                                reject(e);
                            });
                    }
                });
            }

            // start the promise chain.
            getPerson()
                .then(function (wantedPerson) {
                    // Set the person's properties here.
                    Object.keys(person).forEach(function (key) {
                        if (key !== 'objectId' && key !== 'photoUrl' && key !== 'photo') {
                            wantedPerson.set(key, person[key]);
                        }

                    });

                    if (imageFile) {
                        fs.readFile(imageFile.path, function (err, data) {
                            wantedPerson.set('photo', new db.File(imageFile.name, {
                                base64: data.toString('base64')
                            }));
                            wantedPerson.save();
                        });
                    }
                    //
                    return wantedPerson.save()
                        .then(function (wantedPerson) {
                            /**
                             * Add the person to the client's mostWantedList array if we have
                             * a new person (index of -1).
                             */
                            return new db.Query(Client)
                                .include('mostWantedList')
                                .get(session.user.homeClient.objectId)
                                .then(function (clientParseObj) {
                                    if (newTip) {
                                        clientParseObj.add("mostWantedList", {
                                            __type: "Pointer",
                                            className: "MostWanted",
                                            objectId: wantedPerson.id
                                        });
                                    }

                                    // save the list and continue execution.
                                    clientParseObj.save();
                                });

                        });
                })
                .then(function () {
                    resolve();
                }, function (error) { // An error has occured along the promise chain
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    reject(error);
                });
        });
    };
})();