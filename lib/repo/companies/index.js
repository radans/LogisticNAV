const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Query = require('../../mysql/query');

const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));
const existsQuery = new Query(path.join(__dirname, 'sql', 'exists.sql'));
const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const byIdQuery = new Query(path.join(__dirname, 'sql', 'by_id.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const listIdNameQuery = new Query(path.join(__dirname, 'sql', 'list_id_name.sql'));
const listIdsNameQuery = new Query(path.join(__dirname, 'sql', 'list_ids_name.sql'));

exports.save = async (connection, company) => {
    const results = await saveQuery.run(connection, company);
    return results.insertId;
};

exports.exists = async (connection, name) => {
    const count = await existsQuery.oneField(connection, 'count', { name });
    return count > 0;
};

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.byId = async (connection, id) => {
    return byIdQuery.one(connection, { id });
};

exports.update = async (connection, id, company) => {
    const params = Object.assign({}, company, { id });
    await updateQuery.run(connection, params);
};

exports.listIdName = async (connection) => {
    return listIdNameQuery.run(connection);
};

exports.listIdsName = async (connection) => {
    return listIdsNameQuery.run(connection);
};
