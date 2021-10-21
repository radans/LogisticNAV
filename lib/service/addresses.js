const assert = require('assert');
const mysql = require('../mysql');
const addressesRepo = require('../repo/addresses');

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await addressesRepo.listCount(
            connection, paginator);
        const rows = await addressesRepo.list(
            connection, paginator);
        paginator.setTotal(count);
        return { rows, paginator };
    });
};

exports.search = async (token) => {
    return mysql.transaction(async (connection) => {
        return addressesRepo.search(connection, token);
    });
};

exports.update = async (addressId, data) => {
    assert.equal(typeof addressId, 'number');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return addressesRepo.update(connection, addressId, data);
    });
};

exports.regions = async () => {
    return mysql.transaction(async (connection) => {
        return addressesRepo.regions(connection);
    });
};

exports.saveNew = async (data) => {
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return addressesRepo.saveNew(connection, data);
    });
};

exports.migrateCoords = async () => {
    return mysql.transaction(async (connection) => {
        return addressesRepo.updateAllCoords(connection);
    });
};
