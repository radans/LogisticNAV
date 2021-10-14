const fs = require('fs');
const util = require('util');
const assert = require('assert');
const XLSX = require('xlsx');
const mysql = require('../mysql');
const packagesRepo = require('../repo/packages');

const readFile = util.promisify(fs.readFile);

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await packagesRepo.listCount(
            connection, paginator);
        const rows = await packagesRepo.list(connection, paginator);
        paginator.setTotal(count);
        return { rows, paginator };
    });
};

exports.update = async (code, data) => {
    assert.equal(typeof code, 'string');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return packagesRepo.update(connection, code, data);
    });
};

exports.updateFromExcel = async (file) => {
    assert(typeof file === 'string');
    const rows = await readPackages(file);
    let r = 0;
    const updates = [];
    const header = rows[0];
    const descriptionIndex = header.indexOf('Description');
    if (descriptionIndex < 0) {
        throw new Error('Veerg "Description" puudub.');
    }
    const batchIndex = header.indexOf('Batch');
    if (batchIndex < 0) {
        throw new Error('Veerg "Batch" puudub.');
    }
    const lengthIndex = header.indexOf('LENGTH1');
    if (lengthIndex < 0) {
        throw new Error('Veerg "LENGTH1" puudub.');
    }
    const heightIndex = header.indexOf('HEIGHT1');
    if (heightIndex < 0) {
        throw new Error('Veerg "HEIGHT1" puudub.');
    }
    const weightIndex = header.indexOf('WEIGHT1');
    if (weightIndex < 0) {
        throw new Error('Veerg "WEIGHT1" puudub.');
    }
    for (const row of rows) {
        r++;
        if (r < 2) {
            continue;
        }
        const name = row[descriptionIndex];
        if (typeof name !== 'string' || name.length < 3) {
            throw new Error(`Rida ${r}: vigane paki nimi.`);
        }
        const code = row[batchIndex];
        if (typeof code !== 'string' || code.length < 5) {
            throw new Error(`Rida ${r}: vigane paki kood.`);
        }
        const length = Math.ceil(parseInt(row[lengthIndex], 10) / 10);
        if (isNaN(length)) {
            throw new Error(`Rida ${r}: vigane paki pikkus.`);
        }
        if (length === 0) {
            continue;
        }
        const height = Math.ceil(parseInt(row[heightIndex], 10) / 10);
        if (isNaN(height)) {
            throw new Error(`Rida ${r}: vigane paki kõrgus.`);
        }
        if (height === 0) {
            continue;
        }
        const weight = parseInt(row[weightIndex], 10);
        if (isNaN(weight)) {
            throw new Error(`Rida ${r}: vigane paki kaal.`);
        }
        if (weight === 0) {
            continue;
        }
        updates.push([code.trim(), name.trim(), length, height, weight]);
    }
    if (updates.length > 0) {
        return mysql.transaction(async (connection) => {
            return packagesRepo.updateBulk(connection, updates);
        });
    }
};

const readPackages = async (file) => {
    const data = await readFile(file);
    const book = XLSX.read(data);
    const first = book.SheetNames[0];
    const sheet = book.Sheets[first];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
};
