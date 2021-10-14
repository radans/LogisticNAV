const itemModel = require('./item');
const sideModel = require('./side');
const clientModel = require('./client');
const hsl = require('./hsl');
const api = require('../common/api');
const log = require('./log');

// Sheet contains single packaging information.

const create = exports.create = function() {
    var model = {
        id: ko.observable(null),
        clients: ko.observableArray([]),
        name: ko.observable('Uus tööleht'),
        length: ko.observable('13.5'),
        height: ko.observable('2.64'),
        action: {},
        side1: ko.observable(),
        side2: ko.observable(),
        sideWidth: ko.observable(800),
        sideHeight: ko.observable(340),
        useOrder: ko.observable(false),
        useNames: ko.observable(true),
        tableFont: ko.observable('16'),
        orderId: null,
        modified: ko.observable(false),
        modifiedText: ko.observable(''),
        prevData: null
    };

    model.side1(sideModel.create(1, model));
    model.side2(sideModel.create(2, model));

    // Converts the sheet to a data object.
    
    model.toJS = function() {
        return {
            version: 4,
            id: model.id(),
            name: model.name(),
            length: model.length(),
            height: model.height(),
            sideWidth: model.sideWidth(),
            sideHeight: model.sideHeight(),
            clients: model.clients().map(function(client) {
                return client.toJS();
            }),
            side1: model.side1().toJS(),
            side2: model.side2().toJS(),
            useOrder: model.useOrder(),
            useNames: model.useNames(),
            tableFont: model.tableFont(),
            orderId: model.orderId,
            modified: model.modified(),
            modifiedText: model.modifiedText()
        };
    };

    // Updates the model from the given data.
    
    model.update = function(data) {
        model.id(data.id);
        model.name(data.name);
        model.length(data.length);
        model.height(data.height);
        model.sideWidth(data.sideWidth);
        model.sideHeight(data.sideHeight);
        model.clients(data.clients.map(function(clientData) {
            var client = clientModel.create();
            client.update(clientData);
            return client;
        }));
        model.side1().update(data.side1);
        model.side2().update(data.side2);
        model.side1().items().forEach(function(placed) {
            placed.updatePeer();
        });
        model.side2().items().forEach(function(placed) {
            placed.updatePeer();
        });
        if (typeof data.useOrder === 'boolean') {
            model.useOrder(data.useOrder);
        }
        if (typeof data.tableFont === 'string') {
            model.tableFont(data.tableFont);
        } else {
            model.tableFont('14');
        }
        if (typeof data.useNames === 'boolean') {
            model.useNames(data.useNames);
        }
        if (typeof data.modified === 'boolean') {
            model.modified(data.modified);
        }
        if (typeof data.modifiedText === 'string') {
            model.modifiedText(data.modifiedText);
        }
        model.prevData = data;
    };

    // Gathers all items from all clients.

    model.allItems = ko.pureComputed(function() {
        var all = [];
        model.clients().forEach(function(client) {
            client.items().forEach(function(item) {
                all.push(item);
            });
        });
        return all;
    });

    // Adds new client.

    model.action.addClient = function() {
        var clients = model.clients();
        var order = '1';
        // Tries to guess the order number.
        if (clients.length > 0) {
            var last = clients[clients.length - 1];
            var lastOrder = last.order();
            var lastOrderNum = parseInt(lastOrder, 10);
            if (!isNaN(lastOrderNum)) {
                order = (lastOrderNum + 1).toString();
            }
        }
        // Find order.
        model.addClient(order);
    };

    // Enter pressed on height or order input.

    model.action.press = function(item, event) {
        var keyCode = event.which ? event.which : event.keyCode;
        if (keyCode === 13) {
            var client = model.itemClient(item);
            if (client) {
                var items = client.items();
                if (item === items[items.length - 1]) {
                    client.addItem();
                }
            }
        }
        return true;
    };

    // Returns the client that the item
    // belongs to.

    model.itemClient = function(item) {
        var found = null;
        model.clients().forEach(function(client) {
            if (client.items().indexOf(item) >= 0) {
                found = client;
            }
        });
        return found;
    };

    // Removes all items.
    
    model.action.removeAll = function() {
        if (confirm('Kustuta kõik pakid?')) {
            model.clients([]);
            model.side1().items([]);
            model.side2().items([]);
        }
    };

    // Removes all placed items.
    
    model.action.removeAllPlaced = function() {
        if (confirm('Eemalda paigutatud pakid?')) {
            model.side1().removeAllPlaced();
            model.side2().removeAllPlaced();
        }
    };

    model.action.removePlan = async () => {
        if (model.id() && confirm('Kustuta plaan?')) {
            try {
                const url = `/api/plan/${encodeURIComponent(model.id())}`;
                await api.remove(url);
                window.scheduleFlash('Plaan on kustutatud.');
                window.location = '/plans';
            } catch (err) {
                window.showError('Viga plaani kustutamisel. Palun proovi' +
                    ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                throw err;
            }
        }
    };

    // Switches truck sides.
    
    model.action.switchSides = function() {
        var side1Items = model.side1().items();
        var side2Items = model.side2().items();
        model.side1().items(side2Items);
        model.side2().items(side1Items);
    };

    model.addClient = function(order) {
        if (typeof order !== 'string') {
            order = '';
        }
        var client = clientModel.create();
        client.order(order);
        model.clients.push(client);
        var item = itemModel.create();
        item.client(client);
        client.items.push(item);
        client.focus(true);
    };

    // Scale for items/truck width.

    model.widthScale = ko.pureComputed(function() {
        var width = model.sideWidth();
        var truckLength = parseFloat(model.length());
        if (!isNaN(truckLength)) {
            return width / truckLength;
        }
    });

    // Scale for items/truck height.

    model.heightScale = ko.pureComputed(function() {
        var height = model.sideHeight();
        var truckHeight = parseFloat(model.height());
        if (!isNaN(truckHeight)) {
            return height / truckHeight;
        }
    });

    // Returns whether truck dimensions can be changed.
    // They cannot if some part is already placed.

    model.canChangeTruck = ko.pureComputed(function() {
        return model.side1().items().length === 0 &&
            model.side2().items().length === 0;
    });

    // List of scaled packages.

    model.packages = ko.pureComputed(function() {
        var widthScale = model.widthScale();
        var heightScale = model.heightScale();
        if (!isNaN(widthScale) && !isNaN(heightScale)) {
            var items = model.allItems();
            var ok = [];
            items.forEach(function(item) {
                var width = parseFloat(item.width());
                var height = parseFloat(item.height());
                if (!isNaN(width) && !isNaN(height) && width >= 5 && height >= 5) {
                    item.dimensions.width(Math.floor(widthScale * width / 100));
                    item.dimensions.height(Math.floor(heightScale * height / 100));
                    ok.push(item);
                }
            });
            ok.sort(function(p1, p2) {
                return p1.dimensions.height() === p2.dimensions.height() ? 0 :
                    (p1.dimensions.height() < p2.dimensions.height() ? -1 : 1);
            });
            return ok;
        } else {
            return [];
        }
    });

    // Removes the placed item.
    
    model.removePlaced = function(placed) {
        var item = placed.package();
        item.placedCount(item.placedCount() - 1);
        model.side1().items.remove(placed);
        model.side2().items.remove(placed);
        if (item.double()) {
            model.side1().items.remove(placed.peer());
            model.side2().items.remove(placed.peer());
        }
    };

    // Removes item and all associated placed items.
    
    model.removeItem = function(item) {
        model.clients().forEach(function(client) {
            client.removeItem(item);
        });
        model.side1().removeItem(item);
        model.side2().removeItem(item);
    };

    // Removes client and all associated items
    // and placed items.

    model.removeClient = function(client) {
        client.items().forEach(function(item) {
            model.side1().removeItem(item);
            model.side2().removeItem(item);
        });
        model.clients.remove(client);
    };

    // Calculates color assignment.

    model.colorAssignment = ko.pureComputed(function() {
        log.debug('Color assignment');
        var items = model.allItems();
        var unique = {};
        items.forEach(function(item) {
            var order = item.order();
            if (typeof order === 'string' && order.length > 0) {
                unique[order] = true;
            }
        });
        var orders = Object.keys(unique);
        var hueStep = Math.floor(100 / orders.length);
        var currentHue = 0;
        orders.forEach(function(order) {
            unique[order] = currentHue / 100;
            currentHue += hueStep;
        });
        return unique;
    }).extend({ rateLimit: 100 });

    // Assigns colors to assignments.

    model.colorAssignment.subscribe(function(mapping) {
        var items = model.allItems();
        items.forEach(function(item) {
            var order = item.order();
            if (typeof order === 'string' && order.length > 0) {
                var color = hsl.toRgbString(mapping[order], 0.9, 0.8);
                item.color(color);
            } else {
                item.color('#eee');
            }
        });
    });

    // Tree with clients and items.

    model.tree = ko.pureComputed(function() {
        var clients = [];

        model.clients().forEach(function(client) {
            var items = [];
            client.items().forEach(function(item) {
                var count = item.placedCount();
                if (count > 0) {
                    items.push(item);
                }
            });
            if (items.length > 0) {
                // Sorts by item name.
                items.sort(function(i1, i2) {
                    return i1.name() === i2.name() ? 0 : (i1.name() < i2.name() ? -1 : 1);
                });
                clients.push({ client: client, items: items });
            }
        });

        clients.sort(function(c1, c2) {
            var o1 = parseFloat(c1.client.order());
            var o2 = parseFloat(c2.client.order());
            return o1 === o2 ? 0 : (o1 < o2 ? -1 : 1);
        });

        return clients;
    });

    // Calculates the total weight of placed items.

    model.totalWeightString = ko.pureComputed(() => {
        let total = 0;
        let allHaveWeight = true;
        for (const client of model.clients()) {
            for (const item of client.items()) {
                const weight = parseFloat(item.weight());
                if (isNaN(weight)) {
                    if (item.placedCount() > 0) {
                        allHaveWeight = false;
                    }                    
                } else {
                    total += item.placedCount() * weight;
                }
            }
        }
        return total + (allHaveWeight ? '' : '+');
    });

    // Copies remaining parts to the next sheet.

    model.action.toNext = async () => {
        if (!confirm('Kopeeri üle jäänud pakid järgmisele lehele?')) {
            return;
        }
        const sheet = model;
        const clients = [];
        for (const client of sheet.clients()) {
            const items = [];
            for (const item of client.items()) {
                const count = item.count();
                const placedCount = item.placedCount();
                const remainingCount = count - placedCount;
                if (remainingCount > 0) {
                    const copy = item.copy();
                    copy.count(remainingCount.toString());
                    items.push(copy);
                }
            }
            if (items.length > 0) {
                const copy = clientModel.create();
                copy.name(client.name());
                copy.order(client.order());
                copy.items(items);
                for (const item of copy.items()) {
                    item.client(copy);
                }
                clients.push(copy);
            }
        };
        const copy = create();
        copy.clients(clients);
        try {
            const data = await copy.save();
            window.location = `/plan/${data}`;
        } catch (err) {
            window.showError('Viga plaani pakkide üle viimisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    };

    model.saveToServer = async () => {
        return api.save('/api/plan/new', model.toJS());
    };

    model.updateToServer = async () => {
        log.debug('Updating to server.');
        const currentData = model.toJS();
        if (JSON.stringify(currentData) !== JSON.stringify(model.prevData)) {
            log.debug('Differences in data.');
            const id = model.id();
            const url = `/api/plan/${encodeURIComponent(id)}`;
            model.prevData = currentData;
            return api.update(url, currentData);
        } else {
            log.debug('No difference in data.');
        }
    };

    model.save = async () => {
        try {
            if (model.id()) {
                const data = await model.updateToServer();
                return data;
            } else {
                const data = await model.saveToServer();
                model.id(data);
                return data;
            }
        } catch (err) {
            window.showError('Viga plaani salvestamisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
        }
    };

    return model;
};
