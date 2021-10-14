const Errors = require('./errors');

module.exports = ({address}) => {
    const errors = new Errors();
    if (address === '') {
        errors.add('address', 'Aadress on jäänud sisestamata.');
    }    
    return errors;
};
