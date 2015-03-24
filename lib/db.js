var config = require('../config');
var Parse = require('parse').Parse;
Parse.initialize(config.parse.appId, config.parse.jsKey);

module.exports = Parse;
