const XLSX = require('xlsx');
const moment = require('moment-timezone');

// Helper to produce Excel spreadsheets.

exports.buffer = (rows, sheetname, widths) => {
    return new Promise((resolve) => {
        const data = XLSX.write(book(rows, sheetname, widths), {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        });
        resolve(new Buffer(data, 'binary'));
    });
};

const book = (rows, sheetname, widths) => {
    const ret = {
        SheetNames: [sheetname],
        Sheets: {}
    };
    ret.Sheets[sheetname] = sheet(rows, widths);
    return ret;
};

const sheet = (rows, widths) => {
    const ws = {};
    let maxRowLength = 0;
    rows.forEach((row, r) => {
        if (row.length > maxRowLength) {
            maxRowLength = row.length;
        }
        row.forEach((item, c) => {
            if (item === null || typeof item === 'undefined') {
                return;
            }
            // Encode location.
            const ref = XLSX.utils.encode_cell({c: c, r: r});
            const cell = { v: item };
            // Assign cell type.
            if (typeof item === 'number') {
                cell.t = 'n';
            } else if (typeof item === 'boolean') {
                cell.t = 'b';
            } else if (item instanceof Date) {
                cell.v = moment(item).tz('Europe/Tallinn').format('DD.MM.YYYY HH:mm:ss');
                cell.t = 's';
            } else {
                cell.t = 's';
            }
            ws[ref] = cell;
        });
    });
    ws['!ref'] = XLSX.utils.encode_range({
        e: { r: rows.length - 1, c: maxRowLength - 1 },
        s: { r: 0, c: 0 }
    });
    if (widths) {
        ws['!cols'] = widths;
    }
    return ws;
};
