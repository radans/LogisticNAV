/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

exports.pixelValue = function(observable) {
    return ko.pureComputed(function() {
        return observable() + 'px';
    });
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Helper to generate random string ids.

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

module.exports = function() {
    var id = '';
    for (var i = 0; i < 16; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

exports.debug = (message) => {
    if (window.location.host === '' || window.location.host.match(/^localhost:/)) {
        console.log('DEBUG: ' + message);
    }    
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const randid = __webpack_require__(1);
const hsl = __webpack_require__(4);
const debounce = __webpack_require__(31);
const api = __webpack_require__(5);

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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// From http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

exports.toRgbString = function(h, s, l) {
    var array = exports.toRgb(h, s, l);
    return '#' + array.map(function(value) {
        var high = Math.floor(value / 16);
        var low = value % 16;
        return high.toString(16) + low.toString(16);
    }).join('');
};

exports.toRgb = function(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
};

function hue2rgb(p, q, t) {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

exports.get = async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return handleResponse(response);
};

exports.save = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.update = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.updateFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'PUT',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.postFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'POST',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.remove = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    return handleResponse(response);
};

const handleResponse = async (response) => {
    const json = await response.json();
    if (json.status === 'success') {
        return json.data;
    } else {
        const error = new Error('Serveri poolne viga.');
        error.json = json;
        throw error;
    }
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

const keys = {};

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
}, false);

// Returns whether the key is currently pressed down.

exports.isDown = function(keyCode) {
    return !!keys[keyCode];
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const randid = __webpack_require__(1);
const itemModel = __webpack_require__(3);

exports.create = function() {

    var model = {
        name: ko.observable(''),
        order: ko.observable(''),
        items: ko.observableArray([]),
        focus: ko.observable(false),
        zipcode: ko.observable(''),
        action: {}
    };

    model.toJS = function() {
        return {
            name: model.name(),
            order: model.order(),
            zipcode: model.zipcode(),
            items: model.items().map(function(item) {
                return item.toJS();
            })
        };
    };

    model.update = function(data) {
        model.name(data.name);
        model.order(data.order);
        if (data.zipcode) {
            model.zipcode(data.zipcode);
        }
        model.items(data.items.map(function(itemData) {
            var item = itemModel.create();
            item.client(model);
            item.update(itemData);
            return item;
        }));
    };

    model.removeItem = function(item) {
        model.items.remove(item);
    };

    // Handler to add a new item.

    model.action.addItem = function() {
        model.addItem();
    };

    model.addItem = function() {
        var item = itemModel.create();
        item.client(model);
        model.items.push(item);
        item.focus(true);
    };

    // Handler to remove the client.
    
    model.action.remove = function() {
        if (confirm('Kustuta klient?')) {
            window.model.sheet.removeClient(model);
        }
    };

    model.nameWithOrder = ko.pureComputed(() => {
        const name = model.zipcode() ? `${model.name()} - ${model.zipcode()}` : model.name();
        if (window.model.sheet.useOrder()) {
            if (model.order()) {
                return `${model.order()}. ${name}`;
            }
        }
        return name;
    });

    return model;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// The generic binding handler to clear up HTML.
// From: http://www.achadwick.com/DeveloperBlog/Result/Knockout-Generic-Binding

ko.bindingHandlers.generic = {
   init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
       ko.applyBindingsToNode(element, valueAccessor(), viewModel);
   }
};

ko.extenders.numeric = function(target) {
    //create a writable computed observable to intercept writes to our observable
    var result = ko.pureComputed({
        read: target,  //always return the original observables value
        write: function(newValue) {
            var current = target();
            if (typeof newValue === 'string' && newValue.match(/^\d*$/)) {
                if (newValue === '') {
                    target(newValue);
                } else {
                    var num = parseInt(newValue, 10);
                    if (num > 0 && num <= 15000) {
                        target(newValue);
                    } else {
                        target.notifySubscribers(current);
                    }
                }
            } else {
                target.notifySubscribers(current);
            }
        }
    }).extend({ notify: 'always' });
    //initialize with current value to make sure it is rounded appropriately
    result(target());
    //return the new computed observable
    return result;
};

// Loads KO components.
__webpack_require__(9);
ko.applyBindings();


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(10);
__webpack_require__(12);
__webpack_require__(14);
__webpack_require__(16);
__webpack_require__(18);
__webpack_require__(20);
__webpack_require__(22);
__webpack_require__(24);
__webpack_require__(26);
__webpack_require__(28);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(11);

const createViewModel = ({item, placed}) => {
    return {
        binding: {
            text: placed ? item.code : item.packageInfo,
            style: { background: item.color }           
        }
    };
};

ko.components.register('kp-label', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = "<div data-bind=\"generic: binding\" class=\"kp-package-code\"></div>\n"

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(13);
const pixel = __webpack_require__(0);

const createViewModel = ({item, sheet}) => {
    return {
        item: item,
        sheet: sheet,
        binding: {
            style: {
                height: pixel.pixelValue(item.dimensions.height),
                width: pixel.pixelValue(item.dimensions.width),
                background: item.background
            },
            event: { click: item.action.click },
            css: {
                'kp-package-empty': item.empty,
                'kp-production': item.production,
                'kp-marked': ko.pureComputed(() => (item.marker() || '').length > 0),
                'kp-package-vertical': ko.pureComputed(() =>
                    item.dimensions.height() > item.dimensions.width())
            }
        }
    };
};

ko.components.register('kp-item', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "<div data-bind=\"generic: binding\" class=\"kp-package\">\n    <kp-label params=\"item: item, placed: false\"></kp-label>\n    <div data-bind=\"if: item.dimensionsVisible()\">\n        <div data-bind=\"text: item.height()\" class=\"kp-package-height\"></div>\n        <div data-bind=\"text: item.width()\" class=\"kp-package-width\"></div>\n        <div data-bind=\"if: sheet.useNames()\">\n            <div class=\"kp-package-name\">\n                <div data-bind=\"text: item.name()\"></div>\n            </div>\n        </div>\n        <div data-bind=\"if: sheet.useOrder()\">\n            <div data-bind=\"text: item.orderString()\" class=\"kp-package-order\"></div>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(15);
const pixel = __webpack_require__(0);

const createViewModel = ({item, sheet}) => {
    const package = item.package();
    return {
        item: item,
        sheet: sheet,
        package: package,
        binding: {
            style: {
                left: pixel.pixelValue(item.left),
                top: pixel.pixelValue(item.top),
                height: pixel.pixelValue(package.dimensions.height),
                width: pixel.pixelValue(package.dimensions.width),
                background: package.background
            },
            event: { click: item.action.click },
            css: {
                'kp-production': package.production,
                'kp-marked': ko.pureComputed(() => (package.marker() || '').length > 0),
                'kp-virtual': ko.pureComputed(() => !item.main()),
                'kp-package-vertical': ko.pureComputed(() =>
                    package.dimensions.height() > package.dimensions.width())
            }
        }
    };
};

ko.components.register('kp-placed', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<div data-bind=\"generic: binding\" class=\"kp-placed\">\n    <kp-label params=\"item: package, placed: true\"></kp-label>\n    <div data-bind=\"if: package.dimensionsVisible()\">\n        <div data-bind=\"text: package.height()\" class=\"kp-package-height\"></div>            \n        <div data-bind=\"text: package.width()\" class=\"kp-package-width\"></div>\n        <div data-bind=\"if: sheet.useNames()\">\n            <div class=\"kp-package-name\">\n                <div data-bind=\"text: package.name()\"></div>\n            </div>\n        </div>\n        <div data-bind=\"if: sheet.useOrder()\">\n            <div data-bind=\"text: item.orderString()\" class=\"kp-package-order\"></div>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(17);
const pixel = __webpack_require__(0);

const createViewModel = ({side, sheet}) => {
    return {
        side: side,
        sheet: sheet,
        binding: {
            style: {
                height: pixel.pixelValue(ko.pureComputed(() =>
                    window.model.sheet.sideHeight())),
                width: pixel.pixelValue(ko.pureComputed(() =>
                    window.model.sheet.sideWidth()))
            },
            css: {
                'kp-truck-side-error': ko.pureComputed(() => side().intersect()),
                'kp-truck-side-target': ko.pureComputed(() => side().target())
            },
            attr: {
                id: ko.pureComputed(() => 'side-' + side().index)
            }
        }
    };
};

ko.components.register('kp-side', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "<div>\n    Kõrgus: <span data-bind=\"text: side().totalHeight().toFixed(2)\"></span>m,\n    pikkus: <span data-bind=\"text: side().totalWidth().toFixed(2)\"></span>m\n</div>\n<div data-bind=\"generic: binding\" class=\"kp-truck-side\">\n    <div data-bind=\"foreach: side().items()\" class=\"kp-truck-inner\">\n        <kp-placed params=\"item: $data, sheet: $parent.sheet\"></kp-placed>\n    </div>\n</div>\n"

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(19);

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-clients', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "<div class=\"hidden-print\">\n    <div class=\"kp-article\">\n        <div class=\"form-group\">\n            <div class=\"kp-input-align-code\"></div>\n            <label class=\"kp-article-label kp-input-code\">Kood</label>\n            <label class=\"kp-article-label kp-input-name\">Nimetus</label>                            \n            <label class=\"kp-article-label kp-input-height\">Kõrgus</label>\n            <label class=\"kp-article-label kp-input-width\">Pikkus</label>            \n            <label class=\"kp-article-label kp-input-count\">Kogus</label>         \n            <label class=\"kp-article-label kp-input-double\">Kp.</label>\n            <label class=\"kp-article-label kp-input-production\">T.</label>\n            <label class=\"kp-article-label kp-input-weight\">Kaal</label>\n            <label class=\"kp-article-label kp-input-marker\">Tähis</label>\n        </div>\n        <div data-bind=\"foreach: sheet.clients\">\n            <div class=\"form-group\">\n                <input data-bind=\"hasFocus: focus(), textInput: name\"\n                    type=\"text\" class=\"form-control input-sm kp-input-client\"\n                    placeholder=\"Klient\">\n                <input data-bind=\"textInput: zipcode\"\n                    type=\"text\" class=\"form-control input-sm kp-input-zipcode\"\n                    placeholder=\"Postikood\">\n                <input data-bind=\"textInput: order, visible: $parent.sheet.useOrder()\"\n                    type=\"text\" class=\"form-control input-sm kp-input-client-order\">\n                <a data-bind=\"click: action.addItem\" href=\"#\"\n                    class=\"btn btn-primary btn-sm\">Rida</a>\n                <a data-bind=\"click: action.remove\"\n                    href=\"#\" class=\"btn btn-danger btn-sm\">Kustuta</a>\n            </div>\n            <div data-bind=\"foreach: items()\">\n                <div class=\"form-group\">\n                    <div data-bind=\"style: { background: color() }\" class=\"kp-color-indicator\"></div>\n                    <input data-bind=\"hasFocus: focus(), textInput: code, event: { input: action.codeInput, keydown: action.codeKeyDown }\"\n                        type=\"text\" class=\"form-control input-sm kp-input-code\"\n                        placeholder=\"Kood\" list=\"codelist\">\n                    <input data-bind=\"textInput: name\"\n                        type=\"text\" class=\"form-control input-sm kp-input-name\" placeholder=\"Nimetus\">\n                    <input data-bind=\"textInput: height, disable: placedCount() > 0\"\n                        type=\"text\" class=\"form-control input-sm kp-input-height\" placeholder=\"cm\">\n                    <input data-bind=\"\n                            event: { keypress: $component.sheet.action.press },\n                            textInput: width, disable: placedCount() > 0\"\n                        type=\"text\" class=\"form-control input-sm kp-input-width\" placeholder=\"cm\">                    \n                    <input data-bind=\"\n                            event: { keypress: $component.sheet.action.press },\n                            textInput: count, hasFocus: countFocus()\"\n                        type=\"text\" class=\"form-control input-sm kp-input-count\" placeholder=\"tk\">                    \n                    <div class=\"kp-input-double kp-inline-block\">\n                        <input type=\"checkbox\" data-bind=\"checked: double, disable: placedCount() > 0\"\n                            class=\"kp-inline-block\">\n                    </div>\n                    <div class=\"kp-input-production kp-inline-block\">\n                        <input type=\"checkbox\" data-bind=\"checked: production\"\n                            class=\"kp-inline-block\">\n                    </div>\n                    <input data-bind=\"textInput: weight\"\n                        type=\"text\" class=\"form-control input-sm kp-input-weight\">\n                    <input data-bind=\"textInput: marker\" maxlength=\"3\"\n                        type=\"text\" class=\"form-control input-sm kp-input-marker\">\n                    <button data-bind=\"click: action.remove\"\n                        class=\"btn btn-danger btn-sm\">Kustuta</button>\n                </div>\n                <div data-bind=\"if: placedCount() > parseInt(count(), 10)\">\n                    <div class=\"kp-count-error\">\n                        Autosse paigutatud rohkem kui kogus lubab!\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"kp-autocomplete-message\">\n            Automaatselt paki parameetrite täitmiseks vajuta TAB klahvi pärast pakutud nimekirjast\n            koodi valimist (juhul kui kood on mõne teise koodi prefiks).\n        </div>\n        <div class=\"form-group\">\n            <a data-bind=\"click: sheet.action.addClient\"\n                href=\"#\" class=\"btn btn-primary btn-sm kp-btn\">Klient</a>\n            <a data-bind=\"click: sheet.action.removeAll\"\n                href=\"#\" class=\"btn btn-danger btn-sm kp-btn\">Kustuta kõik</a>\n            <!-- ko if: sheet.id() -->\n                <a data-bind=\"click: sheet.action.removePlan\"\n                    href=\"#\" class=\"btn btn-danger btn-sm kp-btn\">Kustuta plaan</a>\n            <!-- /ko -->\n            <!-- ko if: sheet.id() -->\n                <a href=\"#\" data-bind=\"click: sheet.action.toNext\"\n                    class=\"btn btn-success btn-sm kp-btn\">Ülejääk järgmisele</a>\n            <!-- /ko -->\n            <!-- ko if: sheet.id() -->\n                <a href=\"#\" data-bind=\"attr: {\n                    href: '/plan/' + sheet.id() + '/pdf',\n                    target: 'plan_' + sheet.id() }\"\n                    class=\"btn btn-default btn-sm kp-btn\">PDF</a>\n            <!-- /ko -->\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(21);

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-table', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "<div class=\"kp-table\">\n    <table data-bind=\"style: { 'font-size': sheet.tableFont() + 'px' }\">\n        <tbody data-bind=\"foreach: sheet.tree()\">\n            <tr><td data-bind=\"text: client.nameWithOrder() || '&nbsp;'\"\n                colspan=\"5\" class=\"kp-table-client\">&nbsp;</td></tr>\n            <!-- ko foreach: items -->\n                <tr data-bind=\"style: { 'background-color': color() }\">\n                    <td data-bind=\"text: code\" class=\"text-nowrap\"></td>\n                    <td data-bind=\"text: placedCount() + 'x' + name()\"></td>\n                    <td data-bind=\"text: height() + 'x' + width()\"></td>\n                    <td data-bind=\"text: production() ? 'T' : ''\" class=\"kp-table-production\"></td>\n                    <td data-bind=\"text: marker()\" class=\"kp-table-marker\"></td>\n                </tr>\n            <!-- /ko -->\n        </tbody>\n    </table>\n    <div data-bind=\"if: sheet.tree().length > 0\">\n        <form class=\"kp-margin hidden-print\">\n            <div class=\"form-group\">\n                <select data-bind=\"value: sheet.tableFont\" class=\"form-control input-sm\">\n                    <option value=\"10\">10px</option>\n                    <option value=\"11\">11px</option>\n                    <option value=\"12\">12px</option>\n                    <option value=\"13\">13px</option>\n                    <option value=\"14\">14px</option>\n                    <option value=\"15\">15px</option>\n                    <option value=\"16\">16px</option>\n                    <option value=\"17\">17px</option>\n                    <option value=\"18\">18px</option>\n                </select>\n            </div>\n        </form>\n    </div>\n    <div>\n        Kaal kokku: <span data-bind=\"text: sheet.totalWeightString()\"></span> kg\n    </div>\n</div>\n"

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(23);

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-controls', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<div class=\"kp-margin hidden-print\">\n    Kustuta: X+click\n    <a\n        href=\"#\"\n        data-bind=\"click: sheet.side1().action.removeAllPlaced\"        \n        class=\"btn btn-default btn-xs\">Tühjenda ülemine</a>\n    <a\n        href=\"#\"\n        data-bind=\"click: sheet.side2().action.removeAllPlaced\"\n        class=\"btn btn-default btn-xs\">Tühjenda alumine</a>\n    <a\n        href=\"#\"\n        data-bind=\"click: sheet.action.removeAllPlaced\"\n        class=\"btn btn-default btn-xs\">Tühjenda mõlemad</a>\n    <a\n        href=\"#\"\n        data-bind=\"click: sheet.action.switchSides\"\n        class=\"btn btn-default btn-xs\">Vaheta küljed</a>\n</div>\n"

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(25);

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-settings', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\n    <div class=\"col-xs-2\">\n        <div class=\"form-group\">\n            <label>Töölehe nimetus</label>\n        </div>\n        <div class=\"form-group\">\n            <input\n                data-bind=\"textInput: sheet.name\"\n                type=\"text\"\n                class=\"form-control input-sm\"\n                placeholder=\"Töölehe nimetus (kuupäev)\">\n        </div>\n        <div class=\"form-group\">\n            <label>Kasti pikkus (m)</label>\n        </div>\n        <div class=\"form-group\">\n            <input\n                type=\"text\"\n                data-bind=\"textInput: sheet.length, disable: !sheet.canChangeTruck()\"\n                class=\"form-control input-sm\"\n                placeholder=\"m\">\n        </div>        \n        <div class=\"form-group\">\n            <label>\n                <input\n                    data-bind=\"checked: sheet.modified\"\n                    type=\"checkbox\"> Muudetud\n            </label>\n        </div>\n        <div class=\"form-group\">\n            <label>\n                <input\n                    data-bind=\"checked: sheet.useOrder\"\n                    type=\"checkbox\"> Kasuta jrk. numbreid\n            </label>\n        </div>\n    </div>\n    <div class=\"col-xs-2\">\n        <div class=\"form-group\">\n            <label>Kasti kõrgus (m)</label>\n        </div>\n        <div class=\"form-group\">\n            <input\n                data-bind=\"textInput: sheet.height, disable: !sheet.canChangeTruck()\"\n                type=\"text\"\n                class=\"form-control input-sm\"\n                placeholder=\"m\">\n        </div>\n        <div class=\"form-group\">\n            <label>Muudatuse tekst</label>\n        </div>\n        <div class=\"form-group\">\n            <input\n                type=\"text\"\n                data-bind=\"textInput: sheet.modifiedText, disable: !sheet.modified()\"\n                class=\"form-control input-sm\">\n        </div>\n        <div class=\"form-group\">\n            <label>\n                <input\n                    data-bind=\"checked: sheet.useNames\"\n                    type=\"checkbox\"> Näita nimesid\n            </label>\n        </div>\n    </div>\n</div>\n"

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const template = __webpack_require__(27);
const pixel = __webpack_require__(0);

const createViewModel = ({movable, click}) => {
    return {
        binding: {
            visible: movable.visible,
            style: {
                top: pixel.pixelValue(movable.top),
                left: pixel.pixelValue(movable.left),
                width: pixel.pixelValue(movable.width),
                height: pixel.pixelValue(movable.height)
            },
            click: click
        }
    };
};

ko.components.register('kp-movable', {
    viewModel: { createViewModel }, template
});


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = "<div data-bind=\"generic: binding\" class=\"kp-movable\"></div>\n"

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const model = __webpack_require__(29);
const template = __webpack_require__(34);
const save = __webpack_require__(35);

const createViewModel = () => {
    const instance = model.create();
    window.model = instance;
    const formScript = document.getElementById('data-form');
    const orderScript = document.getElementById('data-order');
    const data = formScript ? JSON.parse(formScript.innerText) : null;
    const order = orderScript ? JSON.parse(orderScript.innerText) : null;
    instance.initialize(data, order);
    return instance;
};

ko.components.register('kp-app', {
    viewModel: { createViewModel }, template
});

window.addEventListener('mousemove', (e) => {
    if (window.model) {
        window.model.action.mouseMove(e);
    }
}, false);

save.init();


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const sheetModel = __webpack_require__(30);
const clientModel = __webpack_require__(7);
const log = __webpack_require__(2);

exports.create = function() {

    var model = {
        sheet: sheetModel.create(),
        itemMap: {}, // item lookup map
        movable: {
            visible: ko.observable(false),
            top: ko.observable(0),
            left: ko.observable(0),
            width: ko.observable(100),
            height: ko.observable(100),
            offsetX: 0,
            offsetY: 0,
            item: null
        },
        action: {},
        complete: ko.observable([]),
        placedMap: {} // placed item lookup map
    };

    // Converts to data object.
    
    model.toJS = function() {
        return model.sheet.toJS();
    };

    // Helper to lookup item by id.
    
    model.lookupItem = function(id) {
        var item = model.itemMap[id];
        if (!item) {
            throw new Error('No item ' + id);
        }
        return item;
    };

    // Helper to lookup placed item by id.
    
    model.lookupPlaced = function(id) {
        var item = model.placedMap[id];
        if (!item) {
            throw new Error('No placed item ' + id);
        }
        return item;
    };

    // Helper to update the lookup map.
    // Called during deserialization.
    
    model.updateItemLookup = function(item) {
        model.itemMap[item.id] = item;
    };

    model.updatePlacedLookup = function(placed) {
        model.placedMap[placed.id] = placed;
    };

    // Initialize by the data or create
    // a new plan.

    model.initialize = function(data, order) {
        if (data) {
            model.sheet.update(data);
        } else {
            model.sheet.action.addClient();
            if (order) {
                // Create for the given order.
                model.sheet.name(order.name);
                model.sheet.orderId = order.id;
            }            
        }
    };

    // Returns object with top left and bottom
    // right coordinates.

    model.movable.rect = function() {
        var movable = model.movable;
        return {
            x1: movable.left(),
            y1: movable.top(),
            x2: movable.left() + movable.width(),
            y2: movable.top() + movable.height()
        };
    };

    // Moves "draggable" element.

    model.action.mouseMove = function(event) {
        var movable = model.movable;
        if (movable.visible()) {
            movable.left(event.clientX - movable.offsetX);
            movable.top(event.clientY - movable.offsetY);
            var placed = movable.type === 'placed' ? movable.placed : null;
            adjustSideState(model.sheet.side1(), event, movable, placed);
            adjustSideState(model.sheet.side2(), event, movable, placed);
        }
    };

    // Adjusts side intersect/target state.

    function adjustSideState(side, event, movable, placed) {
        side.adjustState(movable, event.clientX, event.clientY, placed);
    }

    // Movable is clicked.

    model.action.clickMovable = function(root, event) {
        log.debug('Movable is clicked.');
        // Trigger side state adjustment.
        model.action.mouseMove(event);
        var movable = model.movable;
        if (movable.visible()) {
            log.debug('Movable is visible.');
            var side1 = model.sheet.side1();
            var side2 = model.sheet.side2();
            if (!side1.inside() &&
                !side2.inside()) {
                movable.visible(false);
                log.debug('Movable was not inside either side.');
                return;
            }
            var item = movable.item;
            var adjust = !event.ctrlKey;
            var dropped = false;
            log.debug('Automatic adjustment: ' + adjust);
            if (movable.type === 'item') {
                dropped = dropped || tryDropItemInto(side1, item, adjust);
                dropped = dropped || tryDropItemInto(side2, item, adjust);
            } else {
                dropped = dropped || tryDropPlacedInto(side1, movable.placed, adjust);
                dropped = dropped || tryDropPlacedInto(side2, movable.placed, adjust);
            }
            if (dropped) {
                log.debug('Item or package dropped into place.');
                movable.visible(false);
            }
        }
    };

    function tryDropItemInto(side, item, adjust) {
        if (side.inside() &&
            !side.intersect()) {
            if (side.dropItem(item, adjust)) {
                side.target(false);
                side.intersect(false);
                side.inside(false);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    function tryDropPlacedInto(side, placed, adjust) {
        if (side.inside() &&
            !side.intersect()) {
            if (side.dropPlaced(placed, adjust)) {
                side.target(false);
                side.intersect(false);
                side.inside(false);
                return true;
            } else {
                return false;
            }            
        }
        return false;
    }

    return model;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const itemModel = __webpack_require__(3);
const sideModel = __webpack_require__(32);
const clientModel = __webpack_require__(7);
const hsl = __webpack_require__(4);
const api = __webpack_require__(5);
const log = __webpack_require__(2);

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


/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = (fn, time, runAtEnd = true) => {
    let allow = true;
    let atEnd = null;
    return (...args) => {
        atEnd = args;
        if (allow) {            
            allow = false;
            setTimeout(() => {
                allow = true;
                if (runAtEnd) {
                    fn(...atEnd);
                }                
            }, time);
            fn(...args);
        }
    };
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const placedItem = __webpack_require__(33);
const keys = __webpack_require__(6);

exports.create = function(index, sheet) {
    if (!sheet) {
        throw new Error('Sheet is not set.');
    }
    var model = {
        index: index,
        items: ko.observableArray([]),
        intersect: ko.observable(false),
        target: ko.observable(false),
        inside: ko.observable(false),
        action: {},
        inner: null, // inner element for coordinates, cached
        movable: { x1: 0, y1: 0 } // translated during state update
    };

    // Converts the side to a data object.

    model.toJS = function() {
        return {
            items: model.items().map(function(item) {
                return item.toJS();
            })
        };
    };

    // Updates from the given data object.
    
    model.update = function(data) {
        model.items(data.items.map(function(itemData) {
            var item = placedItem.create();
            item.update(itemData);
            return item;
        }));
    };

    // Removes all placed items.

    model.action.removeAllPlaced = function() {
        if (confirm('Eemalda paigutatud pakid?')) {
            model.removeAllPlaced();
        }
    };

    model.removeAllPlaced = function() {
        model.items().forEach(function(placed) {
            var item = placed.package();
            item.placedCount(item.placedCount() - 1);
        });
        model.items([]);
    };

    // Item from packages list is dropped.
    // Assumes that state update has been ran.
    // Returns true if successfully placed.

    model.dropItem = function(item, adjust) {
        var placed = placedItem.create();
        placed.package(item);
        var location = model.adjusted(placed, adjust);
        placed.top(location.top);
        placed.left(location.left);
        if (item.double()) {
            var coords = {
                x1: location.left,
                y1: location.top,
                x2: location.left + item.dimensions.width(),
                y2: location.top + item.dimensions.height()
            };
            var other = model.opposite();
            if (other.hasIntersect(coords, null)) {
                // Cannot place. Blocked by something.
                return false;
            } else {
                // Peer placed item for the other side.
                var peer = placedItem.create();
                peer.package(item);
                peer.top(location.top);
                peer.left(location.left);
                // Sets up peer relationship.
                peer.main(false);
                peer.peer(placed);
                placed.peer(peer);
                item.placedCount(item.placedCount() + 1);
                model.items.push(placed);
                other.items.push(peer);
                return true;
            }
        } else {
            item.placedCount(item.placedCount() + 1);
            model.items.push(placed);
            return true;
        }
    };

    // Already placed item is dropped (moved).
    // Assumes that state update has been ran.

    model.dropPlaced = function(placed, adjust) {
        var item = placed.package();
        var location = model.adjusted(placed, adjust);
        if (item.double()) {
            if (model.items().indexOf(placed) < 0) {
                // Side switch not allowed.
                return false;
            }
            var coords = {
                x1: location.left,
                y1: location.top,
                x2: location.left + item.dimensions.width(),
                y2: location.top + item.dimensions.height()
            };
            var other = model.opposite();
            var peer = placed.peer();
            if (other.hasIntersect(coords, peer)) {
                // Cannot be placed. Blocked.
                return false;
            } else {
                // Updates both.
                placed.top(location.top);
                placed.left(location.left);
                peer.top(location.top);
                peer.left(location.left);
                return true;
            }
        } else {
            // Swap side when needed.
            if (model.items().indexOf(placed) < 0) {
                var other = model.opposite();
                other.items.remove(placed);
                model.items.push(placed);
            }
            placed.top(location.top);
            placed.left(location.left);
            return true;
        }
    };

    // Finds the opposite side of the truck.

    model.opposite = function() {
        var side1 = window.model.sheet.side1();
        var side2 = window.model.sheet.side2();
        return model === side1 ? side2 : side1;
    };

    // Finds adjusted coordinaates.

    model.adjusted = function(placed, adjust) {
        // Uses values from state calculation.
        var top = Math.round(model.movable.y1);
        var left = Math.round(model.movable.x1);
        if (adjust) {
            return adjustIteration(placed, top, left, 1);
        } else {
            return { top: top, left: left };
        }
    };

    // Checks whether the given coords have
    // intersection with the placed item.

    function hasIntersection(coords, placed) {
        var item = placed.package();
        var x1 = placed.left();
        var y1 = placed.top();
        var x2 = x1 + item.dimensions.width();
        var y2 = y1 + item.dimensions.height();
        return coords.x1 < x2 && coords.x2 > x1 && coords.y1 < y2 && coords.y2 > y1;
    }

    // Helper to iteratively adjust the position until intersection
    // or until min bottom/left is found.

    function adjustIteration(placed, top, left, iterCount) {
        // Try to adjust.
        var item = placed.package();
        var width = item.dimensions.width();
        var height = item.dimensions.height();
        // In viewport coordinates.
        var placedRect = {
            x1: left,
            y1: top,
            x2: left + width,
            y2: top + height
        };
        if (keys.isDown(68)) { // D
            // Allows to place where the pack intersects
            // with another pack.
            return { top: top, left: left };
        }
        // Placement helper, adjusts coordinates.
        var supportY = findSupportY(placed, placedRect);
        var adjustedTop = supportY - height;
        var adjustedCoords = {
            x1: placedRect.x1,
            y1: adjustedTop,
            x2: placedRect.x2,
            y2: adjustedTop + height
        };
        if (model.hasIntersect(adjustedCoords, placed)) {
            // Adjustment failed.
            // Finish here.
            return { top: top, left: left };
        }
        var adjustedLeft = left;
        if (!keys.isDown(65)) {
            // Try adjust x too.
            var supportX = keys.isDown(83) ? // S
                findSupportXRight(placed, adjustedCoords) :
                findSupportXLeft(placed, adjustedCoords);
            adjustedLeft = supportX;
            adjustedCoords = {
                x1: adjustedLeft,
                y1: adjustedTop,
                x2: adjustedLeft + width,
                y2: adjustedTop + height
            };
            if (model.hasIntersect(adjustedCoords, placed)) {
                // Finish here.
                return { top: adjustedTop, left: left };
            }
        }
        if ((top === adjustedTop && left === adjustedLeft) || iterCount > 10) {
            // Use fully adjusted coordinates.
            return { top: adjustedTop, left: adjustedLeft };
        } else {
            // Try another iteration.
            return adjustIteration(placed, adjustedTop, adjustedLeft, iterCount + 1);
        }
    }

    // Helper to find y coordinaate support.

    function findSupportY(placed, placedRect) {
        var sideHeight = window.model.sheet.sideHeight();
        // Extends the rectangle to bottom of the side.
        var extendedRect = {
            x1: placedRect.x1,
            y1: placedRect.y1,
            x2: placedRect.x2,
            y2: sideHeight
        };

        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var intersectingYs = intersecting.map(function(placed) {
            return placed.top();
        });
        intersectingYs.sort(numberComparator);
        if (intersectingYs.length > 0) {
            // Element below.
            return intersectingYs[0];
        } else {
            // Bottom side.
            return sideHeight;
        }
    }

    // Helper to find x coordinate support.
    
    function findSupportXLeft(placed, placedRect) {
        // Extends the rectangle to left of the side.
        var extendedRect = {
            x1: 0,
            y1: placedRect.y1,
            x2: placedRect.x2,
            y2: placedRect.y2
        };
        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var intersectingXs = intersecting.map(function(placed) {
            return placed.left() + placed.package().dimensions.width();
        });
        intersectingXs.sort(numberComparator);
        intersectingXs.reverse();
        if (intersectingXs.length > 0) {
            // Element left.
            return intersectingXs[0];
        } else {
            // Left side.
            return 0;
        }
    }

    // Helper to find x coordinate support by right side.
    
    function findSupportXRight(placed, placedRect) {
        var sideWidth = window.model.sheet.sideWidth();
        // Extends the rectangle to right of the side.
        var extendedRect = {
            x1: placedRect.x1,
            y1: placedRect.y1,
            x2: sideWidth,
            y2: placedRect.y2
        };
        // Finds intersecting items. Ignores itself.
        var intersecting = [];
        model.items().forEach(function(placedItem) {
            if (placedItem === placed) {
                return;
            }
            if (hasIntersection(extendedRect, placedItem)) {
                intersecting.push(placedItem);
            }
        });
        var width = placed.package().dimensions.width();
        var intersectingXs = intersecting.map(function(placed) {
            return placed.left() - width;
        });
        intersectingXs.sort(numberComparator);
        if (intersectingXs.length > 0) {
            // Element left.
            return intersectingXs[0];
        } else {
            // Right side.
            return sideWidth - width;
        }
    }

    // Compares numerical values.

    function numberComparator(n1, n2) {
        return n1 === n2 ? 0 : (n1 < n2 ? -1 : 1);
    }

    // Removes all placed items associated with the
    // given item.

    model.removeItem = function(item) {
        var list = model.items();
        var filtered = list.filter(function(placed) {
            return placed.package() !== item;
        });
        model.items(filtered);
    };

    // Checks if part intersects with items in this
    // side. placed - placed item of part itself.

    model.hasIntersect = function(movable, placed) {
        var items = model.items();
        for (var i = 0; i < items.length; i++) {
            if (placed === items[i]) {
                // Can intersect itself.
                continue;
            }
            if (hasIntersection(movable, items[i])) {
                return true;
            }
        }
        return false;
    };

    // Adjusts side state then a part is moved.

    var translated = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    model.adjustState = function(movable, eventX, eventY, placed) {
        var rect = model.rect();
        // Check if inside.
        var inside = eventX >= rect.x1 &&
            eventX <= rect.x2 &&
            eventY >= rect.y1 &&
            eventY <= rect.y2;
        if (inside) {
            // Adjust movable itself.
            var roundX = Math.floor(movable.left());
            var roundY = Math.floor(movable.top());
            movable.left(roundX + rect.x1 % 1);
            movable.top(roundY + rect.y1 % 1);
            var movableRect = movable.rect();
            var width = movableRect.x2 - movableRect.x1;
            var height = movableRect.y2 - movableRect.y1;
            // Translates movableRect into side coords.
            translated.x1 = movableRect.x1 - rect.x1;
            translated.y1 = movableRect.y1 - rect.y1;
            translated.x2 = translated.x1 + width;
            translated.y2 = translated.y1 + height;
            model.movable.x1 = translated.x1;
            model.movable.y1 = translated.y1;
            // Side overlap.
            var noOverlap = movableRect.x1 >= rect.x1 &&
                movableRect.y1 >= rect.y1 - 10 &&
                movableRect.x2 <= rect.x2 &&
                movableRect.y2 <= rect.y2;
            if (model.hasIntersect(translated, placed)) {
                if (keys.isDown(68)) { // D
                    model.intersect(false);
                } else {
                    model.intersect(true);
                }                
            } else if (!noOverlap) {
                model.intersect(true);
            } else {
                model.intersect(false);
                model.target(true);                
            }
            model.inside(true);          
        } else {
            model.target(false);
            model.intersect(false);
            model.inside(false);
        }
    };

    // Returns inner rectangle by top
    // left and bottom right coordinaates.

    var rect = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
    };

    model.rect = function() {
        if (!model.inner) {
            model.inner = document.querySelector('#side-' + model.index + ' > div');
        }
        var domRect = model.inner.getBoundingClientRect();        

        rect.x1 = domRect.left;
        rect.y1 = domRect.top;
        rect.x2 = domRect.left + domRect.width;
        rect.y2 = domRect.top + domRect.height;

        return rect;
    };

    // Finds total height of the set of packages
    // in this side.

    model.totalHeight = ko.pureComputed(function() {
        var sheet = window.model.sheet;
        var min = 100000;
        model.items().forEach(function(item) {
            if (item.top() < min) {
                min = item.top();
            }
        });
        if (min === 100000) {
            return 0;
        }
        return 1.01 * (sheet.sideHeight() - min) / sheet.heightScale();
    });

    // Finds total width of the set of packages
    // in this side.

    model.totalWidth = ko.pureComputed(function() {
        var sheet = window.model.sheet;
        var max = 0;
        model.items().forEach(function(item) {
            var right = item.left() + item.package().dimensions.width();
            if (right > max) {
                max = right;
            }
        });
        return 1.005 * max / sheet.widthScale();
    });

    return model;
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const randid = __webpack_require__(1);
const keys = __webpack_require__(6);

exports.create = function() {

    var model = {
        id: randid(),
        left: ko.observable(0),
        top: ko.observable(0),        
        package: ko.observable(),
        action: {},
        dragOffset: { x: 0, y: 0 },
        main: ko.observable(true),
        peer: ko.observable()
    };

    // Converts to data object.
    
    model.toJS = function() {
        var peer = model.peer();
        return {
            id: model.id,
            left: model.left(),
            top: model.top(),
            package: model.package().id,
            main: model.main(),
            peer: peer ? peer.id : null
        };
    };

    // Updates the model using the given data.
    // Assumes that items are already loaded
    // and the current sheet is selected.

    model.update = function(data) {
        model.left(data.left);
        model.top(data.top);
        var item = window.model.lookupItem(data.package);        
        model.package(item);
        if (typeof data.main === 'boolean') {
            model.main(data.main);
            if (data.main) {
                item.placedCount(item.placedCount() + 1);
            }
        }
        if (typeof data.id === 'string') {
            model.id = data.id;
        }
        // Transient. Peer resolved in next step.
        model.peerId = data.peer;
        window.model.updatePlacedLookup(model);
    };

    // Updates peers after deserialization.

    model.updatePeer = function() {
        if (model.peerId) {
            model.peer(window.model.lookupPlaced(model.peerId));
        }
    };

    model.action.click = function(target, event) {
        if (keys.isDown(88)) {
            // Removes item.
            window.model.sheet.removePlaced(model);
        } else {
            // Starts drag process.
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
                movable.item = model.package();
                movable.placed = model;
                movable.type = 'placed';
            }
        }
    };

    model.orderString = ko.pureComputed(function() {
        var package = model.package();
        if (package) {
            return package.orderString();
        }
        return '';
    });

    // Helper to bind the item to DOM.

    model.binding = {
        style: {
            left: ko.pureComputed(function() {
                return model.left() + 'px';
            }),
            top: ko.pureComputed(function() {
                return model.top() + 'px';
            }),
            height: ko.pureComputed(function() {
                return model.package().dimensions.height() + 'px';
            }),
            width: ko.pureComputed(function() {
                return model.package().dimensions.width() + 'px';
            }),
            'background-color': ko.pureComputed(function() {
                return model.package().background();
            })
        },
        click: model.click
    };

    return model;
};


/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "<hr class=\"hidden-print\">\n<form class=\"hidden-print\">\n    <kp-settings params=\"sheet: sheet\"></kp-settings>    \n</form>\n<hr class=\"hidden-print\">\n<kp-clients params=\"sheet: sheet\"></kp-clients>\n<h1 data-bind=\"text: sheet.name\"></h1>\n<hr class=\"hidden-print\">\n<div data-bind=\"foreach: sheet.packages\"\n    class=\"kp-packages clearfix hidden-print\">\n    <kp-item params=\"item: $data, sheet: $parent.sheet\"></kp-item>\n</div>\n<kp-controls params=\"sheet: sheet\"></kp-controls>\n<div data-bind=\"style: { width: (sheet.sideWidth() + 10) + 'px' }\" class=\"kp-canvas\">\n    <kp-side params=\"side: sheet.side1, sheet: sheet\"></kp-side>\n    <kp-side params=\"side: sheet.side2, sheet: sheet\"></kp-side>\n</div>\n<kp-table params=\"sheet: sheet\"></kp-table>\n<datalist data-bind=\"foreach: complete()\" id=\"codelist\">\n    <option data-bind=\"attr: { value: code }\"></option>\n</datalist>\n<kp-movable params=\"movable: movable, click: action.clickMovable\"></kp-movable>\n"

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const log = __webpack_require__(2);

let lastSave = 0;
let saving = false;

const immediateSave = async (immediate) => {
    log.debug('Immediate save started.');
    try {
        saving = true;
        await window.model.sheet.save();
    } catch (e) {
        throw e;
    } finally {
        saving = false;
        lastSave = Date.now();
        log.debug('Immediate save finished.');
    }
};

const parentAnchor = (element) => {
    if (!element) {
        return null;
    }
    if (element.href) {
        return element;
    }
    return parentAnchor(element.parentNode);
};

exports.init = () => {
    log.debug('Initializing the save helper.');
    document.addEventListener('click', async (e) => {
        const anchor = parentAnchor(e.target);
        if (!anchor) {
            return;
        }
        if (anchor.href.match(/#[^#]*$/)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        await immediateSave();
        if (anchor.target && anchor.target.match(/^plan_/)) {
            window.open(anchor.href, anchor.target);
        } else {
            window.location = anchor.href;
        }        
    }, false);
    log.debug('Save helper initialized.');
};

const periodicSave = async () => {
    if (saving) {
        return;
    }
    log.debug('Periodic save started.');
    try {
        saving = true;
        await window.model.sheet.save();
    } finally {
        saving = false;
        lastSave = Date.now();
        log.debug('Periodic save finished.');
    }
};

const ITERATE_INTERVAL = 1000;

const iterateSave = async () => {
    try {
        await periodicSave();
    } finally {
        setTimeout(iterateSave, ITERATE_INTERVAL);
    }
};

setTimeout(iterateSave, ITERATE_INTERVAL);


/***/ })
/******/ ]);