var config = require('../config');
var Parse = require('parse/node').Parse;
Parse.initialize(config.parse.appId, config.parse.jsKey, config.parse.masterKey);
Parse.serverURL = config.parse.serverUrl;
// After initializing parse, we just return an instance of it
module.exports = Parse;
