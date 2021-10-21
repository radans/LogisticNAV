const Errors = require('./errors');
const common = require('./common');

module.exports = ({name, phone, password1, password2}) => {
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
    if (password1 === '') {
        errors.add('password1', 'Parool on jäänud sisestamata.');
    } else if (password1.length < 8) {
        errors.add('password1', 'Parooli miinimumpikkus on vähemalt 8 märki.');
    }
    if (password2 === '') {
        errors.add('password2', 'Parooli kontrollväärtus on jäänud sisestamata.');
    }
    if (password1 !== password2) {
        errors.add('password1', 'Parool ja parooli kontrollväärtus ei sobi kokku.');
        errors.add('password2', 'Parool ja parooli kontrollväärtus ei sobi kokku.');
    }
    return errors;
};
