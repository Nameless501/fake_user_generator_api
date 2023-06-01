const winston = require('winston');

const expressWinston = require('express-winston');

class Logger {
    constructor(config) {
        this._config = config;
    }

    createLogger = (type) => {
        return expressWinston[this._config.method[type]]({
            transports: [
                new winston.transports.File({
                    filename: this._config.file[type],
                }),
            ],
            format: winston.format.json(),
        });
    };
}

module.exports = Logger;
