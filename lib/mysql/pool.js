const mysql = require('mysql2');
const typeCast = require('./type_cast');
const queryFormat = require('./query_format');
const config = require('../config');

// Creates the pool instance.

const pool = module.exports = mysql.createPool(Object.assign({
    multipleStatements: true,
    charset: 'utf8mb4',
    typeCast: typeCast,
    queryFormat: queryFormat,
    dateStrings: true
}, config.db));
