const winston = require('winston');

const logger = winston.createLogger({
    level: 'info', // Set log level (info, warn, error, debug)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/app.log' }) // Save logs to file
    ]
});

module.exports = logger;
