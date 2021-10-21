const util = require('util');
const child_process = require('child_process');
const spawn = child_process.spawn;

module.exports = (command, args) => {
    return new Promise((resolve, reject) => {
        const subprocess = spawn(command, args, { stdio: 'inherit' });
        subprocess.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command ${command} non-zero exit code ${code}.`));
            }
        });
        subprocess.on('error', (err) => {
            reject(err);
        });
    });
};
