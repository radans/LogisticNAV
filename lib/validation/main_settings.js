const Errors = require('./errors');

module.exports = (values) => {
    const {
        loading_upper,
        loading_bottom,
        loading_contacts
    } = values;
    const errors = new Errors();
    if (loading_upper === '') {
        errors.add('loading_upper', 'Ülemine versiooninumber on jäänud sisestamata.');
    }
    if (loading_bottom === '') {
        errors.add('loading_bottom', 'Alumine versiooninumber on jäänud sisestamata.');
    }
    if (loading_contacts === '') {
        errors.add('loading_contacts', 'Kontaktandmed on jäänud sisestamata.');
    }
    return errors;
};
