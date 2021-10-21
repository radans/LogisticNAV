const fs = require('fs');
const path = require('path');
const Query = require('../../mysql/query');

const loadNamesQuery = new Query(path.join(__dirname, 'sql', 'load_names.sql'));
const loadAllQuery = new Query(path.join(__dirname, 'sql', 'load_all.sql'));
const saveNamesQuery = new Query(path.join(__dirname, 'sql', 'save_names.sql'));
const countNullQuery = new Query(path.join(__dirname, 'sql', 'count_null.sql'));

exports.load = async (connection, names) => {
    if (typeof names === 'undefined') {
        return objectify(await loadAllQuery.run(connection));
    } else if (typeof names === 'string') {
        return objectify(await loadNamesQuery.run(connection, { names: [names] }));
    } else {
        return objectify(await loadNamesQuery.run(connection, { names }));
    }
};

exports.save = async (connection, object) => {
    const values = Object.keys(object).map(key => [key, object[key]]);
    return saveNamesQuery.run(connection, { values });
};

const objectify = (rows) => {
    const ret = {};
    for (const row of rows) {
        ret[row.name] = row.value;
    }
    return ret;
};

exports.countUnset = async (connection) => {
    return countNullQuery.oneField(connection, 'count');
};
