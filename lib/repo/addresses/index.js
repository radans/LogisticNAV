const fs = require('fs');
const path = require('path');
const Query = require('../../mysql/query');

const saveTokensQuery = new Query(path.join(__dirname, 'sql', 'save_tokens.sql'));
const saveAddressQuery = new Query(path.join(__dirname, 'sql', 'save_address.sql'));
const findAddressQuery = new Query(path.join(__dirname, 'sql', 'find_address.sql'));
const listQuery = new Query(path.join(__dirname, 'sql', 'list.sql'));
const listCountQuery = new Query(path.join(__dirname, 'sql', 'list_count.sql'));
const searchQuery = new Query(path.join(__dirname, 'sql', 'search.sql'));
const updateQuery = new Query(path.join(__dirname, 'sql', 'update.sql'));
const byIdQuery = new Query(path.join(__dirname, 'sql', 'by_id.sql'));
const removeTokensQuery = new Query(path.join(__dirname, 'sql', 'remove_tokens.sql'));
const regionsQuery = new Query(path.join(__dirname, 'sql', 'regions.sql'));
const saveQuery = new Query(path.join(__dirname, 'sql', 'save_new.sql'));
const allIdsQuery = new Query(path.join(__dirname, 'sql', 'all_ids.sql'));

exports.save = async (connection, address, name, notes = null, marker = null) => {
    const existing = await findAddressQuery.one(connection, { address });
    if (existing) {
        // Tokens and name are not updated.
        return existing.id;
    } else {
        const addressLower = address.toLowerCase();
        const region = addressLower.includes('eesti') || addressLower.includes('estonia') ? 'EE' : null;
        const coords = parseCoordinates(address);
        const saved = await saveAddressQuery.run(connection,
            Object.assign({
                address,
                strippedAddress: stripCoordinates(address), name, notes, region
            }, coords));
        const addressId = saved.insertId;
        const tokens = tokenize(address + ' ' + name + (marker ? (' ' + marker) : ''));
        const tokenParams = tokens.map(token => [token, addressId]);
        await saveTokensQuery.run(connection, { addresses: tokenParams });
        return addressId;
    }
};

const tokenize = (address) => {
    return address.split(/\s|\+|\-|\(|\)|\,/)
        .map(token => token.trim())
        .filter(token => token.length > 2)
        .filter(token => !token.match(/^\d+\.\d*$/));
};

exports.list = async (connection, paginator) => {
    return listQuery.run(connection, paginator.params());
};

exports.listCount = async (connection, paginator) => {
    return listCountQuery.oneField(connection, 'count', paginator.params());
};

exports.search = async (connection, token) => {
    const likeToken = `${token}%`;
    return searchQuery.run(connection, { likeToken });
};

exports.update = async (connection, addressId, data) => {
    const existing = await byIdQuery.one(connection, { addressId });
    if (!existing) {
        throw new Error(`Address with id ${addressId} does not exist.`);
    }
    const coords = parseCoordinates(data.address);
    await updateQuery.run(connection,
        Object.assign({}, data, { addressId }, coords, { strippedAddress: stripCoordinates(data.address) }));
    // Update tokens.
    await removeTokensQuery.run(connection, { addressId });
    const tokens = tokenize(data.address + ' ' + data.name + ' ' +
        data.region + (data.marker ? (' ' + data.marker) : ''));
    const tokenParams = tokens.map(token => [token, addressId]);
    if (tokenParams.length > 0) {
        await saveTokensQuery.run(connection, { addresses: tokenParams });
    }
};

exports.regions = async (connection) => {
    return regionsQuery.run(connection);
};

exports.saveNew = async (connection, data) => {
    const coords = parseCoordinates(data.address);
    const saved = await saveQuery.run(connection,
        Object.assign({}, data, coords, { strippedAddress: stripCoordinates(data.address) }));
    const addressId = saved.insertId;
    const tokens = tokenize(data.address + ' ' + data.name + ' ' +
        data.region + (data.marker ? (' ' + data.marker) : ''));
    const tokenParams = tokens.map(token => [token, addressId]);
    if (tokenParams.length > 0) {
        await saveTokensQuery.run(connection, { addresses: tokenParams });
    }
};

const parseCoordinates = (address) => {
    const match = address.match(/(\-?\d+\.\d+),\s*(\-?\d+\.\d+)/);
    if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        return { latitude, longitude };
    }
    return { latitude: null, longitude: null };
};

const stripCoordinates = (address) => {
    return address.replace(/\s*\-?\d+\.\d+,\s*\-?\d+\.\d+\s*/, '');
};

// Migration helper to extract and save all geo coordinates
// of addresses.

exports.updateAllCoords = async (connection) => {
    const ids = (await allIdsQuery.run(connection)).map(row => row.id);
    for (const addressId of ids) {
        console.log(`Updating address ${addressId}.`);
        const data = await byIdQuery.one(connection, { addressId });
        const coords = parseCoordinates(data.address);
        await updateQuery.run(connection,
            Object.assign({}, data, { addressId }, coords, { strippedAddress: stripCoordinates(data.address) }));
    }
};
