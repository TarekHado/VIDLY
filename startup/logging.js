require('express-async-errors');
const winston = require('winston');
// require('winston-mongodb');
const { combine, timestamp, json, errors } = winston.format;

module.exports = function () {
    const logger = winston.createLogger({
        level: "info",
        format: combine(errors({ stack: true }), timestamp(), json()),
        // transports: [
        //     new winston.transports.File({ filename: 'logfile.log', level: 'error',
        //     format: combine(timestamp(), json()), })
        // ],
        exceptionHandlers: [
            // new winston.transports.Console({ colorize: true, prettyPrint: true}),
            new winston.transports.File({ filename: 'exception.log' }),
        ],
        rejectionHandlers: [
            // new winston.transports.Console({ colorize: true, prettyPrint: true}),
            new winston.transports.File({ filename: 'rejections.log' }),
        ],
    });
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    // winston.add(new winston.transports.MongoDB({
    //     db: 'mongodb://localhost/vidly',
    //     format: combine(errors({ stack: true }), timestamp(), json())
    // }));
    winston.add(new winston.transports.Console({ colorize: true, prettyPrint: true }));
};