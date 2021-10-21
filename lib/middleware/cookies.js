const config = require('../config');
const Cookies = require('cookies');

// Application-specific cookie handling.

if (!config.session.key) {
    throw new Error('Session key is not set.');
}

module.exports = () => {
    return (req, res, next) => {
        req.cookies = new Cookies(req, res, { keys: [ config.session.key ] });
        next();
    };
};
