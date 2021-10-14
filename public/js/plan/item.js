const randid = require('./randid');
const hsl = require('./hsl');
const debounce = require('../../../lib/debounce');
const api = require('../common/api');

// Standard widths are colored.

const standardWidths = [
    630,
    440,
    330,
    270,
    266
];

// Generates and assigns colors.

function assignStandardColors() {
    var colors = {};

    var hueStep = Math.floor(100 / standardWidths.length);
    var currentHue = 0;
    standardWidths.forEach(function(width) {        
        colors[width] = hsl.toRgbString(currentHue / 100, 0.99, 0.98);
        currentHue += hueStep;
    });

    return colors;
}

const standardWidthColors = assignStandardColors();

exports.create = function() {

    var model = {
        id: randid(),
        code: ko.observable(''),
        name: ko.observable(''),
        width: ko.observable('').extend({ numeric: true }),
        height: ko.observable('').extend({ numeric: true }),
        weight: ko.observable('').extend({ numeric: true }),
        count: ko.observable('1').extend({ numeric: true }),
        placedCount: ko.observable(0),
        focus: ko.observable(false),
        countFocus: ko.observable(false),
        dimensions: {
            height: ko.observable(0), // px
            width: ko.observable(0) // px
        },
        action: {},
        dragOffset: { x: 0, y: 0 }, // drag handle offset
        color: ko.observable('#eee'),
        client: ko.observable(),
        production: ko.observable(false),
        double: ko.observable(false),
        marker: ko.observable('')
    };

    // Converts item to data object.

    model.toJS = function() {
        return {
            id: model.id,
            code: model.code(),
            name: model.name(),
            width: model.width(),
            height: model.height(),
            weight: model.weight(),
            count: model.count(),
            production: model.production(),
            double: model.double(),
            color: model.color(),
            marker: model.marker(),
            dimensions: {
                height: model.dimensions.height(),
                width: model.dimensions.width()
            }
        };
    };

    // Updates the model using the given data.

    model.update = function(data) {
        model.id = data.id;
        model.code(data.code);
        model.name(data.name);
        model.width(data.width);
        model.height(data.height);
        if (typeof data.weight === 'string') {
            model.weight(data.weight);
        }
        model.count(data.count);
        model.production(!!data.production);
        model.double(!!data.double);
        model.dimensions.height(data.dimensions.height);
        model.dimensions.width(data.dimensions.width);
        if (typeof data.marker === 'string') {
            model.marker(data.marker);
        }
        window.model.updateItemLookup(model);
    };

    // Creates a copy with different id
    // of this item.

    model.copy = function() {
        var copy = exports.create();
        copy.update(model.toJS());
        return copy;
    };

    // Order is set by client.

    model.order = ko.pureComputed(function() {
        var client = model.client();
        if (client) {
            return client.order();
        }
    });

    // Clicks on item. Starts drag process.

    model.action.click = function(target, event) {
        var movable = window.model.movable;
        if (!movable.visible()) {
            var target = event.target;
            var rect = target.getBoundingClientRect();
            model.dragOffset.x = event.clientX - rect.left,
            model.dragOffset.y = event.clientY - rect.top;            
            movable.offsetX = model.dragOffset.x;
            movable.offsetY = model.dragOffset.y;
            movable.top(event.clientY - movable.offsetY);
            movable.left(event.clientX - movable.offsetX);
            movable.height(rect.height);
            movable.width(rect.width);
            movable.visible(true);
            movable.item = model;
            movable.type = 'item';
        }
    };

    // Autocomplete.

    model.action.codeKeyDown = (root, event) => {
        if (event.key === 'Tab') {
            if (model.singleMatchFromComplete(event.target.value, true)) {
                return false;
            }
        }
        return true;
    };

    model.singleMatchFromComplete = (value, usePrefix = false) => {
        var found = null;
        var foundCount = 0;
        // Look for current match.
        window.model.complete().forEach(function(item) {
            var code = ko.unwrap(item.code);
            if (code === value) {
                // Exact match.
                found = item;                    
            }
            if (code.startsWith(value)) {
                // It could also be a prefix of some other
                // package code.
                foundCount++;
            }
        });
        if ((foundCount === 1 || usePrefix) && found) {
            // Single exact match.
            // Set values from the previous item.
            window.model.complete([]);
            model.name(ko.unwrap(found.name));
            model.width(ko.unwrap(found.width));
            model.height(ko.unwrap(found.height));
            model.weight(ko.unwrap(found.weight));
            model.marker(ko.unwrap(found.marker));
            model.double(ko.unwrap(found.double));
            model.countFocus(true);
            return true;
        }
        return false;
    };

    model.action.codeInput = (root, event) => {
        var value = event.target.value;
        if (typeof value === 'string' &&
            value.length > 4 &&
            model.placedCount() === 0) {
            if (model.singleMatchFromComplete(value)) {
                return;
            }
            var used = {};
            var client = model.client();
            if (client) {
                // Mark current client items "used".
                client.items().forEach(function(item) {
                    if (item !== model) {
                        // Except the current item itself.
                        used[item.code()] = true;
                    }                    
                });
            }            
            findPackages(value, (packages) => {
                if (packages.length === 1) {
                    // Single match.
                    const pack = packages[0];
                    if (pack.code === model.code()) {
                        model.name(ko.unwrap(pack.name));
                        model.width(ko.unwrap(pack.width));
                        model.height(ko.unwrap(pack.height));
                        model.double(ko.unwrap(pack.double));
                        model.weight(ko.unwrap(pack.weight));
                        model.marker(ko.unwrap(pack.marker));
                        model.countFocus(true);
                        window.model.complete([]);
                    }
                } else {
                    // Multiple matches.
                    const matches = [];
                    for (const pack of packages) {
                        if (!used[pack.code]) {
                            matches.push(pack);
                        }
                    }
                    matches.sort((i1, i2) => {
                        const c1 = ko.unwrap(i1.code);
                        const c2 = ko.unwrap(i2.code);
                        return c1 === c2 ? 0 : (c1 < c2 ? -1 : 1);
                    });
                    window.model.complete(matches.slice(0, 10));
                }
            });
        } else {
            window.model.complete([]);
        }
    };

    // Removes the item.
    
    model.action.remove = function(item, event) {
        if (confirm('Kustuta pakk?')) {
            window.model.sheet.removeItem(model);
        }
    };

    // Code and remaining count.

    model.packageInfo = ko.pureComputed(function() {
        var remaining = model.count() - model.placedCount();
        return model.code() + ' (' + remaining + '/' + model.count() + ')';
    });

    // Return whether there are more instances to place.

    model.empty = ko.pureComputed(function() {
        return model.count() - model.placedCount() === 0;
    });

    // Returns whether to show dimensions.
    
    model.dimensionsVisible = ko.pureComputed(function() {
        return model.dimensions.height() > 35 &&
            model.dimensions.width() > 35;
    });

    // Order/loading number of the package.

    model.orderString = ko.pureComputed(function() {
        var order = model.order();
        if (typeof order === 'string' && order.length > 0) {
            return '#' + order;
        }
        return '';
    });

    // Background color for standard-width packages.

    model.background = ko.pureComputed(function() {
        var width = parseInt(model.width(), 10);
        if (!isNaN(width)) {
            // Find closest.
            standardWidths.forEach(function(std) {
                if (Math.abs(std - width) < 1) {
                    width = std;
                }
            });
            var color = standardWidthColors[width];
            if (typeof color === 'string') {
                return color;
            }
        }
        return "#ffffff";
    });

    return model;
};

const findPackages = debounce(async (token, fn) => {
    try {
        fn(await api.get(`/api/packages/find/${token}`));
    } catch (err) {
        window.showError('Viga pakkide info laadimisel. Palun proovi' +
            ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
        throw err;
    }
}, 1000, false);
