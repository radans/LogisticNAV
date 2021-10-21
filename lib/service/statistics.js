const assert = require('assert');
const mysql = require('../mysql');
const statisticsRepo = require('../repo/statistics');
const companiesRepo = require('../repo/companies');
const excel = require('../excel');
const dateString = require('../date_string');

exports.orders = async (constraints) => {
    assert.equal(typeof constraints.start, 'string');
    assert.equal(typeof constraints.end, 'string');
    const companies = constraints.company.split(',').map(c => parseInt(c, 10));
    const orders = await mysql.transaction(async (connection) => {
        return statisticsRepo.statistics(connection, {
            start: constraints.start,
            end: constraints.end,
            companies: companies,
            country: constraints.country === '0' ? null : constraints.country,
            region: constraints.region === '0' ? null : constraints.region,
            salesperson: constraints.salesperson === '0' ? null : constraints.salesperson,
            importExport: constraints.importExport,
            clientTransport: constraints.clientTransport
        });
    });
    for (const order of orders) {
        order.loading_date_formatted = dateString.toEstonian(order.loading_date);
    }
    return orders;
};

exports.ordersExcel = async (constraints) => {
    const orders = await exports.orders(constraints);
    // TODO reduce code duplication with frontend.
    const count = orders.reduce((prev, cur) => prev + (cur.price === 0 ? 0 : (cur.full_load ? 1 : 0.5)), 0);
    const totalPrice = orders.reduce((prev, cur) => prev + cur.price, 0);
    const averagePrice = totalPrice / count;
    const maxPrice = orders.reduce((prev, cur) => Math.max(prev, cur.price), 0);
    const minPrice = orders.reduce((prev, cur) => Math.min(prev, cur.price), Number.MAX_VALUE);
    const rows = [
        ['STATISTIKA'],
        []
    ];
    let constrained = false;
    if (constraints.country !== '0') {
        rows.push(['RIIK', constraints.country]);
        constrained = true;
    }
    if (constraints.region !== '0') {
        rows.push(['REGIOON', constraints.region]);
        constrained = true;
    }
    if (constraints.company !== '0') {
        const company = await mysql.transaction(async (connection) => {
            return companiesRepo.byId(connection,
                parseInt(constraints.company.split(',')[0], 10));
        });
        rows.push(['VEDAJA', company.name]);
        constrained = true;
    }
    rows.splice(rows.length, 0,
        ['Perioodi algus', dateString.toEstonian(constraints.start)],
        ['Perioodi lõpp', dateString.toEstonian(constraints.end)],
        ['Laadimiste kogus', count.toFixed(1)],
        ['Summa kokku', Math.round(totalPrice)],
        ['Keskmine hind', Math.round(averagePrice)],
        ['Maksimaalne hind', Math.round(maxPrice)],
        ['Minimaalne hind', Math.round(minPrice)],
        ['Hinnavahe', Math.round(maxPrice - minPrice)],
        [],
        ['NUMBER', 'LAADIMINE', 'RIIK', 'REGIOON', 'HIND', 'T/O',
            'LAADIMISI', 'VEDAJA', 'ARVE', 'IMPORT/EKSPORT', 'KLIENDI TRANSPORT', 'MÄRKUSED']
    );
    for (const order of orders) {
        rows.push([
            order.id,
            order.loading_date_formatted,
            order.country,
            order.region,
            Math.round(order.price),
            order.full_load ? 'T' : 'O',
            order.unloading_count,
            order.company_name,
            order.invoice,
            order.import ? 'Import' : 'Eksport',
            order.client_transport ? 'Jah' : 'Ei',
            order.notes
        ]);
    }
    return excel.buffer(rows, 'Statistika', [
        { wch: 16 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 6 },
        { wch: 4 },
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 30 }
    ]);
};
