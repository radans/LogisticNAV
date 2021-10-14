const mysql = require('../lib/mysql');
const ordersService = require('../lib/service/orders');

(async () => {
    await ordersService.migrateOnload();
    await mysql.close();
})().catch(err => console.log(err));
