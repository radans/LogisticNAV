const Errors = require('./errors');

// Shared validator for order data.

module.exports = (values) => {
    const {
        name,
        loading_date,
        country,
        price,
        onload,
        unload
    } = values;
    const errors = new Errors();
    if (name.trim() === '') {
        errors.add('name', 'Nimi on jäänud sisestamata.');
    }
    if (loading_date.trim() === '') {
        errors.add('loading_date', 'Kuupäev on jäänud sisestamata.');
    }
    if (country.trim() === '') {
        errors.add('country', 'Riik on jäänud sisestamata.');
    }
    if (price.trim() !== '') {
        if (!price.match(/^\d+(\.\d+)?$/)) {
            errors.add('price', 'Hind pole numbriline väärtus.');
        } else {
            const priceNumber = parseFloat(price);
            if (Number.isNaN(priceNumber)) {
                errors.add('price', 'Hind pole numbriline väärtus.');
            } else {
                if (priceNumber <= 0) {
                    errors.add('price', 'Hind pole positiivne.');
                }
            }
        }
    }
    if (!hasNonEmptyLoad(onload)) {
        errors.add('onload', 'Pealelaadimise aadress puudub.');
    }
    for (const place of onload) {
        if (!place.time.match(/^\d\d:\d\d$/)) {
            errors.add('unload', 'Pealelaadimise kellaaja formaat ei ole HH:mm.');
        }
    }
    return errors;
};

const hasNonEmptyLoad = (array) => {
    for (const item of array) {
        if (item.address.trim() !== '') {
            return true;
        }
    }
    return false;
};
