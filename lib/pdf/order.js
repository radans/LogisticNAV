const fs = require('fs');
const path = require('path');
const util = require('util');
const PDFDocument = require('pdfkit');
const concat = require('concat-stream');
const address = require('../address');
const dateString = require('../date_string');
const day = require('../day');
const font = require('./font');

const readFile = util.promisify(fs.readFile);

const FILE_LOGO = path.join(__dirname, '..', '..', 'data', 'logo.png');

const LEFT = 72;
const LINE_STEP = 14;
const FONT_SIZE = 12;
const TABLE_LEFT = 200;

const options = {
    bufferPages: true,
    margins: {
        top: 40,
        left: 72,
        bottom: 72,
        right: 72
    },
    size: 'A4',
    layout: 'portrait'
};

module.exports = async (order, settings) => {
    const logoImage = await readFile(FILE_LOGO);
    return render(order, logoImage, settings);
};

const render = (order, logoImage, settings) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument(options);
        const piped = doc.pipe(concat((buffer) => {
            resolve(buffer);
        }));
        font.register(doc);
        doc.info.Title = order.name;
        doc.info.Author = 'AS Lasita';
        doc.fontSize(FONT_SIZE);
        doc.font(font.NORMAL);
        logo(doc, logoImage);
        versionMark1(doc, settings);
        contact(doc, settings);
        receiver(doc, order);
        sender(doc, order);
        title(doc, order);
        doc.fontSize(FONT_SIZE);
        product(doc);
        onload(doc, order);
        unload(doc, order);
        vehicle(doc, order);
        price(doc, order);
        paymentTerms(doc, order);
        standardInfo(doc);
        textBelow(doc, order);
        info(doc, order);
        signature(doc, order);
        footerVersionMark(doc, settings);
        cancelled(doc, order);
        doc.flushPages();
        doc.end();
        piped.on('error', (err) => { reject(err); });
    });
};

const logo = (doc, logoImage) => {
    const logoWidth = 120;
    const left = doc.page.width - doc.page.margins.right - logoWidth;
    doc.image(logoImage, left, doc.page.margins.top, {
        width: logoWidth
    });
    doc.moveDown(0.2);
};

const versionMark1 = (doc, settings) => {
    const width = 150;
    const left = doc.page.width - doc.page.margins.right - width;
    doc.fontSize(10);
    doc.font(font.BOLD);
    doc.text(settings.loading_upper, left, null, {
        width: width,
        align: 'right'
    });
    doc.moveDown(0.5);
};

const contact = (doc, settings) => {
    doc.fontSize(10);
    doc.font(font.NORMAL);
    const contactWidth = 150;
    const left = doc.page.width - doc.page.margins.right - contactWidth;
    doc.fillColor('#357261');
    const text = settings.loading_contacts;
    doc.text(text, left, null, {
        align: 'right'
    });
    doc.fillColor('#000000');
    doc.moveDown(1);
};

const receiver = (doc, order) => {
    if (order.company_id) {
        doc.fontSize(FONT_SIZE);
        doc.font(font.NORMAL);
        const left = doc.page.margins.left;
        doc.text('Kellele:', left);
        doc.moveUp(1);
        doc.text(order.contact, left + 50);
        doc.text('Firma:', left);
        doc.moveUp(1);
        doc.text(order.company_name, left + 50);
        doc.text('E-mail:', left);
        doc.moveUp(1);
        doc.text(order.email, left + 50);
        doc.moveUp(3);
    }
};

const sender = (doc, order) => {
    doc.fontSize(FONT_SIZE);
    doc.font(font.NORMAL);
    const left = 300;
    doc.text('Kellelt:', left);
    doc.moveUp(1);
    doc.text(order.author_name, left + 50);
    doc.text('Tellija:', left);
    doc.moveUp(1);
    doc.text('Rakvere Metsamajand', left + 50);
    doc.text('Kuupäev:', left);
    doc.moveUp(1);
    const formatted = day.formatDate(order.created_at);
    doc.text(formatted, left + 50);
    doc.moveDown(1);
};

const title = (doc, order) => {
    doc.font(font.BOLD);
    doc.fontSize(14);   
    doc.text(`TRANSPORDITELLIMUS nr. ${order.id}`,
        doc.page.margins.left);
    doc.font(font.NORMAL);
    doc.moveDown(1);
};

const product = (doc) => {
    doc.font(font.BOLD);
    doc.text('Kaup:', LEFT);
    doc.font(font.NORMAL);
    doc.moveUp(1);
    doc.text('Aiamajad', TABLE_LEFT);
    doc.moveDown(1);
};

const TEXT_COLORS = { location: 'blue', time: 'red' };

const printAddress = (doc, left, place, n, numbers, date) => {
    const parsed = address.parse(place.address);
    if (numbers) {
        doc.font(font.BOLD);
        doc.text(`${n}. `, left);    
        doc.moveUp(1);
        doc.font(font.NORMAL);
        doc.text('', left + 15, null, { continued: true });
    } else {
        doc.text('', left, null, { continued: true });
    }
    if (date) {
        doc.font(font.BOLD);
        doc.text(date + ' ', { continued: true });
        doc.font(font.NORMAL);
    }
    for (let i = 0; i < parsed.length; i++) {
        const token = parsed[i];
        const continued = i < parsed.length - 1;
        if (typeof token === 'string') {
            doc.text(token, { continued });
        } else {
            doc.fillColor(TEXT_COLORS[token.name] || '#000000');
            doc.text(token.text, { continued });
            doc.fillColor('#000000');
        }
    }
};

const onload = (doc, order) => {
    doc.font(font.BOLD);
    const label = order.onload.length === 1 ?
        'Pealelaadimine:' : 'Pealelaadimised:';
    doc.text(label, LEFT);
    doc.font(font.NORMAL);
    doc.moveUp(1);
    const estonianDate = dateString.toEstonian(order.loading_date);
    const numbers = order.onload.length > 1;
    order.onload.map((place, i) => {
        printAddress(doc, TABLE_LEFT, place, i + 1, numbers,
            `${estonianDate} kell ${place.time}`);
    });
    doc.moveDown(1);
};

const unload = (doc, order) => {
    if (order.unload.length > 0) {
        doc.font(font.BOLD);
        const label = order.unload.length === 1 ?
            'Mahalaadimine:' : 'Mahalaadimised:';
        doc.text(label, LEFT);
        doc.font(font.NORMAL);
        doc.moveUp(1);
        const numbers = order.unload.length > 1;
        order.unload.map((place, i) => {
            const estonianDate = place.date ? dateString.toEstonian(place.date) : null;
            let timeString = null;
            if (estonianDate) {
                if (place.time) {
                    timeString = `${estonianDate} ${place.time}`;
                } else {
                    timeString = estonianDate;
                }
            } else {
                if (place.time) {
                    timeString = place.time;
                }
            }
            printAddress(doc, TABLE_LEFT, place, i + 1, numbers, timeString);
        });
        doc.moveDown(1);
    }
};

const vehicle = (doc, order) => {
    doc.font(font.BOLD);
    doc.text('Transpordivahend:', LEFT);
    doc.font(font.NORMAL);
    doc.moveUp(1);
    doc.text('Külgedelt lahtivõetav tent külje kõrgusega 2,7m', TABLE_LEFT);
    doc.moveDown(1);
};

const price = (doc, order) => {
    if (order.price !== null) {
        doc.font(font.BOLD);
        doc.text('Transpordi hind:', LEFT);
        doc.font(font.NORMAL);
        doc.moveUp(1);
        const price = order.price;
        const priceString = price === Math.round(price) ?
            price.toFixed(0) : price.toFixed(2);
        doc.text(`${priceString} EUR`, TABLE_LEFT);
        doc.moveDown(1);
    }
};

const paymentTerms = (doc) => {
    doc.font(font.BOLD);
    doc.text('Maksetähtaeg:', LEFT);
    doc.font(font.NORMAL);
    doc.moveUp(1);
    doc.text('21 päeva CMR\'i ja saatelehe originaali esitamisest', TABLE_LEFT);
    doc.moveDown(1);
};

const standardInfo = (doc) => {
    const standardInfoText = 'Koormarihmade nurgad vajalikud, kauba ümberlaadimine keelatud.' +
    ' Vedaja võtab endale vastutuse kauba säilitamise eest transpordi ajal ning' +
    ' garanteerib kauba õigeaegse sihtkohta jõudmise. Autojuhtidel helkurvesti' +
    ' kandmine peale- ja mahalaadimistel kohustuslik!';
    doc.font(font.BOLD);
    doc.text('Lisainformatsioon:', LEFT);
    doc.font(font.NORMAL);
    doc.moveUp(1);
    doc.text(standardInfoText, TABLE_LEFT);
    doc.moveDown(1);
};

const info = (doc, order) => {
    if (order.info) {
        doc.font(font.BOLD);
        doc.text('Lisainformatsioon:', LEFT);
        doc.font(font.NORMAL);
        doc.moveUp(1);
        doc.text(order.info, TABLE_LEFT);
        doc.moveDown(1);
    }
};

const textBelow = (doc, order) => {
    doc.font(font.BOLD);
    doc.text('Palun kinnitada transporditellimus, millega loeme,' +
        ' et olete aksepteerinud laadimisjuhendit.', LEFT, null, { align: 'justify' });
    doc.moveDown(1);
    doc.moveDown(1);
};

const signature = (doc, order) => {
    const y = doc.y;
    const height = doc.page.height;
    const onSame = y < 7/8 * height;
    doc.font(font.NORMAL);
    if (!onSame) {
        doc.addPage();
    }
    doc.text(`Lugupidamisega,\n${order.author_name}`, LEFT, height - 120);
};

const footerVersionMark = (doc, settings) => {
    const start = 0;
    const pages = doc.bufferedPageRange();
    for (var i = start; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.font(font.NORMAL);
        doc.text(settings.loading_bottom, LEFT, doc.page.height - 60, {
            lineBreak: false
        });
    }
};

const cancelled = (doc, order) => {
    if (order.cancelled) {
        doc.fillColor('#cc0000');
        doc.fontSize(FONT_SIZE * 2);
        doc.font(font.BOLD);
        doc.text('TÜHISTATUD', 100, 100);
    }
};
