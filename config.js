var path = require('path');

module.exports = {
    parse: {
    /*
        appId: 'csvQJc5N6LOCQbAnzeBlutmYO0e6juVPwiEcW9Hd',
        jsKey: 'T9wCcLw0g1OBtlVg0s2gQoGITog5a0p77Pg3CIor'
        */
        appId: 'ppejTan0nxzC495cG2et1zIlHfkiHGc9ONUYCkNL',
        jsKey: 'oC7TEezvGdh3FTZJneATR23UN47E9uAO7rzstK6A'

    },
    opentok: {
        /*
        key: '44755992',
        secret: '66817543d6b84f279a2f5557065b061875a4871f'
         */
        key: '44999872',
        secret: '285e2ae6786c262146dcd2d0dd16e676ef120f9d'

    },
    aws: {

        accessKeyId: 'AKIAI7FBDAXKQOTH7A5Q',
        secretAccessKey: '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'
    },

    tmp: path.join(__dirname, './tmp'),
    serverRoot: __dirname
};
