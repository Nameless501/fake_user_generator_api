const { faker, allFakers } = require('@faker-js/faker');

class Mistake {
    _getRandomIndex = (str) => {
        return faker.number.int({ min: 0, max: str.length - 1 });
    };

    _deleteSymbol = (str) => {
        if (str.length > 0) {
            const randomIndex = this._getRandomIndex(str);
            return [...str].filter((elem, ind) => ind !== randomIndex).join('');
        } else {
            return str;
        }
    };

    _swapSymbols = (str) => {
        const arr = [...str];
        if (str.length >= 2) {
            const first = this._getRandomIndex(str);
            const second = first < str.length - 1 ? first + 1 : first - 1;
            arr.splice(
                Math.min(first, second),
                2,
                arr[Math.max(first, second)],
                arr[Math.min(first, second)]
            );
        }
        return arr.join('');
    };

    _getRandomLocaleLetter = () => {
        const randomWord = this._localeFaker.lorem.word();
        return randomWord[this._getRandomIndex(randomWord)];
    };

    _addSymbol = (str) => {
        const randomIndex = str.length > 0 ? this._getRandomIndex(str) : 0;
        const randomLetter = this._getRandomLocaleLetter();
        const newStr = [...str];
        newStr.splice(randomIndex, 0, randomLetter);
        return newStr.join('');
    };

    _getRandomMistake = (str) => {
        const methods = ['_deleteSymbol', '_swapSymbols', '_addSymbol'];
        const randomMethod = faker.helpers.arrayElement(methods);
        return this[randomMethod](str);
    };

    _setMistake = () => {
        const randomKey = faker.helpers.objectKey(this._data);
        this._data[randomKey] = this._getRandomMistake(this._data[randomKey]);
    };

    _repeatMistakes = () => {
        while (this._chance > 0) {
            faker.helpers.maybe(() => this._setMistake(), {
                probability: this._chance,
            });
            this._chance -= 1;
        }
    };

    _setParams = ({ data, chance, locale, seed }) => {
        this._data = data;
        this._chance = chance;
        this._localeFaker = allFakers[locale];
        faker.seed(seed);
    };

    makeMistakes = (data) => {
        this._setParams(data);
        this._repeatMistakes();
        return this._data;
    };
}

module.exports = Mistake;
