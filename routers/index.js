const router = require('express').Router();

require('dotenv').config();

const NotFoundError = require('../errors/NotFoundError');

const Random = require('../controllers/Random');

const Download = require('../controllers/Download');

const Mistake = require('../controllers/Mistakes');

const mistake = new Mistake();

const random = new Random(mistake.makeMistakes.bind(mistake));

const download = new Download(random.getCurrentData);

router.get('/random', random.sendRandomData);

router.get('/download', download.sendFile);

router.use((req, res, next) => next(new NotFoundError()));

module.exports = router;
