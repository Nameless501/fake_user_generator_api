const express = require('express');

require('dotenv').config();

const cors = require('cors');

const helmet = require('helmet');

const rateLimit = require('express-rate-limit');

const Logger = require('./middlewares/Logger');

const { corsConfig, loggerConfig } = require('./utils/configs');

const {
    DEFAULT_ERROR_CODE,
    DEFAULT_ERROR_MESSAGE,
} = require('./utils/constants');

const { PORT } = process.env;

const logger = new Logger(loggerConfig);

const app = express();

app.use(helmet());

app.use('*', cors(corsConfig));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(logger.createLogger('request'));

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

app.use('/', require('./routers'));

app.use(logger.createLogger('error'));

app.use((err, req, res, next) =>
    res
        .status(err.statusCode ?? DEFAULT_ERROR_CODE)
        .send({ message: err.statusCode ? err.message : DEFAULT_ERROR_MESSAGE })
);

app.listen(PORT);
