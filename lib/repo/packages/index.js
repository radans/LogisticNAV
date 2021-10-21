const path = require('path');
const assert = require('assert');
const Query = require('../../mysql/query');

const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const clearAssociationQuery = new Query(path.join(__dirname, 'sql', 'clear_association.sql'));
const saveAssociationQuery = new Query(path.join(__dirname, 'sql', 'save_association.sql'));
const savePackagesQuery = new Query(path.join(__dirname, 'sql', 'save_packages.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const updateBulkQuery = new Query(path.join(__dirname, 'sql', 'update_bulk.sql'));

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.updateAssociation = async (connection, planId, packages) => {
    assert.equal(typeof planId, 'number');
    assert.ok(Array.isArray(packages));
    await clearAssociationQuery.run(connection, { planId });
    if (packages.length > 0) {
        await savePackagesQuery.run(connection,
            { values: packages.map(({code, name, width, height, weight, marker, double}) =>
                [code, name, width, height, weight, marker, double, false]) });
        await saveAssociationQuery.run(connection,
            { values: packages.map(pack => [planId, pack.code]) });
    }
};

exports.update = async (connection, code, data) => {
    await updateQuery.run(connection,
        Object.assign({}, data, { code }));
};

exports.updateBulk = async (connection, updates) => {
    await updateBulkQuery.run(connection, { values: updates });
};
