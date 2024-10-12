const express = require('express');
const app = express();
const winston = require('winston');
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app)

// process.on('uncaughtException', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

// winston.exceptions.handle(
//     new winston.transports.File({ filename: 'Uncaught.log' }),
//     new winston.transports.MongoDB({
//     db: 'mongodb://localhost/vidly',
// }),
// );

// process.on('unhandledRejection', (ex) => {
//     winston.error(ex.message, ex);
//     process.exit(1);
// });

// process.on('unhandledRejection', (ex) => {
//     throw ex;
// });

// const p = Promise.reject(new Error('Something failed miserably'));
// p.then(() => console.log("Done"));

// throw new Error('Uncaught Exception.');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;