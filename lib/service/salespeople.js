const assert = require('assert');
const mysql = require('../mysql');
const salespeopleRepo = require('../repo/salespeople');
const AppError = require('../app_error');
const Errors = require('../validation/errors');
const ValidationError = require('../validation/validation_error');

exports.all = async () => {
    return mysql.transaction(async (connection) => {
        return salespeopleRepo.all(connection);
    });
};

exports.save = async (person) => {
    assert.equal(typeof person, 'object');
    return mysql.transaction(async (connection) => {
        const all = await salespeopleRepo.all(connection);
        for (const existing of all) {
            if (person.name === existing.name) {
                const errors = new Errors();
                errors.add('name', 'Sama nimega müügijuht eksisteerib juba.');
                throw new ValidationError(errors);
            }
        }
        return salespeopleRepo.save(connection, person);
    });
};

exports.update = async (id, person) => {
    assert.equal(typeof id, 'number');
    assert.equal(typeof person, 'object');
    return mysql.transaction(async (connection) => {
        const all = await salespeopleRepo.all(connection);
        for (const existing of all) {
            if (person.name === existing.name && id !== existing.id) {
                const errors = new Errors();
                errors.add('name', 'Sama nimega müügijuht eksisteerib juba.');
                throw new ValidationError(errors);
            }
        }
        return salespeopleRepo.update(connection, id, person);
    });
};

exports.byId = async (id) => {
    return mysql.transaction(async (connection) => {
        const data = await salespeopleRepo.byId(connection, id);
        if (data) {
            return data;
        }
        throw new AppError('Sellist müügijuhti ei eksisteeri.');        
    });
};

exports.setUsers = async (salespersonId, users) => {    
    assert.equal(typeof salespersonId, 'number');
    assert.ok(Array.isArray(users));
    return mysql.transaction(async (connection) => {
        await salespeopleRepo.unassociateUsers(connection, salespersonId);
        await salespeopleRepo.associateUsers(connection,
            users.map(userId => ({ salespersonId, userId })));
    });
};

// Salespeople with all associated users.

exports.allWithUsers = async () => {
    return mysql.transaction(async (connection) => {
        const all = await salespeopleRepo.all(connection);
        const associations = await salespeopleRepo.associatedUsers(connection);
        for (const person of all) {
            person.users = associations[person.id] || [];
        }
        return all;
    });    
};

exports.removePerson = async (personId) => {
    assert.equal(typeof personId, 'number');
    await mysql.transaction(async (connection) => {
        return salespeopleRepo.removePerson(connection, personId);
    });
    return true;
};

exports.setColor = async (personId, color) => {
    assert.equal(typeof personId, 'number');
    assert.equal(typeof color, 'object');
    await mysql.transaction(async (connection) => {
        return salespeopleRepo.setColor(connection, personId, color);
    });
    return true;
};
