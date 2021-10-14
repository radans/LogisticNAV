const fs = require('fs');
const path = require('path');
const util = require('util');
const csv = require('csv');
const mysql = require('../lib/mysql');
const addressesRepo = require('../lib/repo/addresses');

const readFile = util.promisify(fs.readFile);
const parse = util.promisify(csv.parse);

(async () => {
    const content = await readFile(path.join(__dirname, '..', 'aadressid.csv'));
    const data = await parse(content);
    await mysql.transaction(async (connection) => {
        for (const row of data) {
            await addressesRepo.save(connection, row[0].trim(), row[1].trim() || null, row[2].trim() || null);
        }
    });
    console.log('Done');
})().catch(err => console.log(err));
