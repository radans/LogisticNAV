const moment = require('moment-timezone');

exports.today = () => {
    return moment().format('YYYY-MM-DD');
};

exports.tomorrow = () => {
    return moment().add(1, 'days').format('YYYY-MM-DD');
};

exports.markToday = (array, prop) => {
    const today = exports.today();
    for (const item of array) {
        item.today = item[prop] === today;
    }
    return array;
};

exports.formatDate = (time) => {
    if (time) {
        const date = new Date(time * 1000);
        return moment(date).tz('Europe/Tallinn').format('DD.MM.YYYY');
    } else {
        return '';
    }
};

exports.nextWorkday = (date) => {
    const parsed = moment(date);
    if (parsed.day() === 5) {
        return parsed.add(3, 'days').format('YYYY-MM-DD');
    } else if (parsed.day() === 6) {
        return parsed.add(2, 'days').format('YYYY-MM-DD');
    } else {
        return parsed.add(1, 'days').format('YYYY-MM-DD');
    }
};

exports.prevWorkday = (date) => {
    const parsed = moment(date);
    if (parsed.day() === 1) {
        return parsed.add(-3, 'days').format('YYYY-MM-DD');
    } else if (parsed.day() === 0) {
        return parsed.add(-2, 'days').format('YYYY-MM-DD');
    } else {
        return parsed.add(-1, 'days').format('YYYY-MM-DD');
    }
};
