const mysql = require('../mysql');
const migrationsRepo = require('../repo/migrations');
const log = require('../log');

// Runs all available migrations.

exports.migrate = async () => {
    const migrations = await mysql.transaction(async (connection) =>
         migrationsRepo.all(connection));
    const available = await migrationsRepo.available();
    // Set of ran migration ids.
    const ran = new Set();
    for (const migration of migrations) {
        ran.add(migration.id);
    }
    if (ran.size > 0) {
        log.info(`So far migrated: ${Array.from(ran.values()).join(',')}.`);
    }
    // Migrations that have not been run.
    const run = available.filter((migration) => !ran.has(migration.id));
    for (const migration of run) {
        log.info(`Running migration ${migration.id}.`);
        await mysql.transaction(async (connection) => {
            return migrationsRepo.run(connection, migration);
        });
    }
};

// Runs check that the latest migration has
// been run.

exports.check = async () => {
    const migrations = await mysql.transaction(async (connection) =>
         migrationsRepo.all(connection));
    const latestRan = migrations.reduce((prev, cur) => Math.max(prev, cur.id), 0);
    const available = await migrationsRepo.available();
    const latestAvailable = available.reduce((prev, cur) => Math.max(prev, cur.id), 0);
    if (latestRan !== latestAvailable) {
        throw new Error('Migrations have not been run. Run with -m switch or consult the README.md file.');
    }
};
