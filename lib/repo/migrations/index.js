const fs = require('fs');
const path = require('path');
const util = require('util');
const Query = require('../../mysql/query');

const readdir = util.promisify(fs.readdir);

// Queries.

const allQuery = new Query(path.join(__dirname, 'sql', 'all.sql'));
const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));

// All migrations ran so far.

exports.all = async (connection) => allQuery.run(connection);

// Runs the given migration. Saves the fact that it
// has been run.

exports.run = async (connection, migration) => {
    await new Query(migration.file).run(connection);
    return saveQuery.run(connection, { id: migration.id });
};

// Finds all available migrations.

exports.available = async () => {
    const dir = path.join(__dirname, '..', '..', '..', 'db', 'migrations');
    const entries = await readdir(dir);
    return entries
        .filter((entry) => entry.match(/\.sql$/))
        .map((entry) => entry.match(/^(\d+)\-.+$/))
        .map((match) => ({
            id: parseInt(match[1], 10),
            file: path.join(dir, match[0]) }));
};
