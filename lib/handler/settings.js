const fs = require('fs');
const path = require('path');
const util = require('util');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const api = require('../express/api');
const wrap = require('../express/wrap');
const formdata = require('../formdata');
const validateSettings = require('../validation/user_settings');
const validateMainSettings = require('../validation/main_settings');
const ValidationError = require('../validation/validation_error');
const usersService = require('../service/users');
const settingsService = require('../service/settings');

const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);

// TODO reduce code duplication.

const FILE_LOGO = path.join(__dirname, '..', '..', 'data', 'logo.png');
const FILE_LOADING_ET = path.join(__dirname, '..', '..', 'data', 'loading_et.pdf');
const FILE_LOADING_EN = path.join(__dirname, '..', '..', 'data', 'loading_en.pdf');
const FILE_LOADING_RU = path.join(__dirname, '..', '..', 'data', 'loading_ru.pdf');

module.exports = (app) => {

    app.get('/settings', wrap(async (req, res) => {
        res.render('settings/index', {
            heading: 'Seadistused',
            menu: 'settings'
        });
    }));

    app.get('/settings/user', wrap(async (req, res) => {
        const settings = await usersService.userSettings(req.user.email);
        res.render('settings/user', {
            heading: 'Kasutaja andmed',
            formData: settings,
            pageScript: 'user_settings.bundle.js',
            menu: 'settings'
        });
    }));

    app.get('/settings/logo', wrap(async (req, res) => {
        const logo = await settingsService.load('logo');
        res.render('settings/logo', {
            heading: 'Logo fail',
            settings: logo,
            pageScript: 'logo.bundle.js',
            menu: 'settings'
        });
    }));

    app.get('/settings/loading', wrap(async (req, res) => {
        const settings = await settingsService.load(
            ['loading_et', 'loading_en', 'loading_ru']);
        res.render('settings/loading', {
            heading: 'Laadimisjuhendid',
            settings: settings,
            pageScript: 'loading.bundle.js',
            menu: 'settings'
        });
    }));

    app.get('/settings/main', wrap(async (req, res) => {
        const settings = await settingsService.load(
            ['loading_upper', 'loading_bottom', 'loading_contacts']);
        res.render('settings/main', {
            heading: 'Põhiandmed',
            settings: settings,
            pageScript: 'main_settings.bundle.js',
            menu: 'settings'
        });
    }));

    app.get('/settings/file/:name', wrap(async (req, res) => {
        const name = req.params.name;
        if (name === 'logo') {
            res.sendFile(FILE_LOGO);
        } else if (name === 'loading_et') {
            res.sendFile(FILE_LOADING_ET);
        } else if (name === 'loading_en') {
            res.sendFile(FILE_LOADING_EN);
        } else if (name === 'loading_ru') {
            res.sendFile(FILE_LOADING_RU);
        } else {
            throw new Error(`File ${name} does not exist.`);
        }
    }));

    app.put('/api/settings/logo', api(async (req, res) => {
        const data = await formdata.create(req);
        const file = data.files.file[0].tmp;
        await rename(file, FILE_LOGO);
        await settingsService.save({ logo: 'saved' });
        return true;
    }));

    const LANGUAGES = ['et', 'en', 'ru'];

    app.put('/api/settings/loading', api(async (req, res) => {
        const data = await formdata.create(req);
        const saves = {};
        for (const lang of LANGUAGES) {
            if (data.files[lang]) {
                const file = data.files[lang][0].tmp;
                await rename(file, path.join(
                    __dirname, '..', '..', 'data', `loading_${lang}.pdf`));
                saves[`loading_${lang}`] = 'saved';
            }
        }
        if (Object.keys(saves).length > 0) {
            await settingsService.save(saves);
        }
    }));

    app.put('/api/settings/user', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validateSettings(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return usersService.saveSettings(req.user.email, data);
    }));

    app.put('/api/settings/main', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validateMainSettings(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        return settingsService.save({
            loading_upper: data.loading_upper,
            loading_bottom: data.loading_bottom,
            loading_contacts: data.loading_contacts
        });
    }));
};
