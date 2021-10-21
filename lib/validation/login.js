const Errors = require('./errors');

// Shared validator for login credentials.

module.exports = ({email, password}) => {
    const errors = new Errors();
    if (email === '') {
        errors.add('email', 'E-post on jäänud sisestamata.');
    } else {
        if (!email.match(/^[^@]+@[^@]+$/)) {
            errors.add('email', 'E-posti formaat on tundmatu.');
        }
    }
    if (password === '') {
        errors.add('password', 'Parool on jäänud sisestamata.');
    }
    return errors;
};
