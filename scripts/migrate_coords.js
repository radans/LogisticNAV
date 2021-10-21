const mysql = require('../lib/mysql');
const addressesService = require('../lib/service/addresses');

(async () => {
    await addressesService.migrateCoords();
    await mysql.close();
})().catch(err => console.log(err));
