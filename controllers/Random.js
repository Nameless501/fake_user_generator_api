const { allFakers, faker } = require('@faker-js/faker');

const {
    FIRST_PAGE_ELEMENTS_COUNT,
    NEXT_PAGE_ELEMENTS_COUNT,
} = require('../utils/constants');

const { addressMethodsConfig } = require('../utils/configs');

class Random {
    constructor(handleMistakes) {
        this._handleMistakes = handleMistakes;
        this._allData = [];
    }
    _parseParams = (req) => {
        const { seed, page, locale, mistakes } = req.query;
        this._page = Number(page);
        this._locale = locale;
        this._seed = seed ? Number(`${seed}${page}`) : '';
        this._mistakes = Number(mistakes);
    };

    _setFakerParams = () => {
        this._localeFaker = allFakers[this._locale];
        this._localeFaker.seed(this._seed);
    };

    _generateRandomAddress = () =>
        addressMethodsConfig
            .reduce((address, { method, optional }) => {
                const probability = {
                    probability: optional
                        ? faker.number.float({ min: 0, max: 1, precision: 0.1 })
                        : 1,
                };
                const current = this._localeFaker.helpers.maybe(
                    () => this._localeFaker.location[method](),
                    probability
                );
                return current ? [...address, current] : address;
            }, [])
            .join(', ');

    _generateRandomPerson = () => ({
        id: this._localeFaker.string.numeric(10),
        email: this._localeFaker.internet.email(),
        name: this._localeFaker.person.fullName(),
        phone: this._localeFaker.phone.number(),
        address: this._generateRandomAddress(),
    });

    _getMultiplePersons = () =>
        this._localeFaker.helpers.multiple(
            () =>
                this._handleMistakes({
                    data: this._generateRandomPerson(),
                    seed: this._seed,
                    chance: this._mistakes,
                    locale: this._locale,
                }),
            {
                count:
                    this._page > 1
                        ? NEXT_PAGE_ELEMENTS_COUNT
                        : FIRST_PAGE_ELEMENTS_COUNT,
            }
        );

    _storeData = () => {
        this._allData =
            this._page === 1
                ? this._newData
                : [...this._allData, ...this._newData];
    };

    sendRandomData = (req, res, next) => {
        try {
            this._parseParams(req);
            this._setFakerParams();
            this._newData = this._getMultiplePersons();
            this._storeData();
            res.send(this._newData);
        } catch (err) {
            next(err);
        }
    };

    getCurrentData = () => this._allData;
}

module.exports = Random;
