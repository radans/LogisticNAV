const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const uuid = require('uuid');
const ejs = require('ejs');
const mail = require('../mail');
const mysql = require('../mysql');
const config = require('../config');
const usersRepo = require('../repo/users');
const salespeopleRepo = require('../repo/salespeople');
const Errors = require('../validation/errors');
const AppError = require('../app_error');
const ValidationError = require('../validation/validation_error');

const registerTemplate = ejs.compile(fs.readFileSync(
    path.join(__dirname, '..', 'mail', 'template', 'register.txt'),
    { encoding: 'UTF-8' }));

const passwordTemplate = ejs.compile(fs.readFileSync(
    path.join(__dirname, '..', 'mail', 'template', 'password.txt'),
    { encoding: 'UTF-8' }));

exports.checkCredentials = async (email, password) => {
    assert.equal(typeof email, 'string');
    assert.equal(typeof password, 'string');
    return mysql.transaction(async (connection) => {
        const user = await usersRepo.byEmail(connection, email);
        if (user) {
            if (!user.active) {
                const message = 'Kasutaja on deaktiveeritud.';
                const errors = new Errors();
                errors.add('email', message);
                errors.add('password', message);
                throw new ValidationError(errors);
            }
            const hash = crypto.createHmac('sha512', user.salt);
            hash.update(password);
            if (user.hash === hash.digest('hex')) {
                return user.id;
            }            
        }
        const message = 'Kasutajanimi või parool pole sobiv.';
        const errors = new Errors();
        errors.add('email', message);
        errors.add('password', message);
        throw new ValidationError(errors);        
    });
};

exports.byEmail = async (email, password) => {
    assert.equal(typeof email, 'string');
    return mysql.transaction(async (connection) => {
        return usersRepo.byEmail(connection, email);        
    });
};

exports.saveCollapse = async (email, collapsed) => {
    assert.equal(typeof email, 'string');
    assert.equal(typeof collapsed, 'boolean');
    await mysql.transaction(async (connection) => {
        return usersRepo.saveCollapse(connection, email, collapsed);
    });
};

exports.userSettings = async (email) => {
    assert.equal(typeof email, 'string');
    return mysql.transaction(async (connection) => {
        const user = await usersRepo.byEmail(connection, email);
        if (user) {
            const {
                name,
                phone,
                help,
                order_email,
                receive_plan_mails,
                order_mail_copy
            } = user;
            return {
                name,
                phone,
                help,
                order_email,
                receive_plan_mails,
                order_mail_copy
            };
        }
        throw new Error(`No user ${email}.`);
    });
};

exports.saveSettings = async (email, settings) => {
    assert.equal(typeof email, 'string');
    assert.equal(typeof settings, 'object');
    await mysql.transaction(async (connection) => {
        await usersRepo.saveSettings(connection, email, settings);
    });
};

let registrations = [];

class Registration {

    constructor(mail) {
        this.mail = mail;
        this.time = Date.now();
        this.done = false;
        this.id = uuid.v4();
    }
}

exports.register = async (email) => {
    assert.equal(typeof email, 'string');
    await mysql.transaction(async (connection) => {
        const existing = await usersRepo.byEmail(connection, email);
        if (existing) {
            const errors = new Errors();
            errors.add('email', 'Sellise e-posti aadressiga kasutaja eksisteerib juba.' +
                ' Võibolla soovid hoopis parooli meeldetuletust kasutada.');
            throw new ValidationError(errors);
        }
    });
    const registration = new Registration(email);
    registrations.push(registration);
    const link = `${config.self}/register/confirm/${registration.id}`;
    await mail.send({
        to: email,
        from: config.mail.from,
        subject: 'Registreerumine Veotellimuste kasutajaks',
        text: registerTemplate({ link })
    });
};

exports.password = async (email) => {
    assert.equal(typeof email, 'string');
    await mysql.transaction(async (connection) => {
        const existing = await usersRepo.byEmail(connection, email);
        if (!existing) {
            const errors = new Errors();
            errors.add('email', 'Sellise e-posti aadressiga kasutajat ei eksisteeri.');
            throw new ValidationError(errors);
        }
    });
    const registration = new Registration(email);
    registrations.push(registration);
    const link = `${config.self}/password/confirm/${registration.id}`;
    await mail.send({
        to: email,
        from: config.mail.from,
        subject: 'Veotellimuste kasutaja parooli vahetus',
        text: passwordTemplate({ link })
    });
};

exports.registerConfirm = async (registrationId, data) => {
    assert.equal(typeof registrationId, 'string');
    assert.equal(typeof data, 'object');
    const registration = registrations.find(
        r => r.id === registrationId);
    if (!registration) {
        throw new Error('Kahjuks on registreerumisprotsess' +
            ' aegunud. Palun proovi uuesti.');
    }
    const salt = uuid.v4();
    const {
        name,
        phone,
        password1
    } = data;
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password1);
    const digest = hash.digest('hex');
    registration.done = true;
    await mysql.transaction(async (connection) => {
        return usersRepo.save(connection, {
            email: registration.mail,
            name: data.name,
            phone: data.phone,
            salt: salt,
            hash: digest
        });
    });
    return registration.mail;
};

exports.passwordConfirm = async (registrationId, data) => {
    assert.equal(typeof registrationId, 'string');
    assert.equal(typeof data, 'object');
    const registration = registrations.find(
        r => r.id === registrationId);
    if (!registration) {
        throw new Error('Kahjuks on parooli vahetuse protsess' +
            ' aegunud. Palun proovi uuesti.');
    }
    const salt = uuid.v4();
    const { password1 } = data;
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password1);
    const digest = hash.digest('hex');
    registration.done = true;
    await mysql.transaction(async (connection) => {
        return usersRepo.updatePassword(connection, {
            email: registration.mail,
            salt: salt,
            hash: digest
        });
    });
    return registration.mail;
};

exports.testMail = async (email) => {
    assert.equal(typeof email, 'string');
    await mail.send({
        to: email,
        from: config.mail.from,
        subject: 'Testmail veotellimuste süsteemist',
        text: 'Testmail.'
    });
};

const purgeOldRegistrations = () => {
    const cleared = [];
    const now = Date.now();
    for (const registration of registrations) {
        if (!registration.done && registration.time > (now - 1000 * 60 * 15)) {
            cleared.push(registration);
        }
    }
    registrations = cleared;
};

setInterval(purgeOldRegistrations, 1000 * 60 * 15);

exports.all = async () => {
    return mysql.transaction(async (connection) => {
        return usersRepo.all(connection);
    });
};

exports.allWithPlans = async () => {
    return mysql.transaction(async (connection) => {
        return usersRepo.allWithPlans(connection);
    });
};

exports.allActive = async () => {
    return mysql.transaction(async (connection) => {
        return usersRepo.allActive(connection);
    });
};

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await usersRepo.listCount(
            connection, paginator);
        const rows = await usersRepo.list(
            connection, paginator);
        paginator.setTotal(count);
        return { rows, paginator };
    });
};

exports.configureUserAccess = async (currentUser, userId, data) => {
    assert.equal(typeof currentUser, 'object');
    assert.equal(typeof userId, 'number');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        // We must have at least one master user remaining after
        // this modification.
        if (currentUser.id === userId && (!data.master_user || !data.active)) {
            const masters = await usersRepo.masterUsers(connection);
            if (masters.length === 1) {
                throw new AppError('Vähemalt üks peakasutaja peab andmebaasis säilima.');
            }
        }
        if (!data.active) {
            // Unassociate from salespeople.
            await salespeopleRepo.unassociateUser(connection, userId);
        }
        await usersRepo.updateUserAccess(connection, userId, data);
    });
};

exports.topPlanAuthors = async () => {
    return mysql.transaction(async (connection) => {
        return usersRepo.topPlanAuthors(connection);
    });
};
