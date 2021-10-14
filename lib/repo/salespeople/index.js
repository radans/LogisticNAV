const assert = require('assert');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const Query = require('../../mysql/query');
const hsl = require('../../../public/js/plan/hsl.js');

const allQuery = new Query(path.join(__dirname, 'sql', 'all.sql'));
const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const byIdQuery = new Query(path.join(__dirname, 'sql', 'by_id.sql'));
const setUserQuery = new Query(path.join(__dirname, 'sql', 'set_user.sql'));
const associateUsersQuery = new Query(path.join(__dirname, 'sql', 'associate_users.sql'));
const unassociateUsersQuery = new Query(path.join(__dirname, 'sql', 'unassociate_users.sql'));
const unassociateUserQuery = new Query(path.join(__dirname, 'sql', 'unassociate_user.sql'));
const associatedUsersQuery = new Query(path.join(__dirname, 'sql', 'associated_users.sql'));
const removePersonQuery = new Query(path.join(__dirname, 'sql', 'remove_person.sql'));
const setColorQuery = new Query(path.join(__dirname, 'sql', 'set_color.sql'));

exports.all = async (connection) => {
    return allQuery.run(connection);
};

// Assumes that array items have property
// salesperson_id.

exports.attach = async (connection, array) => {
    const salespeople = await exports.all(connection);
    for (const person of salespeople) {
        person.count = 0;
    }
    const map = _.keyBy(salespeople, (person) => person.id);
    for (const item of array) {
        const person = map[item.salesperson_id];
        if (person) {
            item.salesperson = person;
            person.count += 1;
        }        
    }
    return array;
};

exports.save = async (connection, person) => {
    const results = await saveQuery.run(connection, person);
    return results.insertId;
};

exports.update = async (connection, id, person) => {
    const params = Object.assign({}, person, { id });
    await updateQuery.run(connection, params);
};

exports.byId = async (connection, id) => {
    return byIdQuery.one(connection, { id });
};

exports.associateUsers = async (connection, pairs) => {   
    assert.ok(Array.isArray(pairs));
    if (pairs.length === 0) {
        return;
    }
    const values = pairs.map(({ salespersonId, userId }) =>
        [salespersonId, userId]);
    return associateUsersQuery.run(connection, { values });
};

exports.unassociateUsers = async (connection, salespersonId) => {
    assert.equal(typeof salespersonId, 'number');
    return unassociateUsersQuery.run(connection, { salespersonId });
};

exports.unassociateUser = async (connection, userId) => {
    assert.equal(typeof userId, 'number');
    return unassociateUserQuery.run(connection, { userId });
};

exports.associatedUsers = async (connection) => {
    const rows = await associatedUsersQuery.run(connection);
    const ret = {};
    for (const row of rows) {
        ret[row.salesperson_id] = ret[row.salesperson_id] || [];
        ret[row.salesperson_id].push({
            id: row.user_id,
            name: row.user_name,
            email: row.user_email
        });
    }
    return ret;
};

exports.removePerson = async (connection, personId) => {
    return removePersonQuery.run(connection, { personId });
};

exports.setColor = async (connection, personId, color) => {
    return setColorQuery.run(connection,
        Object.assign(color, { personId }));
};
