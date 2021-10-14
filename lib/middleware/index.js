const path = require('path');
const express = require('express');
const buster = require('./buster');
const cookies = require('./cookies');
const session = require('./session');
const user = require('./user');
const access = require('./access');

module.exports = (app) => {
    app.use(buster());
    const staticOptions = {};
    if (process.env.NODE_ENV === 'production') {
        staticOptions.maxAge = '30d';
    }
    app.use((req, res, next) => {
        if (req.url === '/veopildid.apk') {
            res.redirect('/Veopildid.apk');
        } else {
            next();
        }
    });
    app.use(express.static(
        path.join(__dirname, '..', '..', 'public'),
        staticOptions));
    app.use(cookies());
    app.use(session());
    app.use(user());
    app.use(access());
};
