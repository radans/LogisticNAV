const assert = require('assert');
const querystring = require('querystring');
const mysql = require('mysql2');
const escapeId = mysql.escapeId;

const COUNT = 100;

// Base class for paginators.

module.exports = class Paginator {

    // Argument "query" is the object from Express
    // route handler req.query property.

    constructor(query, options) {
        assert.equal(typeof query, 'object');
        assert.equal(typeof options, 'object');
        this.defaultSearch = options.defaultSearch || {};
        this.searchHandler = options.searchHandler || ((name, value) => value);
        this.additionalParams = options.additionalParams || {};
        this.count = COUNT;
        this.total = 0;
        this.query = query;
        this.links = [];
        this.order = options.order || null;
        this.direction = options.direction || 'ASC';
        this.parsePage();
        this.parseSearch();
        this.parseOrder();
    }

    parsePage() {
        const string = this.query.page;
        this.page = 0;
        if (string) {
            const page = parseInt(string, 10);
            if (!Number.isNaN(page)) {
                this.page = page;
            }
        }
    }

    // Copies all query values that is not "page"
    // or "order" or "direction".

    parseSearch() {
        this.search = {};
        for (const key of Object.keys(this.defaultSearch)) {
            let queryValue = this.query[key];
            if (queryValue === '') {
                queryValue = null;
            }
            this.search[key] = this.query.hasOwnProperty(key) ?
                 queryValue : this.defaultSearch[key];
        }
    }

    // Parses order parameters. Overwrites
    // default.

    parseOrder() {
        if (this.query.order) {
            this.order = this.query.order;
        }
        if (this.query.direction) {
            this.direction = this.query.direction;
        }
    }

    // Sets the total amount of items.
    // This will also create paginator links.

    setTotal(total) {
        assert.equal(typeof total, 'number');
        this.total = total;
        this.links = [];
        this.pages = Math.ceil(total/COUNT);
        this.links.push(new Link('prev', this.page - 1,
            this.search, this.order, this.direction, 0 === this.page));

        let start = Math.max(this.page - 2, 0);
        let end = Math.min(this.page + 2, this.pages - 1);

        // Special cases
        if (this.page === 0) {
            start = 0;
            end = Math.min(4, this.pages - 1);
        } else if (this.page === 1) {
            start = 0;
            end = Math.min(4, this.pages - 1);
        } else if (this.page === this.pages - 1 || this.page === this.pages - 2) {
            start = Math.max(0, this.pages - 5);
            end = this.pages - 1;
        }

        for (let page = start; page <= end; page++) {
            this.links.push(new Link('page', page,
                this.search, this.order, this.direction, page === this.page));
        }
        this.links.push(new Link('next', this.page + 1,
            this.search, this.order, this.direction, this.pages - 1 === this.page));
    }

    sortLink(field) {
        assert.equal(typeof field, 'string');
        let direction = 'ASC';
        if (field === this.order) {
            if (this.direction === 'ASC') {
                direction = 'DESC';
            } else {
                direction = 'ASC';
            }
        }
        return querystring.stringify(Object.assign({
            order: field,
            direction: direction
        }, this.search));
    }

    // Helper to produce SQL query params.

    params() {
        const processedSearch = {};
        for (const key of Object.keys(this.search)) {
            processedSearch[key] = this.searchHandler(key, this.search[key]);
        }
        return Object.assign({}, this.additionalParams, processedSearch, {
            order: this.order,
            limit: this.count,
            offset: this.count * this.page,
            ORDER_DIRECTION: this.direction
        });
    }

    searchValue(key) {
        return this.search[key];
    }
};

// Represents one paginator link.

class Link {

    constructor(type, page, search, order, direction, current = false) {
        this.type = type;
        this.page = page;
        this.current = current;
        this.query = querystring.stringify(
            Object.assign({}, search, { page, order, direction }));
    }
}
