const run = require('../lib/run');

(async () => {
    try {
        await run('ssh', [
            '-p', 27,
            'root@62.65.40.122',
            'mysqldump --password=5LRF0W veotellimused > /dump.sql'
        ]);
        await run('scp', [
            '-P', 27,
            'root@62.65.40.122:/dump.sql',
            '/tmp/veotellimused.sql'
        ]);
        await run('mysql', [
            '-u', 'root',
            '--password=diablo',
            'veotellimused',
            '-e', 'SOURCE /tmp/veotellimused.sql'
        ]);
        await run('mysql', [
            '-u', 'root',
            '--password=diablo',
            'veotellimused',
            '-e', "INSERT INTO `users` (`email`, `salt`, `hash`) VALUES" +
                " ('test@lasita.com', 'aaa123', 'e2ad337856eb3c8e04d0f7c132" +
                "48142941176af61a915d59654b58af06e4e78a366909005eea0a621694" +
                "7d8f467a3e667d62390960991df58bcfde6ac39ebfb5');"
        ]);
    } catch (err) {
        process.stderr.write(`${err}\n`);
        process.exit(1);
    }
})();
