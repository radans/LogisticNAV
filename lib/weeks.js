const assert = require('assert');
const moment = require('moment-timezone');

const RANGE_LENGTH = 8;

class Week {

    constructor(dateMoment) {
        this.week = dateMoment.isoWeek();
        this.date = dateMoment.format('YYYY-MM-DD');
    }
}

module.exports = class Weeks {

    constructor(date) {
        assert.ok(date instanceof Date);
        const dateMoment = moment(date);
        this.current = new Week(dateMoment);
        this.prev = [];
        this.next = [];
        for (let i = 1; i <= RANGE_LENGTH; i++) {
            this.prev.unshift(
                new Week(moment(date).subtract(i * 7, 'days')));
        }
        for (let i = 1; i <= RANGE_LENGTH; i++) {
            this.next.push(
                new Week(moment(date).add(i * 7, 'days')));
        }
    }
};
