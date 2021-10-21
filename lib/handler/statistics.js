const api = require('../express/api');
const wrap = require('../express/wrap');
const ordersService = require('../service/orders');
const addressesService = require('../service/addresses');
const companiesService = require('../service/companies');
const statisticsService = require('../service/statistics');
const salespeopleService = require('../service/salespeople');

module.exports = (app) => {

    app.get('/statistics', wrap(async (req, res) => {
        const countries = await ordersService.countries();
        const regions = await addressesService.regions();
        const companies = await companiesService.listIdsName();
        const salespeople = await salespeopleService.all();
        res.render('statistics/index', {
            heading: 'Statistika',
            menu: 'statistics',
            pageScript: 'statistics.bundle.js',
            countries, regions, companies, salespeople
        });
    }));

    app.get('/statistics/excel', wrap(async (req, res) => {        
        res.attachment('statistika.xlsx');
        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        const buffer = await statisticsService.ordersExcel(req.query);
        res.send(buffer);
    }));

    app.get('/api/statistics', api(async (req, res) => {
        return statisticsService.orders(req.query);
    }));
};
