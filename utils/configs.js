const { BASE_FRONTEND_URL } = require('./constants');

const addressMethodsConfig = ['state', 'city', 'streetAddress'];

const loggerConfig = {
    method: {
        error: 'errorLogger',
        request: 'logger',
    },
    file: {
        error: 'error.log',
        request: 'request.log',
    },
};

const corsConfig = {
    origin: [BASE_FRONTEND_URL, 'http://localhost:3001'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    credentials: true,
};

module.exports = {
    corsConfig,
    loggerConfig,
    addressMethodsConfig,
};
