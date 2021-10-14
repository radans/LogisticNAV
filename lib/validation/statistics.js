const Errors = require('./errors');

module.exports = ({start, end}) => {
    const errors = new Errors();
    if (start.trim() === '') {
        errors.add('start', 'Alguse kuupäev on jäänud sisestamata.');
    }
    if (end.trim() === '') {
        errors.add('end', 'Lõpu kuupäev on jäänud sisestamata.');
    }
    return errors;
};
