const config = require('config');
const winston = require('winston');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
    }
};