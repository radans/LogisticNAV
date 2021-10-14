const api = require('../express/api');
const wrap = require('../express/wrap');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const salespeopleService = require('../service/salespeople');
const usersService = require('../service/users');
const validate = require('../validation/salesperson');
const ValidationError = require('../validation/validation_error');

module.exports = (app) => {

    app.get('/salespeople', wrap(async (req, res) => {
        const all = await salespeopleService.allWithUsers();
        const users = await usersService.allActive();
        res.render('salespeople/people', {
            heading: 'Müügijuhid',
            pageScript: 'salespeople.bundle.js',
            list: all,
            users: users,
            menu: 'salespeople'
        });
    }));

    app.get('/salespeople/new', wrap(async (req, res) => {
        res.render('salespeople/new', {
            heading: 'Müügijuhi andmed',
            pageScript: 'salesperson.bundle.js',
            menu: 'salespeople'
        });
    }));

    app.get('/salespeople/:id', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = await salespeopleService.byId(id);
        res.render('salespeople/modify', {
            heading: 'Müügijuhi andmed',
            pageScript: 'salesperson.bundle.js',
            formData: data,
            menu: 'salespeople'
        });
    }));

    app.post('/api/salespeople/new', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return salespeopleService.save(data);
    }));

    app.put('/api/salespeople/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return salespeopleService.update(id, data);
    }));

    // TODO fix path to not contain /plan/.
    app.put('/api/plan/salesperson-users/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const users = req.body.users;
        return salespeopleService.setUsers(id, users);
    }));

    app.put('/api/salesperson-color/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const color = req.body;
        return salespeopleService.setColor(id, color);
    }));

    app.delete('/api/salesperson/:id', api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        return salespeopleService.removePerson(id);
    }));
};
