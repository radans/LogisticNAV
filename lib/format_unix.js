const moment = require('moment-timezone');

// Formats Unix timestamp as date.

module.exports = (time) => {
    if (time) {
        const date = new Date(time * 1000);
        return moment(date).format('DD.MM.YYYY HH:mm:ss');
    } else {
        return '-';
    }
};
