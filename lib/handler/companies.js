const assert = require('assert');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const wrap = require('../express/wrap');
const api = require('../express/api');
const validate = require('../validation/company');
const ValidationError = require('../validation/validation_error');
const companiesService = require('../service/companies');
const Paginator = require('../paginator');

module.exports = (app) => {

    app.get('/companies', wrap(async (req, res) => {
        const results = await companiesService.list(
            new Paginator(req.query, { order: 'name' }));
        res.render('companies/companies', {
            heading: 'Vedajad',
            paginator: results.paginator,
            list: results.rows,
            menu: 'companies'
        });
    }));

    app.get('/company/new', wrap(async (req, res) => {
        res.render('companies/new', {
            heading: 'Vedaja andmed',
            pageScript: 'company.bundle.js',
            menu: 'companies'
        });
    }));

    app.get('/company/modify/:id', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = await companiesService.byId(id);
        res.render('companies/modify', {
            heading: 'Vedaja andmed',
            pageScript: 'company.bundle.js',
            formData: data,
            menu: 'companies'
        });
    }));

    app.get('/companies/:id', wrap(async (req, res) => {
        const companyId = parseInt(req.params.id, 10);
        const company = await companiesService.byId(companyId);
        const uncommitted = await companiesService.uncommitted(companyId);
        const results = await companiesService.ordersList(
            new Paginator(req.query, {
                order: 'order_name',
                additionalParams: { companyId }
            }));        
        res.render('companies/company', {
            heading: company.name,
            id: companyId,
            menu: 'companies',
            paginator: results.paginator,
            list: results.rows,
            uncommitted: uncommitted
        });
    }));

    app.post('/api/company/new', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return companiesService.save(data);
    }));

    app.put('/api/company/update/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return companiesService.update(id, data);
    }));
};
