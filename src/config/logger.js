const winston = require('winston');
const rootPath = require('app-root-path');
const moment = require('moment-timezone');
const config = require('./config');

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(info => {
    let date = moment().tz('Asia/Seoul');
    return `${date.format()} [${info.level}] ${info.message}`;
});

const options = {
    file: {
        filename: `${rootPath}/logs/myspec.log`,
        level: 'info',
        format: combine(
            timestamp(),
            logFormat,
        ),
        json: true,
        colorize: true,
        handleExceptions: true,
    },
    console: {
        level: 'debug',
        format: combine(
            timestamp(),
            logFormat,
        ),
        json: false,
        colorize: true,
        handleExceptions: true,
    }
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file)
    ],
    exitOnError: false
});

logger.stream = {
    write: message => {
        logger.info(message)
    }
}

if(config.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console(options.console));
}

module.exports = logger;