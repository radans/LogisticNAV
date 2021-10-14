const assert = require('assert');
const moment = require('moment-timezone');

class TimeRow {

    // Argument orders is an array of 7 elements.
    constructor(time, orders) {
        this.time = time;
        this.orders = orders;
    }
}

// Orders grouped into a single loading time value.

class TimeGroup {

    constructor(time, orders, days) {
        const map = groupByDate(orders);
        // Max number of loadings at the same day at the same time.
        const maxCountPerDay = Array.from(map.keys()).reduce((prev, cur) => {
            return Math.max(prev, map.get(cur).length);
        }, 0);
        this.rows = [];
        for (let i = 0; i < maxCountPerDay; i++) {
            const row = [];
            for (const day of days) {
                const entries = map.get(day) || [];
                row.push(entries[i]);
            }
            this.rows.push(new TimeRow(time, row));
        }
    }
}

const salespeople = (orders) => {
    const people = new Set();
    for (const order of orders) {
        if (order.salesperson) {
            people.add(order.salesperson);
        }
    }
    const array = Array.from(people.values());
    array.sort((p1, p2) => {
        return p1.name === p2.name ? 0 : (p1.name < p2.name ? -1 : 1);
    });
    return array;
};

exports.Week = class Week {

    constructor(orders, start) {
        // First level is grouped by time.
        const map = groupByTime(orders);
        const keys = Array.from(map.keys());
        keys.sort();
        this.orders = orders;
        this.days = weekDays(start);
        this.times = Array.prototype.concat.apply([], keys.map(key =>
            new TimeGroup(key, map.get(key), this.days)).map(group =>
                group.rows));
        this.salespeople = salespeople(orders);
        this.dayCounts = this.days.map(date => {
            return orders.filter(order => order.loading_date === date).length;
        });
    }
};

exports.Day = class Day {

    constructor(orders) {
        this.orders = orders;
        this.times = [];
        const map = groupByTime(orders);
        const keys = Array.from(map.keys());
        keys.sort();
        for (const time of keys) {
            for (const order of map.get(time)) {
                this.times.push({ time, order });
            }
        }
        this.salespeople = salespeople(orders);
    }
};

// Groups orders by loading time.

const groupByTime = (orders) => {
    const map = new Map();
    for (const order of orders) {
        if (order.loading_time !== null) {            
            const entries = map.get(order.loading_time) || [];
            entries.push(order);
            map.set(order.loading_time, entries);
        }
    }
    return map;
};

// Groups orders by loading date.

const groupByDate = (orders) => {
    const map = new Map();
    for (const order of orders) {
        const date = order.loading_date;
        const entries = map.get(date) || [];
        entries.push(order);
        map.set(date, entries);
    }
    return map;
};

// Prepares array of days.

const weekDays = (start) => {
    assert.equal(typeof start, 'string');
    const startMoment = moment(start);
    const days = [];
    for (let i = 0; i < 7; i++) {
        const day = startMoment.clone().add(i, 'days');
        days.push(day.format('YYYY-MM-DD'));
    }
    return days;
};
