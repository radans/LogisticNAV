const fs = require('fs');
const path = require('path');
const assert = require('assert');
const mysql = require('../mysql');
const settingsRepo = require('../repo/settings');

exports.load = async (names) => {
    return mysql.transaction(async (connection) => {
        return settingsRepo.load(connection, names);
    });
};

exports.save = async (object) => {
    return mysql.transaction(async (connection) => {
        return settingsRepo.save(connection, object);
    });
};

exports.countUnset = async () => {
    return mysql.transaction(async (connection) => {
        return settingsRepo.countUnset(connection);
    });
};
