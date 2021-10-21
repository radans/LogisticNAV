const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ejs = require('ejs');
const assert = require('assert');
const mail = require('../mail');
const mysql = require('../mysql');
const plansRepo = require('../repo/plans');
const ordersRepo = require('../repo/orders');
const usersRepo = require('../repo/users');
const salespeopleRepo = require('../repo/salespeople');
const packagesRepo = require('../repo/packages');
const AppError = require('../app_error');
const planPdfPrinter = require('../pdf/plan');
const Sheet = require('../immediate/sheet');
const day = require('../day');
const dateString = require('../date_string');
const config = require('../config');

const mailTemplate = ejs.compile(fs.readFileSync(
    path.join(__dirname, '..', 'mail', 'template', 'plan.txt'),
    { encoding: 'UTF-8' }));

exports.save = async (authorId, plan) => {
    assert.equal(typeof authorId, 'number');
    assert.equal(typeof plan, 'object');
    return mysql.transaction(async (connection) => {
        const planId = await plansRepo.save(connection, authorId, plan);
        await savePackages(connection, planId, plan);
        if (typeof plan.orderId === 'number') {
            await ordersRepo.associate(connection, plan.orderId, planId);
        }
        return planId;
    });
};

exports.update = async (planId, authorId, plan) => {
    assert.equal(typeof planId, 'number');
    assert.equal(typeof authorId, 'number');
    assert.equal(typeof plan, 'object');
    return mysql.transaction(async (connection) => {
        await savePackages(connection, planId, plan);
        return plansRepo.update(connection, planId, authorId, plan);
    });
};

const savePackages = async (connection, planId, plan) => {
    assert.equal(typeof planId, 'number');
    assert.equal(typeof plan, 'object');
    const packs = [];
    for (const client of plan.clients) {
        for (const item of client.items) {
            if (item.code === '' ||
                item.width === '' ||
                item.height === '') {
                continue;
            }
            packs.push({
                code: item.code,
                name: item.name,
                width: item.width,
                height: item.height,
                weight: item.weight,
                marker: item.marker,
                double: !!item.double
            });
        }
    }
    return packagesRepo.updateAssociation(connection, planId, packs);
};

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await plansRepo.listCount(
            connection, paginator);
        const rows = await salespeopleRepo.attach(connection,
            await plansRepo.list(connection, paginator));
        paginator.setTotal(count);
        return { rows, paginator };
    });
};

exports.byId = async (planId) => {
    assert.equal(typeof planId, 'number');
    return mysql.transaction(async (connection) => {
        const data = await plansRepo.byId(connection, planId);
        if (data) {
            return data;
        }
        throw new AppError('Sellist plaani ei eksisteeri.');
    });
};

exports.planPdf = async (planId) => {
    assert.equal(typeof planId, 'number');
    const plan = await exports.byId(planId);
    const order = await mysql.transaction(async (connection) => {
        const orderId = await ordersRepo.idByPlanId(connection, planId);
        if (typeof orderId === 'number') {
            return ordersRepo.byId(connection, orderId);
        }
    });
    return planPdfPrinter(new Sheet(plan.data, order, plan));
};

exports.forSelector = async (planId) => {
    const plans = await mysql.transaction(async (connection) => {
        return plansRepo.forSelector(connection, planId);
    });
    for (const plan of plans) {
        plan.label = `${plan.name} ${day.formatDate(plan.updated_at)}`;
    }
    return plans;
};

exports.findPackages = async (token) => {
    assert.equal(typeof token, 'string');
    return mysql.transaction(async (connection) => {
        return plansRepo.findPackages(connection, token);
    });
};

exports.remove = async (planId) => {
    assert.equal(typeof planId, 'number');
    return mysql.transaction(async (connection) => {
        await plansRepo.remove(connection, planId);
    });
};

exports.associate = async (planId, orderId) => {
    assert.equal(typeof planId, 'number');
    assert.ok(typeof orderId === 'number' || orderId === null);
    return mysql.transaction(async (connection) => {
        await plansRepo.associate(connection, planId, orderId);
    });
};

const sendPlan = async (plan, user, users, buffer) => {
    assert.equal(typeof plan, 'object');
    assert.equal(typeof user, 'object');
    assert.ok(Array.isArray(users));
    assert.ok(buffer instanceof Buffer);
    let date = '';
    if (plan.loading_date) {
        date = dateString.toEstonian(plan.loading_date).substring(0, 5);
    }
    const title = plan.modified ?
        (plan.modified_text ?
            `Muudetud (${plan.modified_text}) koormaplaan` :
            `Muudetud koormaplaan`) :
        'Koormaplaan';
    await mail.send({
        to: users.map(user => `${user.name} <${user.email}>`).join(', '),
        from: config.mail.from,
        replyTo: `${user.name} <${user.email}>`,
        subject: `${title}/${plan.name}${date ? '/' + date : ''}`,
        text: mailTemplate({ plan, user, users }),
        attachments: [
            {
                filename: `plaan-${plan.name.toLowerCase()}.pdf`,
                content: buffer
            }
        ]
    });
};

exports.sendToSalespeople = async (planId, userEmails, user) => {
    assert.equal(typeof planId, 'number');
    assert.ok(Array.isArray(userEmails));
    assert.equal(typeof user, 'object');
    const users = await mysql.transaction(async (connection) => {
        return usersRepo.byEmails(connection, userEmails);
    });
    const plan = await exports.byId(planId);
    const buffer = await exports.planPdf(planId);
    await sendPlan(plan, user, users, buffer);
    await mysql.transaction(async (connection) => {
        return plansRepo.markSent(connection, planId);
    });
};

exports.emailReceivers = async (planId) => {
    assert.equal(typeof planId, 'number');
    return mysql.transaction(async (connection) => {
        // Salesperson associated with the plan.
        let salespersonId = null;
        const orderId = await ordersRepo.idByPlanId(connection, planId);
        if (orderId) {
            const order = await ordersRepo.byId(connection, orderId);
            salespersonId = order.salesperson_id;
        }
        // Non-salesperson dependent receivers.
        const always = {};
        const emailReceivers = await usersRepo.planReceivers(connection);
        for (const user of emailReceivers) {
            always[user.email] = true;
        }
        const salespeople = await salespeopleRepo.associatedUsers(connection);
        // Salesperson-dependent receivers.
        const sales = {};
        if (salespersonId && salespeople[salespersonId]) {
            for (const person of salespeople[salespersonId]) {
                sales[person.email] = true;
            }
        }
        const unique = {};
        const receivers = [];
        for (const id of Object.keys(salespeople)) {
            for (const person of salespeople[id]) {
                if (!unique[person.email]) {
                    receivers.push({
                        name: person.name,
                        email: person.email,
                        always: always.hasOwnProperty(person.email),
                        sales: sales.hasOwnProperty(person.email)
                    });
                    unique[person.email] = true;
                }
            }
        }
        for (const user of emailReceivers) {
            if (!unique[user.email]) {
                receivers.push({
                    name: user.name,
                    email: user.email,
                    always: always.hasOwnProperty(user.email),
                    sales: sales.hasOwnProperty(user.email)
                });
                unique[user.email] = true;
            }
        }
        // Set default selects.
        for (const receiver of receivers) {
            receiver.selected = !!((receiver.always && orderId) || receiver.sales);
        }
        // Sort by name.
        return receivers.sort((u1, u2) => {
            return u1.name === u2.name ? 0 : (u1.name < u2.name ? -1 : 1);
        });
    });
};

// Used for migration during #2469.
exports.indexPackages = async () => {
    const ids = await mysql.transaction(async (connection) => {
        return plansRepo.allIds(connection);
    });
    console.log(`Loaded ${ids.length} plan ids.`);
    for (const id of ids) {
        await mysql.transaction(async (connection) => {
            const plan = await plansRepo.byId(connection, id);
            console.log(`Loaded plan ${id}.`);
            await savePackages(connection, id, plan.data);
            console.log(`Indexed plan ${id}.`);
        });
    }
};

exports.copy = async (planId, userId) => {
    assert.equal(typeof planId, 'number');
    assert.equal(typeof userId, 'number');
    const plan = await exports.byId(planId);
    const data = plan.data;
    data.modified = false;
    data.modifiedText = null;
    if (data.orderId) {
        data.orderId = null;
    }
    return exports.save(userId, data);
};
