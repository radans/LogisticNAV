const fs = require('fs');
const util = require('util');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const api = require('../express/api');
const wrap = require('../express/wrap');
const packagesService = require('../service/packages');
const Paginator = require('../paginator');
const formdata = require('../formdata');

const unlink = util.promisify(fs.unlink);

const SEARCH_LIKE = ['code', 'name'];

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

    app.get('/packages', wrap(async (req, res) => {
        const results = await packagesService.list(
            new Paginator(req.query, {
                order: 'code',
                direction: 'ASC',
                defaultSearch: {
                    code: null,
                    name: null,
                    archived: null
                },
                searchHandler
            }));
        res.render('packages/index', {
            heading: 'Koormapakid',
            paginator: results.paginator,
            list: results.rows,
            menu: 'packages',
            pageScript: 'packages.bundle.js'
        });
    }));

    app.get('/packages/excel', wrap(async (req, res) => {
        res.render('packages/excel', {
            heading: 'Koormapakid failist',
            pageScript: 'packages_excel.bundle.js'
        });
    }));

    app.put('/api/packages/:code', json(), api(async (req, res) => {
        const code = req.params.code;
        const data = req.body;
        return packagesService.update(code, data);
    }));

    app.post('/api/packages/update-sheet', api(async (req, res) => {
        const data = await formdata.create(req);
        const file = data.files.file[0].tmp;
        const result = await packagesService.updateFromExcel(file);
        await unlink(file);
        return true;
    }));
};
