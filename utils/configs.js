const addressMethodsConfig = [
    { method: 'state', optional: true },
    { method: 'city', optional: false },
    { method: 'streetAddress', optional: false },
    { method: 'secondaryAddress', optional: true },
];

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

const csvParserConfig = {
    fields: [
        {
            label: '№',
            value: 'ind',
        },
        {
            label: 'Id',
            value: 'id',
        },
        {
            label: 'Name',
            value: 'name',
        },
        {
            label: 'Email',
            value: 'email',
        },
        {
            label: 'Phone number',
            value: 'phone',
        },
        {
            label: 'Address',
            value: 'address',
        },
    ],
};

module.exports = {
    loggerConfig,
    addressMethodsConfig,
    csvParserConfig,
};
