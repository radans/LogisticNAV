const util = require('util');
const nodemailer = require('nodemailer');
const config = require('../config');
const transport = nodemailer.createTransport(config.mail.smtp);

// Sends mail. Wrapped into a promise.

const sendMail = util.promisify((options, cb) =>
    transport.sendMail(options, cb));

exports.send = sendMail;
