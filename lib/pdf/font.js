const fs = require('fs');
const path = require('path');

const NORMAL = exports.NORMAL = 'Times New Roman';
const BOLD = exports.BOLD = 'Times New Roman Bold';

const NormalFont = fs.readFileSync(
    path.join(__dirname, '..', '..', 'fonts', 'Times_New_Roman.ttf'));

const BoldFont = fs.readFileSync(
    path.join(__dirname, '..', '..', 'fonts', 'Times_New_Roman_Bold.ttf'));

exports.register = (doc) => {
    doc.registerFont(NORMAL, NormalFont);
    doc.registerFont(BOLD, BoldFont);
};
