const { Parser } = require('@json2csv/plainjs');

const { csvParserConfig } = require('../utils/configs');

class Download {
    constructor(getData) {
        this._getData = getData;
    }

    _getDataWithIndexes = () => {
        const data = this._getData();
        return data.map((elem, ind) => {
            elem.ind = ind + 1;
            return elem;
        });
    };

    sendFile = (req, res, next) => {
        const data = this._getDataWithIndexes();
        const parser = new Parser(csvParserConfig);
        const csv = parser.parse(data);
        res.send(csv);
    };
}

module.exports = Download;
