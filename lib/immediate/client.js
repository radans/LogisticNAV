const assert = require('assert');
const paper = require('./paper');
const font = require('../pdf/font');
const Item = require('./item');

module.exports = class Client {

    constructor(data, sheet) {
        assert.equal(typeof data.name, 'string');
        assert.equal(typeof data.order, 'string');
        assert.ok(Array.isArray(data.items));
        this.name = data.name;
        this.order = data.order;
        this.zipcode = data.zipcode;
        this.sheet = sheet;
        this.items = sortItems(data.items.map(item =>
            new Item(item, this)));
    }

    buildPackageMap(map) {
        for (const item of this.items) {
            map.set(item.id, item);
        }
    }

    draw(doc, y, fontSize) {
        const x = paper.MARGIN + paper.SIDE_INNER_WIDTH + paper.GUTTER;
        paper.draw(doc, (doc) => {
            const name = this.zipcode ? `${this.name} - ${this.zipcode}` : this.name;
            const text = this.sheet.useOrder ?
                `${this.order}. ${name}` : name;
            doc.fontSize(fontSize);
            doc.font(font.BOLD);
            doc.text(text, x, y, { lineBreak: false });
        });
        y += fontSize * 1.2;
        const items = this.items.filter((item) => item.placedCount > 0);
        // TODO color is property of client, not item.
        const color = items[0] ? items[0].color : '#ffffff';
        paper.draw(doc, (doc) => {
            doc.fontSize(fontSize);
            doc.font(font.NORMAL);
            // 1st and 3rd column widths.
            let maxCodeWidth = 0;
            let maxSizeWidth = 0;
            for (const item of items) {
                maxCodeWidth = Math.max(maxCodeWidth, doc.widthOfString(item.code));
                maxSizeWidth = Math.max(maxSizeWidth, doc.widthOfString(item.size));
            }
            // Client rectangle height.
            let clientHeight = 0;
            for (const item of items) {
                // TODO somehow fix code duplication.          
                const nx1 = x + 2 * 5 + maxCodeWidth;
                const nx2 = paper.WIDTH - paper.MARGIN - 2 * 5 - maxSizeWidth;
                const nameWidth = nx2 - nx1;
                const nameOptions = {
                    lineBreak: true,
                    lineGap: 0.1 * fontSize,
                    width: nameWidth
                };
                const nameHeight = doc.heightOfString(item.listName, nameOptions);                
                clientHeight += Math.max(fontSize * 1.2, nameHeight);
            }
            // Background rectangle.
            doc.rect(x, y, paper.WIDTH - paper.MARGIN - x,
                clientHeight).fillAndStroke(color, color);
            doc.fillColor('#000000');
            // Actually draw item info.
            for (const item of items) {
                doc.text(item.code, x + 5, y, { lineBreak: false });
                doc.text(item.size, paper.WIDTH - paper.MARGIN - 5 - maxSizeWidth, y,
                    { lineBreak: false, align: 'right', width: maxSizeWidth });
                // TODO somehow fix code duplication.
                const nx1 = x + 2 * 5 + maxCodeWidth;
                const nx2 = paper.WIDTH - paper.MARGIN - 2 * 5 - maxSizeWidth;
                const nameWidth = nx2 - nx1;
                const nameOptions = {
                    lineBreak: true,
                    lineGap: 0.1 * fontSize,
                    width: nameWidth
                };
                const nameHeight = doc.heightOfString(item.listName, nameOptions);
                doc.text(item.listName, nx1, y, nameOptions);
                if (item.production) {
                    doc.font(font.BOLD);
                    doc.fillColor('#cc0000');
                    doc.text('T', paper.WIDTH - paper.MARGIN + 3, y, { lineBreak: false });
                    doc.font(font.NORMAL);
                    doc.fillColor('#000000');
                }
                if (item.marker) {
                    doc.font(font.BOLD);
                    doc.fillColor('#00cc00');
                    doc.text(item.marker, paper.WIDTH - paper.MARGIN + 10, y, { lineBreak: false });
                    doc.font(font.NORMAL);
                    doc.fillColor('#000000');
                }
                y += Math.max(fontSize * 1.2, nameHeight);
            }            
        });
        return y;
    }
};

const sortItems = (items) => {
    return items.sort((i1, i2) => {
        return i1.name === i2.name ? 0 : (i1.name < i2.name ? -1 : 1);
    });
};
