const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Query = require('../../mysql/query');

const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const byIdQuery = new Query(path.join(__dirname, 'sql', 'by_id.sql'));
const forSelectorQuery = new Query(path.join(__dirname, 'sql', 'for_selector.sql'));
const findPackagesQuery = new Query(path.join(__dirname, 'sql', 'find_packages.sql'));
const removeQuery = new Query(path.join(__dirname, 'sql', 'remove.sql'));
const unassociateQuery = new Query(path.join(__dirname, 'sql', 'unassociate.sql'));
const associateQuery = new Query(path.join(__dirname, 'sql', 'associate.sql'));
const markSentQuery = new Query(path.join(__dirname, 'sql', 'mark_sent.sql'));
const allIdsQuery = new Query(path.join(__dirname, 'sql', 'all_ids.sql'));

exports.save = async (connection, authorId, plan) => {
    const results = await saveQuery.run(connection, {
        authorId,
        name: plan.name,
        dataJson: JSON.stringify(plan),
        modified: !!plan.modified,
        modifiedText: plan.modifiedText
    });
    return results.insertId;
};

exports.update = async (connection, planId, authorId, plan) => {
    const results = await updateQuery.run(connection, {
        planId,
        authorId,
        name: plan.name,
        dataJson: JSON.stringify(plan),
        modified: !!plan.modified,
        modifiedText: plan.modifiedText
    });
};

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.byId = async (connection, planId) => {
    const row = await byIdQuery.one(connection, { planId });
    if (!row) {
        return null;
    }
    row.data = JSON.parse(row.data_json);
    delete row.data_json;
    return row;
};

exports.forSelector = async (connection, planId) => {
    return forSelectorQuery.run(connection, { planId });
};

exports.findPackages = async (connection, token) => {
    return findPackagesQuery.run(connection, { token: `${token}%` });
};

exports.remove = async (connection, planId) => {
    return removeQuery.run(connection, { planId });
};

exports.associate = async (connection, planId, orderId) => {
    if (orderId === null) {
        return unassociateQuery.run(connection, { planId });
    } else {
        return associateQuery.run(connection, { planId, orderId });
    }
};

exports.markSent = async (connection, planId) => {
    return markSentQuery.run(connection, { planId });
};

exports.allIds = async (connection) => {
    return (await allIdsQuery.run(connection)).map(row => row.id);
};
