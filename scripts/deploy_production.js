const run = require('../lib/run');

(async () => {
    try {
        await run('tar', [
            '-C', '..',
            '-f', '../veotellimused.tgz',
            '-v',
            '-c',
            '-z',
            '--exclude=node_modules',
            '--exclude=.git',
            '--exclude=app',
            '--exclude=data',
            '--exclude=docs',
            '--exclude=tests',
            '--exclude=webpack',
            '--exclude=config.json',
            '--exclude=package-lock.json',
            '--owner=0',
            '--group=0',
            'veotellimused'
        ]);
        await run('scp', [
            '-P', 27,
            '../veotellimused.tgz',
            'root@62.65.40.122:/'
        ]);
        await run('ssh', [
            '-p', 27,
            'root@62.65.40.122',
            '/bin/veotellimused-update.sh'
        ]);
    } catch (err) {
        process.stderr.write(`${err}\n`);
        process.exit(1);
    }
})();
