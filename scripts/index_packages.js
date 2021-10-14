const mysql = require('../lib/mysql');
const plansService = require('../lib/service/plans');

(async () => {
    await plansService.indexPackages();
    await mysql.close();
})().catch(err => console.log(err));
