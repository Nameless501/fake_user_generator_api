const { allFakers } = require('@faker-js/faker');

const {
    FIRST_PAGE_ELEMENTS_COUNT,
    NEXT_PAGE_ELEMENTS_COUNT,
} = require('../utils/constants');

const { addressMethodsConfig } = require('../utils/configs');

class Random {
    constructor() {
        this._allData = [];
    }
    _parseParams = (req) => {
        const { seed, page, locale, mistakes } = req.query;
        this._page = Number(page);
        this._locale = locale;
        this._seed = seed ? Number(seed) : null;
        this._mistakes = mistakes ? Number(mistakes) : null;
    };

    _setFakerParams = () => {
        this._localeFaker = allFakers[this._locale];
        if (this._seed) {
            this._localeFaker.seed(Number(`${this._seed}${this._page}`));
        }
    };

    _generateRandomAddress = () =>
        addressMethodsConfig
            .reduce(
                (address, method) => [
                    ...address,
                    this._localeFaker.location[method](),
                ],
                []
            )
            .join(', ');

    _generateRandomPerson = () => ({
        id: this._localeFaker.string.uuid(),
        email: this._localeFaker.internet.email(),
        name: this._localeFaker.person.fullName(),
        phone: this._localeFaker.phone.number(),
        address: this._generateRandomAddress(),
    });

    _getMultiplePersons = () =>
        this._localeFaker.helpers.multiple(this._generateRandomPerson, {
            count:
                this._page > 1
                    ? NEXT_PAGE_ELEMENTS_COUNT
                    : FIRST_PAGE_ELEMENTS_COUNT,
        });

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
