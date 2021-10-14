const moment = require('moment-timezone');
const package = require('../package.json');
const formatUnix = require('./format_unix');
const dateString = require('./date_string');

module.exports = (app) => {
    // App version.
    app.locals.version = package.version;
    // Default page title.
    app.locals.title = 'Veoteenuste tellimused | Lasita';
    app.locals.loggedIn = false;
    app.locals.user = null;
    // Deploy environment is production.
    app.locals.production = process.env.NODE_ENV === 'production';
    // Menu collapsed.
    app.locals.collapsed = false;
    app.locals.formatUnix = formatUnix;
    app.locals.dateToEstonian = dateString.toEstonian;
    app.locals.menu = 'unset';
    app.locals.formatUnixDate = (unix) => {
        if (typeof unix === null) {
            return '';
        }
        const date = new Date(unix * 1000);
        return moment(date).tz('Europe/Tallinn').format('DD.MM.YYYY');
    };
    app.locals.help = true;
    app.locals.unsetSettings = false;
};
