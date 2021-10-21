const Errors = require('./errors');

module.exports = ({name}) => {
    const errors = new Errors();
    if (name === '') {
        errors.add('name', 'Nimi on jäänud sisestamata.');
    }
    return errors;
};
