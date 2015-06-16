/**
 * Created by brianlandron on 5/29/15.
 */
var config = require('../config');
var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: config.aws.accessKeyId, secretAccessKey: config.aws.secretAccessKey});
AWS.config.region = 'us-east-1';

module.exports = AWS;