const Errors = require('./errors');
const common = require('./common');

// Shared validator for user settings.

module.exports = ({name, phone, order_email}) => {
    const errors = new Errors();
    if (name === '') {
        errors.add('name', 'Nimi on jäänud sisestamata.');
    }
    if (phone === '') {
        errors.add('phone', 'Telefoninumber on jäänud sisestamata.');
    } else {
        if (!phone.match(common.regex.PHONE)) {
            errors.add('phone', 'Telefoninumbri formaat on tundmatu.');
        }
    }
    if (order_email === '') {
        errors.add('order_email', 'Tellimuse e-post on jäänud sisestamata.');
    } else {
        if (!order_email.match(/^[^@]+@[^@]+$/)) {
            errors.add('order_email', 'E-posti formaat on tundmatu.');
        }
    }
    return errors;
};
