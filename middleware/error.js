const winston = require('winston');

module.exports = function (err, req, res, next) {
    // winston.add(new winston.transports.Console({ message: err.message, meta: err }));
    // winston.error(err.message, { metadata: err });
    winston.error(err.message, err);
    res.status(500).send('Something Failed');
};