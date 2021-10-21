const assert = require('assert');
const mysql = require('../mysql');
const ordersRepo = require('../repo/orders');
const companiesRepo = require('../repo/companies');
const Errors = require('../validation/errors');
const AppError = require('../app_error');
const ValidationError = require('../validation/validation_error');
const day = require('../day');

exports.save = async (company) => {
    assert.equal(typeof company, 'object');
    return mysql.transaction(async (connection) => {
        return companiesRepo.save(connection, company);
    });
};

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await companiesRepo.listCount(
            connection, paginator);
        const rows = await companiesRepo.list(
            connection, paginator);
        paginator.setTotal(count);
        day.markToday(rows, 'last_loading_date');
        return { rows, paginator };
    });
};

exports.byId = async (id) => {
    return mysql.transaction(async (connection) => {
        const data = await companiesRepo.byId(connection, id);
        if (data) {
            return data;
        }
        throw new AppError('Sellist vedajat ei eksisteeri.');        
    });
};

exports.update = async (id, company) => {
    assert.equal(typeof id, 'number');
    assert.equal(typeof company, 'object');
    return mysql.transaction(async (connection) => {
        return companiesRepo.update(connection, id, company);
    });
};

exports.listIdName = async () => {
    return mysql.transaction(async (connection) => {
        return companiesRepo.listIdName(connection);
    });
};

exports.listIdsName = async () => {
    return mysql.transaction(async (connection) => {
        return companiesRepo.listIdsName(connection);
    });
};

exports.ordersList = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await ordersRepo.companyOrderListCount(
            connection, paginator);
        const rows = await ordersRepo.companyOrderList(
            connection, paginator);
        paginator.setTotal(count);
        day.markToday(rows, 'loading_date');
        return { rows, paginator };
    });
};

exports.uncommitted = async (companyId) => {
    return mysql.transaction(async (connection) => {
        const rows = await ordersRepo.companyUncommitted(connection, companyId);
        day.markToday(rows, 'loading_date');
        return rows;
    });
};
