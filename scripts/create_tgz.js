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
            '--exclude=data',
            '--exclude=config.json',
            '--exclude=package-lock.json',
            '--owner=0',
            '--group=0',
            'veotellimused'
        ]);
    } catch (err) {
        process.stderr.write(`${err}\n`);
        process.exit(1);
    }
})();
