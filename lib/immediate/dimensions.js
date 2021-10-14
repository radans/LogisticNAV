const assert = require('assert');

module.exports = class Dimensions {

    constructor(data) {
        assert.equal(typeof data.height, 'number');
        assert.equal(typeof data.width, 'number');
        this.height = data.height;
        this.width = data.width;
    }
};
