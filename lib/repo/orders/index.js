const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Query = require('../../mysql/query');
const Day = require('../../day');

const saveQuery = new Query(path.join(__dirname, 'sql', 'save.sql'));
const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const byIdQuery = new Query(path.join(__dirname, 'sql', 'by_id.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const cameraOrdersQuery = new Query(path.join(__dirname, 'sql', 'camera_orders.sql'));
const cameraOrderPhotosQuery = new Query(path.join(__dirname, 'sql', 'camera_orders_photos.sql'));
const savePhotosQuery = new Query(path.join(__dirname, 'sql', 'save_photos.sql'));
const photosQuery = new Query(path.join(__dirname, 'sql', 'photos.sql'));
const associateQuery = new Query(path.join(__dirname, 'sql', 'associate.sql'));
const updateVehicleAndInvoiceQuery = new Query(path.join(__dirname, 'sql', 'update_vehicle_and_invoice.sql'));
const updateVehicleQuery = new Query(path.join(__dirname, 'sql', 'update_vehicle.sql'));
const calendarQuery = new Query(path.join(__dirname, 'sql', 'calendar.sql'));
const unloadQuery = new Query(path.join(__dirname, 'sql', 'unload_addresses.sql'));
const onloadQuery = new Query(path.join(__dirname, 'sql', 'onload_addresses.sql'));
const saveUnloadQuery = new Query(path.join(__dirname, 'sql', 'save_unload.sql'));
const saveOnloadQuery = new Query(path.join(__dirname, 'sql', 'save_onload.sql'));
const clearUnloadQuery = new Query(path.join(__dirname, 'sql', 'clear_unload.sql'));
const clearOnloadQuery = new Query(path.join(__dirname, 'sql', 'clear_onload.sql'));
const companyOrderListQuery = new Query(path.join(__dirname, 'sql', 'company_orders_list.sql'));
const companyOrderListCountQuery = new Query(path.join(__dirname, 'sql', 'company_orders_count.sql'));
const companyUncommittedQuery = new Query(path.join(__dirname, 'sql', 'company_uncommitted.sql'));
const updateCancelQuery = new Query(path.join(__dirname, 'sql', 'update_cancel.sql'));
const updateUnloadDateQuery = new Query(path.join(__dirname, 'sql', 'update_unload_date.sql'));
const forSelectorQuery = new Query(path.join(__dirname, 'sql', 'for_selector.sql'));
const markSentQuery = new Query(path.join(__dirname, 'sql', 'mark_sent.sql'));
const idByPlanIdQuery = new Query(path.join(__dirname, 'sql', 'id_by_plan_id.sql'));
const removePhotoQuery = new Query(path.join(__dirname, 'sql', 'remove_photo.sql'));
const photoQuery = new Query(path.join(__dirname, 'sql', 'photo.sql'));
const updateCommitDateQuery = new Query(path.join(__dirname, 'sql', 'update_commit_date.sql'));
const countriesQuery = new Query(path.join(__dirname, 'sql', 'countries.sql'));
const allIdsQuery = new Query(path.join(__dirname, 'sql', 'all_ids.sql'));
const saveDocumentsQuery = new Query(path.join(__dirname, 'sql', 'save_documents.sql'));
const documentsQuery = new Query(path.join(__dirname, 'sql', 'documents.sql'));
const documentQuery = new Query(path.join(__dirname, 'sql', 'document.sql'));
const removeDocumentQuery = new Query(path.join(__dirname, 'sql', 'remove_document.sql'));
const saveCommentQuery = new Query(path.join(__dirname, 'sql', 'save_comment.sql'));

exports.save = async (connection, order) => {
    assert.ok(order.company !== '0');

    const {onload, unload} = order;
    const onloadAddresses = onload.map(place => place.address).join(' ');
    const unloadAddresses = unload.map(place => place.address).join(' ');
    const results = await saveQuery.run(connection,
        Object.assign({}, order, {
            onload_addresses: onloadAddresses,
            unload_addresses: unloadAddresses,
            price: order.price === '' ? null : parseFloat(order.price)
        }));
    const orderId = results.insertId;
    await saveUnload(connection, orderId, unload);
    await saveOnload(connection, orderId, onload);
    // Update the unload date.
    // XXX order has multiple unload dates.
    // await updateUnloadDateQuery.run(connection, { orderId });
    return orderId;
};

const saveUnload = async (connection, orderId, places) => {
    if (places.length > 0) {
        // Assumes that places have address ids.
        const values = places.map((place, i) =>
            ([orderId, place.addressId, i, place.date, place.time]));
        console.log('saveUnload -> values', values);

        return saveUnloadQuery.run(connection, {values});
    }
};

const saveOnload = async (connection, orderId, places) => {
    if (places.length > 0) {
        // Assumes that places have address ids.
        const values = places.map((place, i) =>
            ([orderId, place.addressId, i, place.time]));
        console.log('saveOnload -> values', values);

        return saveOnloadQuery.run(connection, {values});
    }
};

const queryUnload = async (connection, orderId) => {
    const rows = await unloadQuery.run(connection, {orderId});
    return rows.map(row => ({address: row.address, date: row.date, time: row.time}));
};

const queryOnload = async (connection, orderId) => {
    const rows = await onloadQuery.run(connection, {orderId});
    return rows.map(row => ({address: row.address, time: row.time}));
};

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.byId = async (connection, orderId) => {
    const row = await byIdQuery.one(connection, {orderId});
    if (!row) {
        return null;
    }
    // TODO remove json
    row.onload = await queryOnload(connection, orderId);
    row.unload = await queryUnload(connection, orderId);
    return row;
};

// Used for migration and other such
// purposes.
exports.allIds = async (connection) => {
    return (await allIdsQuery.run(connection)).map(row => row.id);
};

exports.update = async (connection, orderId, order) => {
    assert.ok(order.company !== '0');
    const {onload, unload} = order;
    const onloadAddresses = onload.map(place => place.address).join(' ');
    const unloadAddresses = unload.map(place => place.address).join(' ');
    await updateQuery.run(connection,
        Object.assign({}, order, {
            onload_addresses: onloadAddresses,
            unload_addresses: unloadAddresses,
            price: order.price === '' ? null : parseFloat(order.price)
        }, {orderId}));
    // Unload addresses.
    await clearUnloadQuery.run(connection, {orderId});
    await saveUnload(connection, orderId, order.unload);
    // Onload addresses.
    await clearOnloadQuery.run(connection, {orderId});
    await saveOnload(connection, orderId, order.onload);
    // Update the unload date.
    // XXX order has multiple unload dates.
    // await updateUnloadDateQuery.run(connection, { orderId });
};

exports.updateOnload = async (connection, orderId, onload) => {
    await clearOnloadQuery.run(connection, {orderId});
    await saveOnload(connection, orderId, onload);
};

exports.updateVehicleAndInvoice = async (connection, orderId, data) => {
    await updateCommitDate(connection, orderId, data.vehicle);
    await updateVehicleAndInvoiceQuery.run(
        connection, Object.assign({}, data, {orderId}));
};

exports.updateVehicle = async (connection, orderId, data) => {
    await updateCommitDate(connection, orderId, data.vehicle);
    await updateVehicleQuery.run(
        connection, Object.assign({}, data, {orderId}));
};

const updateCommitDate = async (connection, orderId, vehicle) => {
    if (vehicle !== null && vehicle !== '') {
        const existing = await exports.byId(connection, orderId);
        if (existing.commit_date === null) {
            const commit_date = Math.floor(Date.now() / 1000);
            await updateCommitDateQuery.run(connection,
                {orderId, commit_date});
        }
    }
};

exports.cameraOrders = async (connection) => {
    const rows = await cameraOrdersQuery.run(connection);
    for (const row of rows) {
        row.times = row.times_comma === null ? null :
            row.times_comma.split(',').filter(time => time.length > 0).join(', ');
    }
    return rows;
};

// Should be used together
exports.cameraOrderPhotos = async (connection) => {
    return cameraOrderPhotosQuery.run(connection);
};

exports.savePhotos = async (connection, orderId, generatedIds) => {
    const values = generatedIds.map(genId => [orderId, genId]);
    return savePhotosQuery.run(connection, {values});
};

exports.orderPhotos = async (connection, orderId) => {
    return photosQuery.run(connection, {orderId});
};

exports.associate = async (connection, orderId, planId) => {
    return associateQuery.run(connection, {orderId, planId});
};

exports.calendar = async (connection, start, end, location) => {
    assert.equal(typeof start, 'string');
    assert.equal(typeof end, 'string');
    assert.equal(typeof location, 'string');
    assert.ok(['estonia', 'foreign', 'all'].indexOf(location) >= 0);
    const rows = await calendarQuery.run(connection, {start, end, location});
    for (const row of rows) {
        row.times = row.times_comma === null ? [] :
            row.times_comma.split(',').filter(time => time.length > 0);
        row.shortCompanyName = row.company_name === null ? null :
            shortenCompanyName(row.company_name);
    }
    return rows;
};

const shortenCompanyName = (name) => {
    if (name.length < 8) {
        return name;
    }
    const words = name.split(/\s/);
    if (words.length <= 1) {
        return name;
    }
    const first = words[0];
    if (first.length <= 3) {
        return words[0] + ' ' + words[1];
    } else {
        return words[0];
    }
};

exports.companyOrderList = async (connection, paginator) => {
    return companyOrderListQuery.run(connection, paginator.params());
};

exports.companyOrderListCount = async (connection, paginator) => {
    return companyOrderListCountQuery.oneField(connection, 'count', paginator.params());
};

exports.companyUncommitted = async (connection, companyId) => {
    return companyUncommittedQuery.run(connection, {companyId});
};

exports.updateCancel = async (connection, orderId, data) => {
    const cancel_date = data.cancelled ?
        Math.floor(Date.now() / 1000) : null;
    return updateCancelQuery.run(connection,
        Object.assign({}, data, {cancel_date, orderId}));
};

exports.forSelector = async (connection, planId) => {
    return forSelectorQuery.run(connection, {planId});
};

exports.markSent = async (connection, orderId) => {
    return markSentQuery.run(connection, {orderId});
};

exports.idByPlanId = async (connection, planId) => {
    return idByPlanIdQuery.oneField(connection, 'id', {planId});
};

exports.removePhoto = async (connection, photoId) => {
    return removePhotoQuery.run(connection, {photoId});
};

exports.photoData = async (connection, photoId) => {
    const row = await photoQuery.one(connection, {photoId});
    if (!row) {
        throw new Error(`No photo ${photoId}.`);
    }
    return row;
};

exports.countries = async (connection) => {
    return countriesQuery.run(connection);
};

exports.saveDocuments = async (connection, orderId, filesData) => {
    const now = Math.floor(Date.now() / 1000);
    const values = filesData.map(data => [
        orderId, data.original_name, now, data.generated_id, data.comment
    ]);
    return saveDocumentsQuery.run(connection, {values});
};

exports.saveComments = async (connection, comments) => {
    for (const comment of comments) {
        await saveCommentQuery.run(connection, {
            documentId: comment.document_id,
            comment: comment.comment
        });
    }
};

exports.documents = async (connection, orderId) => {
    return documentsQuery.run(connection, {orderId});
};

exports.document = async (connection, documentId) => {
    const row = await documentQuery.one(connection, {documentId});
    if (!row) {
        throw new Error(`No document ${documentId}.`);
    }
    return row;
};

exports.removeDocument = async (connection, documentId) => {
    await removeDocumentQuery.run(connection, {documentId});
};
