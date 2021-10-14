const assert = require('assert');
const paper = require('./paper');
const PlacedItem = require('./placed_item');

module.exports = class Side {

    constructor(data, sheet, driver) {
        assert.ok(Array.isArray(data.items));
        assert.equal(typeof sheet, 'object');
        this.items = data.items.map(item => new PlacedItem(item, sheet));
        this.sheet = sheet;
        this.driver = driver;
    }

    assignPackageRefs(map) {
        for (const item of this.items) {
            const pack = map.get(item.package);
            if (!pack) {
                throw new Error(`Package reference ${item.package} does not exist.`);
            }
            item.packageRef = pack;
        }
    }

    draw(doc, y, labels) {
        paper.draw(doc, (doc) => {
            const height = this.totalHeight().toFixed(2);
            const width = this.totalWidth().toFixed(2);
            const label = this.driver ? `Kõrgus: ${height}m, pikkus: ${width}m, juhipool` :
                `Kõrgus: ${height}m, pikkus: ${width}m, kõrvalistuja pool`;
            doc.fontSize(paper.TEXT_SIZE);
            doc.text(label, paper.MARGIN, y);
            doc.rect(paper.MARGIN - 1, y + paper.TEXT_SIZE + 4,
                paper.SIDE_INNER_WIDTH + 2, paper.SIDE_INNER_HEIGHT + 2).stroke('#999999');
        });
        for (const item of this.items) {
            item.draw(doc, y + paper.TEXT_SIZE + 5, labels);
        }
    }

    findPlacedCount(id) {
        let count = 0;
        for (const item of this.items) {
            if (item.package === id && item.main) {
                count += 1;
            }
        }
        return count;
    }

    totalHeight() {
        let min = 100000;
        for (const item of this.items) {
            if (item.top < min) {
                min = item.top;
            }
        }
        if (min === 100000) {
            return 0;
        }
        return 1.01 * (this.sheet.sideHeight - min) / this.sheet.heightScale;
    }

    totalWidth() {
        let max = 0;
        for (const item of this.items) {
            const right = item.left + item.packageRef.dimensions.width;
            if (right > max) {
                max = right;
            }
        }
        return 1.005 * max / this.sheet.widthScale;
    }
};
