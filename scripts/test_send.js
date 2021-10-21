const mysql = require('../lib/mysql');
const mail = require('../lib/mail');
const config = require('../lib/config');

(async () => {
    const subject = 'Test mail';
    const options = {
        to: 'raivo@infdot.com',
        from: config.mail.from,
        replyTo: 'jana@lasita.com',
        subject: subject,
        text: 'Test mail'
    };
    await mail.send(options);
    await mysql.close();
})().catch(err => console.log(err));
