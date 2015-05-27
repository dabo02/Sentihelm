var config = require('../config');
var Parse = require('parse').Parse;
Parse.initialize(config.parse.appId, config.parse.jsKey);

// After initializing parse, we just return an instance of it
module.exports = Parse;
