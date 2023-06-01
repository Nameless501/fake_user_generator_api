const router = require('express').Router();

require('dotenv').config();

const NotFoundError = require('../errors/NotFoundError');

const Random = require('../controllers/Random');

const random = new Random();

router.get('/random', random.sendRandomData);

router.use((req, res, next) => next(new NotFoundError()));

module.exports = router;
