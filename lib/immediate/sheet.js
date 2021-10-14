const assert = require('assert');
const paper = require('./paper');
const Side = require('./side');
const Client = require('./client');
const dateString = require('../date_string');

module.exports = class Sheet {

    constructor(data, order, meta) {
        assert.equal(typeof data.version, 'number');
        assert.equal(typeof data.name, 'string');
        assert.equal(typeof data.sideWidth, 'number');
        assert.equal(typeof data.sideHeight, 'number');
        assert.ok(Array.isArray(data.clients));
        assert.equal(typeof data.side1, 'object');
        assert.equal(typeof data.side2, 'object');
        assert.equal(typeof data.useOrder, 'boolean');
        assert.equal(typeof data.useNames, 'boolean');
        assert.equal(typeof data.tableFont, 'string');
        assert.equal(typeof data.height, 'string');
        assert.equal(typeof data.length, 'string');
        // TODO these should be part of the order.
        assert.ok(meta.loading_time === null || typeof meta.loading_time === 'string');
        assert.ok(meta.loading_date === null || typeof meta.loading_date === 'string');
        assert.ok(meta.company_name === null || typeof meta.company_name === 'string');
        this.version = data.version;
        this.name = data.name;
        this.sideWidth = data.sideWidth;
        this.sideHeight = data.sideHeight;
        this.clients = sortClients(data.clients.map(client =>
            new Client(client, this)));
        this.side1 = new Side(data.side1, this, false);
        this.side2 = new Side(data.side2, this, true);
        this.useOrder = data.useOrder;
        this.useNames = data.useNames;
        this.tableFont = parseInt(data.tableFont, 10);
        this.height = parseFloat(data.height);
        this.length = parseFloat(data.length);
        this.assignPackageRefs();
        this.assignPlacedCounts();
        this.heightScale = this.sideHeight / this.height;
        this.widthScale = this.sideWidth / this.length;
        this.heightFactor = paper.SIDE_INNER_HEIGHT / this.sideHeight;
        this.widthFactor = paper.SIDE_INNER_WIDTH / this.sideWidth;
        this.modified = data.modified || false;
        this.modifiedText = data.modifiedText || '';
        this.order = order;
        this.loading_time = meta.loading_time;
        this.loading_date = meta.loading_date;
        this.company_name = meta.company_name;
    }

    assignPackageRefs() {
        const map = new Map();
        for (const client of this.clients) {
            client.buildPackageMap(map);
        }
        this.side1.assignPackageRefs(map);
        this.side2.assignPackageRefs(map);
    }

    assignPlacedCounts() {
        for (const client of this.clients) {
            for (const item of client.items) {
                item.placedCount = this.side1.findPlacedCount(item.id) +
                    this.side2.findPlacedCount(item.id);
            }
        }
    }

    draw(doc) {
        const labels = [];
        this.drawName(doc);
        this.drawChanged(doc);
        this.side1.draw(doc, paper.MARGIN + paper.TITLE_SIZE + paper.GUTTER, labels);
        this.side2.draw(doc, paper.MARGIN + paper.TITLE_SIZE + paper.GUTTER + paper.SIDE_HEIGHT + paper.GUTTER, labels);
        this.drawVehicle(doc);
        this.drawDateAndCompany(doc);
        // Draw labels at the end.
        for (const label of labels) {
            paper.draw(doc, label);   
        }
        // Package list.
        this.drawPackages(doc);
    }

    drawName(doc) {
        paper.draw(doc, (doc) => {
            doc.fontSize(paper.TITLE_SIZE);
            doc.text(this.name, paper.MARGIN, paper.MARGIN, { lineBreak: false });
        });
    }

    drawChanged(doc) {
        if (this.modified) {
            paper.draw(doc, (doc) => {
                doc.fontSize(paper.TITLE_SIZE);
                let label = 'Muudetud';
                if (typeof this.modifiedText === 'string' && this.modifiedText.length > 0) {
                    label = `Muudetud (${this.modifiedText})`;
                }
                doc.fillColor('#cc0000');
                doc.text(label, paper.MARGIN + 300, paper.MARGIN, { lineBreak: false });
            });
        }
    }

    drawVehicle(doc) {
        if (this.order && this.order.vehicle) {
            paper.draw(doc, (doc) => {
                const label = `Auto: ${this.order.vehicle}`;
                doc.fontSize(paper.TEXT_SIZE);
                doc.text(label, paper.MARGIN + 280,
                    paper.MARGIN + paper.TITLE_SIZE + paper.GUTTER, { lineBreak: false });
            });
        }
    }

    drawDateAndCompany(doc) {
        if (this.loading_date && this.loading_time) {
            let text = dateString.toEstonian(this.loading_date) + ' ' + this.loading_time;
            if (this.company_name) {
                text = shortenCompanyName(this.company_name) + ' ' + text;
            }            
            const width = 300;
            const x = paper.MARGIN + paper.SIDE_INNER_WIDTH + 2 - width;
            paper.draw(doc, (doc) => {
                doc.fontSize(paper.TEXT_SIZE);
                doc.text(text, x,
                    paper.MARGIN + paper.TITLE_SIZE + paper.GUTTER,
                    { lineBreak: false, align: 'right', width: 300 });
            });
        }
    }

    drawPackages(doc) {
        const clients = filterPlaced(this.clients);
        const fontSize = parseInt(this.tableFont, 10) - 4.5;
        let y = paper.MARGIN;
        for (const client of clients) {
            y = client.draw(doc, y, fontSize);
        }
    }
};

const filterPlaced = (clients) => {
    return clients.filter((client) => {
        for (const item of client.items) {
            if (item.placedCount > 0) {
                return true;
            }
        }
        return false;
    });
};

const sortClients = (clients) => {
    return clients.sort((c1, c2) => {
        const o1 = parseFloat(c1.order);
        const o2 = parseFloat(c2.order);
        if (Number.isNaN(o1)) {
            return -1;
        } else if (Number.isNaN(o2)) {
            return 1;
        } else {
            return o1 === o2 ? 0 : (o1 < o2 ? -1 : 1);
        }        
    });
};

// TODO reduce code duplication, also in repo/orders.
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
