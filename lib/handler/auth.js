const assert = require('assert');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const wrap = require('../express/wrap');
const api = require('../express/api');
const validateLogin = require('../validation/login');
const validateRegister = require('../validation/register');
const validateRegisterConfirm = require('../validation/register_confirm');
const validatePassword = require('../validation/password');
const validatePasswordConfirm = require('../validation/password_confirm');
const ValidationError = require('../validation/validation_error');
const usersService = require('../service/users');
const Paginator = require('../paginator');

module.exports = (app) => {

    app.get('/login', wrap(async (req, res) => {
        res.render('auth/login', {
            heading: 'Sisene',
            pageScript: 'login.bundle.js'
        });
    }));

    app.get('/logout', wrap(async (req, res) => {
        req.clearUser();
        res.redirect('/login');
    }));

    app.get('/register', wrap(async (req, res) => {
        res.render('auth/register', {
            heading: 'Registreerumine',
            pageScript: 'register.bundle.js'
        });
    }));

    app.get('/register/confirm/:registrationId', wrap(async (req, res) => {
        res.render('auth/register_confirm', {
            heading: 'Registreerumine',
            registrationId: req.params.registrationId,            
            pageScript: 'register_confirm.bundle.js'
        });
    }));

    app.get('/password', wrap(async (req, res) => {
        res.render('auth/password', {
            heading: 'Parooli muutmine',
            pageScript: 'password.bundle.js'
        });
    }));

    app.get('/password/confirm/:registrationId', wrap(async (req, res) => {
        res.render('auth/password_confirm', {
            heading: 'Parooli muutmine',
            registrationId: req.params.registrationId,            
            pageScript: 'password_confirm.bundle.js'
        });
    }));

    app.get('/users', wrap(async (req, res) => {
        if (!req.user.master_user) {
            // TODO add AccessError.
            const error = new Error('Juurdepääs puudub.');
            error.status = 401;
            throw error;
        }
        const results = await usersService.list(
            new Paginator(req.query, { order: 'name' }));
        res.render('auth/users', {
            heading: 'Kasutajad',
            paginator: results.paginator,
            list: results.rows,
            menu: 'users',
            pageScript: 'users.bundle.js'
        });
    }));

    app.get('/mail/test', wrap(async (req, res) => {
        if (req.query.mail) {
            await usersService.testMail(req.query.mail);
        }
        res.send('Saadetud');
    }));

    app.post('/api/auth/check', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validateLogin(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        const { email, password } = data;
        await usersService.checkCredentials(email, password);
        req.setUser(email);
    }));

    app.post('/api/auth/register', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validateRegister(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        const { email } = data;
        return usersService.register(email);
    }));

    app.post('/api/auth/register-confirm/:registrationId',
        json(), api(async (req, res) => {
        const registrationId = req.params.registrationId;
        const data = req.body;
        const errors = validateRegisterConfirm(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }        
        const email = await usersService.registerConfirm(registrationId, data);
        req.setUser(email);
    }));

    app.post('/api/auth/password', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validatePassword(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        const { email } = data;
        return usersService.password(email);
    }));

    app.post('/api/auth/password-confirm/:registrationId',
        json(), api(async (req, res) => {
        const registrationId = req.params.registrationId;
        const data = req.body;
        const errors = validatePasswordConfirm(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }        
        const email = await usersService.passwordConfirm(registrationId, data);
        req.setUser(email);
    }));

    app.post('/api/auth/collapse', json(), api(async (req, res) => {
        const collapsed = !!req.body.collapsed;
        return usersService.saveCollapse(req.user.email, collapsed);
    }));

    app.put('/api/user/:userId',
        json(), api(async (req, res) => {
        // Only master can change these settings.
        assert.ok(req.user.master_user);
        const userId = parseInt(req.params.userId, 10);
        const data = req.body;        
        await usersService.configureUserAccess(req.user, userId, data);
    }));
};
