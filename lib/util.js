var Parse = require('./db');
var Q = require('q');

module.exports.restrict = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("You don't have access to this action");
    }
};


module.exports.logIn = function (username, password) {
    return Q.fcall(function () {
        var defered = Q.defer();
        Parse.User.logIn(username, password)
            .then(function (user) {
                defered.resolve(user);
            }, function (error) {
                defered.reject(error);
            });

        return defered.promise;
    });
};
var PasswordGenerator = require('../lib/PasswordGenerator.js');
var EncryptionManager = require('../lib/EncryptionManager.js');

module.exports.passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
module.exports.encryptionManager = new EncryptionManager();
