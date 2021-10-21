const bodyParser = require('body-parser');
const json = require('../middleware/json');
const api = require('../express/api');
const wrap = require('../express/wrap');
const validate = require('../validation/plan');
const ValidationError = require('../validation/validation_error');
const plansService = require('../service/plans');
const ordersService = require('../service/orders');
const usersService = require('../service/users');
const salespeopleService = require('../service/salespeople');
const Paginator = require('../paginator');

module.exports = (app) => {

    app.get('/plans', wrap(async (req, res) => {
        const results = await plansService.list(
            new Paginator(req.query, {
                order: 'updated_at',
                direction: 'DESC',
                defaultSearch: {
                    author_id: req.user.id,
                    package_code: null
                }
            }));
        const authors = await usersService.allWithPlans();
        const topAuthors = await usersService.topPlanAuthors();
        res.render('plans/plans', {
            heading: 'Koormaplaanid',
            paginator: results.paginator,
            list: results.rows,
            menu: 'plans',
            pageScript: 'plans.bundle.js',
            authors: authors,
            topAuthors: topAuthors
        });
    }));

    app.get('/plans/new', wrap(async (req, res) => {
        const orderId = parseInt(req.query.order, 10);
        let order = null;
        if (!isNaN(orderId)) {
            order = await ordersService.byId(orderId);
        }
        res.render('plans/new', {
            heading: 'Koormaplaan',
            pageScript: ['libs/knockout-3.4.2.min.js', 'plan.bundle.js'],
            pageStyle: 'koormaplaanid.css',
            order: order ? {
                id: order.id,
                name: order.order_name,
                menu: 'plans'
            } : null
        });
    }));

    app.get('/plan/:id', wrap(async (req, res) => {
        const planId = parseInt(req.params.id, 10);
        const plan = await plansService.byId(planId);
        const isCopy = req.query.copy === 'true';
        plan.data.id = planId;
        res.render('plans/plan', {
            heading: 'Koormaplaan' + (isCopy ? ' (koopia)' : ''),
            pageScript: ['libs/knockout-3.4.2.min.js', 'plan.bundle.js'],
            pageStyle: 'koormaplaanid.css',
            plan: plan.data,
            menu: 'plans'
        });
    }));

    app.get('/plan/:id/pdf', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const buffer = await plansService.planPdf(id);
        res.contentType('application/pdf');
        res.send(buffer);
    }));

    app.get('/plan/copy/:id', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const newId = await plansService.copy(id, req.user.id);
        res.redirect(`/plan/${newId}?copy=true`);
    }));

    app.post('/api/plan/new', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return plansService.save(req.user.id, data);
    }));

    app.put('/api/plan/:id', json(), api(async (req, res) => {
        const planId = parseInt(req.params.id, 10);
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return plansService.update(planId, req.user.id, data);
    }));

    app.delete('/api/plan/:id', api(async (req, res) => {
        const planId = parseInt(req.params.id, 10);
        return plansService.remove(planId);
    }));

    app.get('/api/packages/find/:token', api(async (req, res) => {
        const token = req.params.token;
        if (token.length < 5) {
            return [];
        }
        return plansService.findPackages(token);
    }));

    app.put('/api/plan/update-order/:planId', json(), api(async (req, res) => {
        const planId = parseInt(req.params.planId, 10);
        let orderId = parseInt(req.body.order_id, 10);
        if (orderId === 0 || Number.isNaN(orderId)) {
            orderId = null;
        }
        return plansService.associate(planId, orderId);
    }));

    app.get('/api/plan/for-selector/:planId', api(async (req, res) => {
        const planId = parseInt(req.params.planId, 10);
        return plansService.forSelector(planId);
    }));

    app.get('/api/plan/email-receivers/:planId', api(async (req, res) => {
        const planId = parseInt(req.params.planId, 10);
        return plansService.emailReceivers(planId);
    }));

    app.put('/api/plan/send-to-salespeople/:planId', json(), api(async (req, res) => {
        const planId = parseInt(req.params.planId, 10);
        const userEmails = req.body.userEmails;
        const user = req.user;
        return plansService.sendToSalespeople(planId, userEmails, user);
    }));
};
