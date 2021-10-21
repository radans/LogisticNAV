const Errors = require('./errors');

module.exports = ({email}) => {
    const errors = new Errors();
    if (email === '') {
        errors.add('email', 'E-post on jäänud sisestamata.');
    } else {
        if (!email.match(/^[^@]+@[^@]+$/)) {
            errors.add('email', 'E-posti formaat on tundmatu.');
        }
        if (!email.match(/^[^@]+@lasita.com$/)) {
            errors.add('email', 'E-posti aadress peab olema lasita.com lõpuga.');
        }
    }
    return errors;
};
