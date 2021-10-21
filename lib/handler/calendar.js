const moment = require('moment-timezone');
const wrap = require('../express/wrap');
const ordersService = require('../service/orders');
const salespeopleService = require('../service/salespeople');
const Day = require('../day');
const Weeks = require('../weeks');

module.exports = (app) => {

    app.get('/calendar/week', wrap(async (req, res) => {
        const date = req.query.day;
        const location = req.query.location || 'estonia';
        const today = moment().format('YYYY-MM-DD');
        const start = moment(date).startOf('isoWeek').format('YYYY-MM-DD');
        const week = await ordersService.weekCalendar(start, location);
        const heading = `Laadimiste kalender, nädal ${moment(date).isoWeek()}`;
        const weeks = new Weeks(date ? new Date(date) : new Date());
        const salespeople = week.salespeople;
        res.render('calendar/week', {
            heading, week, today, start, weeks, salespeople, location,
            menu: 'calendar',
            pageScript: 'calendar.bundle.js'
        });
    }));

    app.get('/calendar/day', wrap(async (req, res) => {
        const date = moment(req.query.day).format('YYYY-MM-DD');
        const location = req.query.location || 'estonia';
        const day = await ordersService.dayCalendar(date, location);
        const heading = `Laadimiste kalender, kuupäev ${moment(date).format('DD.MM')}`;
        const salespeople = day.salespeople;
        res.render('calendar/day', {
            heading, day, date, location,
            today: moment().format('YYYY-MM-DD'),
            menu: 'calendar',
            salespeople: salespeople
        });
    }));
};
