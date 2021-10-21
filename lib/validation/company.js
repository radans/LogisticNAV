const Errors = require('./errors');
const common = require('./common');

// Shared validator for companies.

module.exports = ({name, contact, email, address, phone}) => {
    const errors = new Errors();
    if (name === '') {
        errors.add('name', 'Nimi on jäänud sisestamata.');
    }
    if (contact === '') {
        errors.add('contact', 'Kontaktisiku nimi on jäänud sisestamata.');
    }
    if (email === '') {
        errors.add('email', 'E-post on jäänud sisestamata.');
    } else {
        if (!email.match(/^[^@]+@[^@]+$/)) {
            errors.add('email', 'E-posti formaat on tundmatu.');
        }
    }
    if (address === '') {
        errors.add('address', 'Aadress on jäänud sisestamata.');
    }
    if (phone === '') {
        errors.add('phone', 'Telefon on jäänud sisestamata.');
    } else {
        if (!phone.match(common.regex.PHONE)) {
            errors.add('phone', 'Telefoninumbri formaat on tundmatu.');
        }
    }
    return errors;
};
