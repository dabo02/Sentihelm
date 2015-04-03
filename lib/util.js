var db = require('./db');
var Q = require('q');

module.exports.restrict = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("You don't have access to this action");
    }
};


module.exports.logIn = function (username, password) {
    return Q.Promise(function (resolve, reject) {
        db.User.logIn(username, password)
            .then(function (user) {
                resolve(user);
            }, function (error) {
                reject(error);
            });
    });
};
var PasswordGenerator = require('../lib/PasswordGenerator.js');
var EncryptionManager = require('../lib/EncryptionManager.js');

module.exports.passwordGenerator = new PasswordGenerator();

//Encrypts and decrypts
module.exports.encryptionManager = new EncryptionManager();
