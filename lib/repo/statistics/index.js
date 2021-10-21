const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Query = require('../../mysql/query');

const statisticsQuery = new Query(path.join(__dirname, 'sql', 'statistics.sql'));

exports.statistics = async (connection, constraints) => {
    return statisticsQuery.run(connection, constraints);
};
