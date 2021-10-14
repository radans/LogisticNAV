const api = require('../express/api');
const wrap = require('../express/wrap');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const addressesService = require('../service/addresses');
const Paginator = require('../paginator');
const validate = require('../validation/address');
const ValidationError = require('../validation/validation_error');

const SEARCH_LIKE = [
    'search'
];

const searchHandler = (name, value) => {
    if (value === null) {
        return null;
    }
    if (SEARCH_LIKE.indexOf(name) >= 0) {
        return `%${value}%`;
    }
    return value;
};

module.exports = (app) => {

    app.get('/addresses', wrap(async (req, res) => {
        const results = await addressesService.list(
            new Paginator(req.query, {
                order: 'address',
                defaultSearch: {
                    search: null,
                    archived: null
                },
                searchHandler
            }));
        res.render('addresses/addresses', {
            heading: 'Aadressid',
            paginator: results.paginator,
            list: results.rows,
            menu: 'addresses',
            pageScript: 'addresses.bundle.js'
        });
    }));

    app.get('/addresses/new', wrap(async (req, res) => {
        res.render('addresses/new', {
            heading: 'Uus aadress',
            menu: 'addresses',
            pageScript: 'address.bundle.js'
        });
    }));

    app.get('/api/addresses/:token', api(async (req, res) => {
        return addressesService.search(req.params.token);
    }));

    app.put('/api/address/:id', json(), api(async (req, res) => {
        const aadressId = parseInt(req.params.id, 10);
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return addressesService.update(aadressId, data);
    }));

    app.post('/api/address', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return addressesService.saveNew(data);
    }));
};
