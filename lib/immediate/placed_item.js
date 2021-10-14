const assert = require('assert');
const paper = require('./paper');

module.exports = class PlacedItem {

    constructor(data, sheet) {
        assert.equal(typeof data.id, 'string');
        assert.equal(typeof data.left, 'number');
        assert.equal(typeof data.top, 'number');
        assert.equal(typeof data.package, 'string');
        assert.equal(typeof data.main, 'boolean');
        assert.ok(data.peer === null || typeof data.peer === 'string');
        assert.equal(typeof sheet, 'object');
        this.id = data.id;
        this.left = data.left;
        this.top = data.top;
        this.package = data.package;
        this.main = data.main;
        this.sheet = sheet;
    }

    // top - top of side's inner area.
    // labels - list of functions to create labels.
    draw(doc, top, labels) {
        const pack = this.packageRef;
        const x = paper.MARGIN + this.left * this.sheet.widthFactor;
        const y = top + this.top * this.sheet.heightFactor;
        const dims = pack.dimensions;
        const w = dims.width * this.sheet.widthFactor - 1;
        const h = dims.height * this.sheet.heightFactor;
        const vertical = h > w;
        paper.draw(doc, (doc) => {
            if (this.main) {
                doc.rect(x, y, w, h).stroke('#000000');
            } else {
                doc.rect(x, y, w, h).fillAndStroke('#eeeeee', '#000000');
            }
        });
        paper.draw(doc, (doc) => {
            if (h > 20 && w > 20) {
                doc.fontSize(paper.NAME_TEXT_SIZE);
                if (this.sheet.useOrder) {
                    doc.text(`#${pack.client.order}`, x + 3, y + 2, { lineBreak: false });
                }
                if (pack.name) {                    
                    if (vertical) {
                        const tx = x + 12;
                        const ty = y + 16;                  
                        doc.rotate(90, { origin: [tx, ty] });
                        doc.rect(tx - 2, ty - 2, h - 18, 20).clip();
                        doc.text(pack.name, tx, ty, { lineBreak: false });
                    } else {                    
                        const tx = x + 3;
                        const ty = y + h - 12;
                        doc.rect(x, y + h - 20, w - 6, 20).clip();
                        doc.text(pack.name, tx, ty, { lineBreak: false });
                    }
                } 
            }
        });
        labels.push(() => {
            if (pack.code) {
                doc.fontSize(paper.TEXT_SIZE);
                const textWidth = doc.widthOfString(pack.code);
                const my = y + h / 2;
                const mx = x + w / 2;
                const bgHeight = paper.TEXT_SIZE + 8;
                const bgWidth = textWidth + 12;
                const bgX = mx - Math.floor(bgWidth / 2);
                const bgY = my - Math.floor(bgHeight / 2);
                const tx = mx - textWidth / 2;
                if (vertical) {
                    doc.rotate(90, { origin: [mx, my] });
                }
                doc.roundedRect(bgX, bgY, bgWidth, bgHeight, 6)
                    .fillAndStroke(pack.color, pack.color);                
                doc.fillColor('#000000');
                doc.text(pack.code, tx, my - paper.TEXT_SIZE / 2, { lineBreak: false });
            }
        });
    }
};
