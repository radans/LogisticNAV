const Errors = require('./errors');

// Shared validator for user settings.

module.exports = ({cancelled, cancel_text}) => {
    const errors = new Errors();
    if (cancelled) {
        if (cancel_text === '') {
            errors.add('cancel_text', 'Tühistamise selgitus on jäänud sisestamata.');
        }        
    }
    return errors;
};
