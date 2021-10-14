const assert = require('assert');
const Dimensions = require('./dimensions');

module.exports = class Item {

    constructor(data, client) {
        assert.equal(typeof data.id, 'string');
        assert.equal(typeof data.code, 'string');
        assert.equal(typeof data.name, 'string');
        assert.equal(typeof data.width, 'string');
        assert.equal(typeof data.height, 'string');
        assert.equal(typeof data.count, 'string');
        assert.equal(typeof data.production, 'boolean');
        assert.equal(typeof data.double, 'boolean');
        assert.equal(typeof data.dimensions, 'object');
        assert.equal(typeof data.color, 'string');
        this.id = data.id;
        this.code = data.code.substring(0, 14);
        this.name = data.name;
        this.width = data.width;
        this.height = data.height;
        this.count = parseInt(data.count, 10);
        this.production = data.production;
        this.dimensions = new Dimensions(data.dimensions);
        this.color = data.color;
        this.client = client;
        this.size = `${this.height}x${this.width}`.substring(0, 10);
        this.name = data.name;
        this.marker = data.marker;
        this.placedCount = 0;
    }

    get listName() {
        return `${this.placedCount}x${this.name}`;
    }
};
