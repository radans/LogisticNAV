const yargs = require('yargs');
const moment = require('moment-timezone');
const mysql = require('./lib/mysql');
const migrationsService = require('./lib/service/migrations');
const log = require('./lib/log');
const config = require('./lib/config');

// Default timezone.

moment.tz.setDefault(config.timezone);

// Argument parser, accepts the -m switch
// for running the migrations.

const argv = yargs
    .option('migrate', {
        alias: 'm',
        describe: 'run migrations and exit',
        default: false
    })
    .argv;

const runMigrations = async () => {
    log.info('Running migrations.');
    // Attempt to run available migrations.
    await migrationsService.migrate();
    log.info('Successfully migrated.');
    // Close the MySQL connection.
    await mysql.close();
    process.exit(0);
};

const startServer = async () => {
    // Check that the latest migration has been run.
    await migrationsService.check();
    const server = require('./lib/server');
    // Start the server socket.
    await server.listen();
    console.log('server started');
    log.info('Server started.');
};

(argv.migrate ? runMigrations() : startServer()).catch((err) => {
    // Report any errors.
    if (err.stack) {
        process.stderr.write(`${err.stack}\n`);
    } else {
        process.stderr.write(`${err}\n`);
    }
    // Exit the process.
    setTimeout(() => {
        process.exit(1);
    }, 300);
});
