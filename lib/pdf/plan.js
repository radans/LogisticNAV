const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stable = require('stable');
const concat = require('concat-stream');
const font = require('./font');
const FONT_SIZE = 12;

const options = {
    bufferPages: true,
    margins: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    size: 'A4',
    layout : 'landscape'
};

module.exports = (plan) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument(options);
        const piped = doc.pipe(concat((buffer) => {
            resolve(buffer);
        }));
        font.register(doc);
        doc.info.Title = plan.name;
        doc.info.Author = 'AS Lasita';
        doc.fontSize(FONT_SIZE);
        doc.font(font.NORMAL);
        doc.lineWidth(0.5);
        plan.draw(doc);
        doc.flushPages();
        doc.end();
        piped.on('error', (err) => { reject(err); });
    });
};
