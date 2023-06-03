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
        this._isSameRequest = false;
        this._prevRequest = '';
    }

    _compareRequests = ({ seed, page, locale, sessionId }) => {
        const currentParams = `${locale}${seed}${page}`;
        this._isSameRequest = this._paramters === currentParams && this._sessionId === sessionId;
        this._paramters = currentParams;
        this._sessionId = sessionId;
    };

    _saveParams = ({ seed, page, locale, mistakes }) => {
        this._page = Number(page);
        this._locale = locale;
        this._seed = seed ? Number(`${seed}${page}`) : '';
        this._mistakes = Number(mistakes);
    };

    _setFakerParams = () => {
        this._localeFaker = allFakers[this._locale];
        this._localeFaker.seed(this._seed);
    };

    _parseRequestParams = (req) => {
        const params = req.query;
        this._saveParams(params);
        this._setFakerParams();
        this._compareRequests(params);
    };

    _useWithRandomProbability = (method) =>
        this._localeFaker.helpers.maybe(method, {
            probability: faker.number.float({ min: 0, max: 1, precision: 0.1 }),
        });

    _generateRandomAddress = () =>
        addressMethodsConfig
            .reduce((address, { method, optional }) => {
                const currentMethod = this._localeFaker.location[method];
                const current = optional
                    ? this._useWithRandomProbability(() => currentMethod())
                    : currentMethod();
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
        this._localeFaker.helpers.multiple(() => this._generateRandomPerson(), {
            count:
                this._page > 1
                    ? NEXT_PAGE_ELEMENTS_COUNT
                    : FIRST_PAGE_ELEMENTS_COUNT,
        });

    _storeData = () => {
        this._allData =
            this._page === 1
                ? this._resultData
                : [...this._allData, ...this._resultData];
    };

    _setMistakes = () => {
        this._resultData = this._currentData.map((data) =>
            this._handleMistakes({
                data: { ...data },
                seed: this._seed,
                chance: this._mistakes,
                locale: this._locale,
            })
        );
    };

    sendRandomData = (req, res, next) => {
        try {
            this._parseRequestParams(req);
            if (!this._isSameRequest) {
                this._currentData = this._getMultiplePersons();
            }
            this._setMistakes();
            this._storeData();
            res.send(this._resultData);
        } catch (err) {
            next(err);
        }
    };

    getCurrentData = () => this._allData;
}

module.exports = Random;
