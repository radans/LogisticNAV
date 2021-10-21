const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const util = require('util');
const assert = require('assert');
const uuid = require('uuid');
const sharp = require('sharp');
const moment = require('moment-timezone');
const ejs = require('ejs');
const mail = require('../mail');
const mysql = require('../mysql');
const ordersRepo = require('../repo/orders');
const addressesRepo = require('../repo/addresses');
const settingsRepo = require('../repo/settings');
const companiesRepo = require('../repo/companies');
const salespeopleRepo = require('../repo/salespeople');
const AppError = require('../app_error');
const orderPdfPrinter = require('../pdf/order');
const calendar = require('../calendar');
const day = require('../day');
const dateString = require('../date_string');
const config = require('../config');

const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const orderTemplate = ejs.compile(fs.readFileSync(
    path.join(__dirname, '..', 'mail', 'template', 'order.txt'),
    { encoding: 'UTF-8' }));

// TODO reduce code duplication.

const FILE_LOADING_ET = path.join(__dirname, '..', '..', 'data', 'loading_et.pdf');
const FILE_LOADING_EN = path.join(__dirname, '..', '..', 'data', 'loading_en.pdf');
const FILE_LOADING_RU = path.join(__dirname, '..', '..', 'data', 'loading_ru.pdf');

exports.save = async (order) => {
    assert.equal(typeof order, 'object');
    return mysql.transaction(async (connection) => {
        filterAddresses(order);
        await updateAddresses(connection, order.unload, order.name);
        await updateAddresses(connection, order.onload, order.name);
        const id = await ordersRepo.save(connection, order);
        if (order.planId > 0) {
            await ordersRepo.associate(connection, id, order.planId);
        }
        return id;
    });
};

const filterAddresses = (order) => {
    order.unload = order.unload.filter(place => place.address.length > 0);
    order.onload = order.onload.filter(place => place.address.length > 0);
};

const updateAddresses = async (connection, places, name) => {
    for (const place of places) {
        place.addressId = await addressesRepo.save(connection, place.address, name);
    }
};

exports.list = async (paginator) => {
    return mysql.transaction(async (connection) => {
        const count = await ordersRepo.listCount(
            connection, paginator);
        const rows = await salespeopleRepo.attach(connection,
            await ordersRepo.list(connection, paginator));
        paginator.setTotal(count);
        day.markToday(rows, 'loading_date');
        return { rows, paginator };
    });
};

exports.byId = async (id) => {
    return mysql.transaction(async (connection) => {
        const data = await ordersRepo.byId(connection, id);
        if (data) {
            data.photos = await ordersRepo.orderPhotos(connection, id);
            return data;
        }
        throw new AppError('Sellist tellimust ei eksisteeri.');
    });
};

exports.orderPdf = async (id) => {
    const data = await exports.byId(id);
    const settings = await mysql.transaction(async (connection) => {
        return settingsRepo.load(connection, [
            'loading_upper',
            'loading_bottom',
            'loading_contacts',
            'logo'
        ]);
    });
    if (settings.logo === null) {
        throw new Error('Logo on üles laadimata.');
    }
    return orderPdfPrinter(data, settings);
};

exports.update = async (id, order) => {
    assert.equal(typeof id, 'number');
    assert.equal(typeof order, 'object');
    return mysql.transaction(async (connection) => {
        filterAddresses(order);
        await updateAddresses(connection, order.unload, order.name);
        await updateAddresses(connection, order.onload, order.name);
        return ordersRepo.update(connection, id, order);
    });
};

// Migrates onload addresses to the
// new storage scheme.
exports.migrateOnload = async () => {
    const ids = await mysql.transaction(async (connection) => {
        return ordersRepo.allIds(connection);
    });
    console.log(`Loaded ${ids.length} order ids.`);
    for (const id of ids) {
        await mysql.transaction(async (connection) => {
            const order = await ordersRepo.byId(connection, id);
            console.log(`Loaded order ${id}.`);
            await updateAddresses(connection, order.onload, order.name);
            await ordersRepo.updateOnload(connection, id, order.onload);
            console.log(`Migrated order ${id}.`);
        });
    }
};

exports.updateVehicleAndInvoice = async (id, data) => {
    assert.equal(typeof id, 'number');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return ordersRepo.updateVehicleAndInvoice(connection, id, data);
    });
};

exports.updateVehicle = async (id, data) => {
    assert.equal(typeof id, 'number');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return ordersRepo.updateVehicle(connection, id, data);
    });
};

exports.cameraOrders = async () => {
    return mysql.transaction(async (connection) => {
        const orders = await ordersRepo.cameraOrders(connection);
        const photos = await ordersRepo.cameraOrderPhotos(connection);
        const map = _.keyBy(orders, order => order.id);
        for (const order of orders) {
            order.images = [];
        }
        for (const photo of photos) {
            const order = map[photo.order_id];
            if (order) {
                order.images.push(photo.generated_id);
            }
        }
        return orders;
    });
};

exports.saveUploadedPhotos = async (id, files, remoteGenIds) => {
    assert.equal(typeof id, 'number');
    assert.ok(Array.isArray(files));
    if (remoteGenIds) {
        assert.ok(Array.isArray(remoteGenIds));
    }
    if (files.length === 0) {
        return;
    }
    const genIds = [];
    let i = 0;
    for (const file of files) {
        const generatedId = remoteGenIds ? remoteGenIds[i] : uuid.v4();
        const basePath = photoDir(id);
        try {
            await mkdir(basePath);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        const location = path.join(basePath, `${generatedId}.jpg`);
        const thumbLocation = path.join(basePath, `${generatedId}.th.jpg`);
        await sharp(file).resize(200, 150).toFile(thumbLocation);
        await rename(file, location);
        genIds.push(generatedId);
        i += 1;
    }
    return mysql.transaction(async (connection) => {
        return ordersRepo.savePhotos(connection, id, genIds);
    });
};

exports.weekCalendar = async (start, location) => {
    assert.equal(typeof start, 'string');
    assert.equal(typeof location, 'string');
    const end = moment(start).add(7, 'days').format('YYYY-MM-DD');
    const rows = await mysql.transaction(async (connection) => {
        return salespeopleRepo.attach(connection,
            await ordersRepo.calendar(connection, start, end, location));
    });
    return new calendar.Week(rows, start);
};

exports.dayCalendar = async (date, location) => {
    assert.equal(typeof date, 'string');
    assert.equal(typeof location, 'string');
    const end = moment(date).add(1, 'days').format('YYYY-MM-DD');
    const rows = await mysql.transaction(async (connection) => {
        return salespeopleRepo.attach(connection,
            await ordersRepo.calendar(connection, date, end, location));
    });
    return new calendar.Day(rows);
};

exports.dayLoadings = async (date) => {
    assert.equal(typeof date, 'string');
    const end = moment(date).add(1, 'days').format('YYYY-MM-DD');
    const rows = await mysql.transaction(async (connection) => {
        return ordersRepo.calendar(connection, date, end, 'estonia');
    });
    const loadings = [];
    const dups = {};
    for (const row of rows) {
        for (const time of row.times) {
            const key = `${row.id}${time}`;
            if (dups[key]) {
                continue;
            }
            loadings.push({
                order_name: row.order_name,
                time: time,
                order_id: row.id
            });
            dups[key] = true;
        }
    }
    return loadings.sort((l1, l2) => {
        return l1.time === l2.time ? 0 :
            (l1.time < l2.time ? -1 : 1);
    });
};

exports.updateCancel = async (orderId, data) => {
    assert.equal(typeof orderId, 'number');
    assert.equal(typeof data, 'object');
    return mysql.transaction(async (connection) => {
        return ordersRepo.updateCancel(connection, orderId, data);
    });
};

exports.forSelector = async (planId) => {
    assert.equal(typeof planId, 'number');
    const orders = await mysql.transaction(async (connection) => {
        return ordersRepo.forSelector(connection, planId);
    });
    for (const order of orders) {
        order.label = `${order.name} ${dateString.toEstonian(order.loading_date)}`;
    }
    return orders;
};

exports.send = async (user, orderId) => {
    let user_email = user.email;
    if (user.order_email) {
        user_email = user.order_email;
    }
    const order = await exports.byId(orderId);
    if (order.company_id === null) {
        throw new Error(`Tellimusel ${orderId} pole vedajat.`);
    }
    const onloadDate = moment(order.loading_date).format('DD.MM');
    const subject = `Transporditellimus nr. ${order.id}/${order.country}/${onloadDate}`;
    const options = {
        to: order.email,
        from: config.mail.from,
        replyTo: user_email,
        subject: subject,
        text: orderTemplate({ user }),
        attachments: [
            {
                filename: `tellimus-${orderId}.pdf`,
                content: await exports.orderPdf(orderId)
            },
            {
                filename: `transpordi-juhend.pdf`,
                content: await readFile(FILE_LOADING_ET)
            },
            {
                filename: `transport-manual.pdf`,
                content: await readFile(FILE_LOADING_EN)
            },
            {
                filename: `rukovodstvo-po-perevozke.pdf`,
                content: await readFile(FILE_LOADING_RU)
            }
        ]
    };
    if (user.order_mail_copy) {
        options.cc = user_email;
    }
    await mail.send(options);
    await mysql.transaction(async (connection) => {
        return ordersRepo.markSent(connection, orderId);
    });
};

exports.removePhoto = async (photoId) => {
    assert.equal(typeof photoId, 'number');
    const photoData = await exports.photoData(photoId);
    const basePath = photoDir(photoData.order_id);
    await unlink(path.join(basePath, `${photoData.generated_id}.jpg`));
    await unlink(path.join(basePath, `${photoData.generated_id}.th.jpg`));
    return mysql.transaction(async (connection) => {
        return ordersRepo.removePhoto(connection, photoId);
    });
};

exports.photoData = async (photoId) => {
    assert.equal(typeof photoId, 'number');
    return mysql.transaction(async (connection) => {
        return ordersRepo.photoData(connection, photoId);
    });
};

const photoDir = (orderId) => {
    return path.join(__dirname, '..', '..',
        'data', 'photos', orderId.toString());
};

const documentDir = (orderId) => {
    return path.join(__dirname, '..', '..',
        'data', 'documents', orderId.toString());
};

exports.countries = async () => {
    return mysql.transaction(async (connection) => {
        return ordersRepo.countries(connection);
    });
};

exports.saveDocuments = async (id, files, comments) => {
    assert.equal(typeof id, 'number');
    assert.ok(Array.isArray(files));
    assert.ok(Array.isArray(comments));
    const filesData = [];
    for (const item of files) {
        const file = item.file;
        const comment = item.comment;
        assert.equal(typeof file.tmp, 'string');
        assert.equal(typeof file.name, 'string');
        const generatedId = uuid.v4();
        const basePath = documentDir(id);
        try {
            await mkdir(basePath);
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
        const extension = path.extname(file.name);
        const location = path.join(basePath, `${generatedId}${extension}`);
        await rename(file.tmp, location);
        filesData.push({
            order_id: id,
            original_name: file.name,
            generated_id: generatedId,
            comment: comment
        });
    }
    return mysql.transaction(async (connection) => {
        if (filesData.length > 0) {
            await ordersRepo.saveDocuments(connection, id, filesData);
        }
        if (comments.length > 0) {
            await ordersRepo.saveComments(connection, comments);
        }
    });
};

exports.documents = async (orderId) => {
    assert.equal(typeof orderId, 'number');
    return mysql.transaction(async (connection) => {
        return ordersRepo.documents(connection, orderId);
    });
};

exports.document = async (documentId) => {
    assert.equal(typeof documentId, 'number');
    return mysql.transaction(async (connection) => {
        return ordersRepo.document(connection, documentId);
    });
};

exports.removeDocument = async (documentId) => {
    assert.equal(typeof documentId, 'number');
    return mysql.transaction(async (connection) => {
        return ordersRepo.removeDocument(connection, documentId);
    });
};
