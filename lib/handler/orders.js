const fs = require('fs');
const os = require('os');
const path = require('path');
const util = require('util');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const json = require('../middleware/json');
const wrap = require('../express/wrap');
const api = require('../express/api');
const companiesService = require('../service/companies');
const ordersService = require('../service/orders');
const plansService = require('../service/plans');
const salespeopleService = require('../service/salespeople');
const validate = require('../validation/order');
const ValidationError = require('../validation/validation_error');
const Paginator = require('../paginator');
const formdata = require('../formdata');
const Day = require('../day');

const writeFile = util.promisify(fs.writeFile);

const SEARCH_LIKE = [
    'company',
    'name',
    'country',
    'notes',
    'vehicle'
];

const searchHandler = (name, value) => {
    if (value === null) {
        return null;
    }
    if (SEARCH_LIKE.indexOf(name) >= 0) {
        return `%${value}%`;
    }
    return value;
};

const paginator = (query) => {
    return new Paginator(query, {
        order: 'id',
        direction: 'DESC',
        defaultSearch: {
            number: null,
            company: null,
            name: null,
            country: null,
            notes: null,
            uncommitted: null,
            tomorrow: null,
            today: null,
            cancelled: null,
            vehicle: null,
            salesperson_id: null,
            import: null
        },
        additionalParams: {
            date_today: Day.today(),
            date_tomorrow: Day.tomorrow()
        },
        searchHandler
    });
};

module.exports = (app) => {

    app.get('/orders', wrap(async (req, res) => {
        const results = await ordersService.list(
            paginator(req.query));
        const salespeople = await salespeopleService.all();
        res.render('orders/orders', {
            heading: 'Tellimused',
            paginator: results.paginator,
            list: results.rows,
            salespeople: salespeople,
            pageScript: 'orders.bundle.js',
            menu: 'orders'
        });
    }));

    app.get('/orders/new', wrap(async (req, res) => {
        const companies = await companiesService.listIdName();
        const loadings = await ordersService.dayLoadings(Day.today());
        const planId = parseInt(req.query.plan, 10);
        let plan = null;
        if (!isNaN(planId)) {
            plan = await plansService.byId(planId);
        }
        res.render('orders/new', {
            heading: 'Uus tellimus',
            pageScript: 'order.bundle.js',
            companies: companies,
            menu: 'orders',
            loadings: loadings,
            plan: plan ? {
                id: plan.id,
                name: plan.name
            } : null
        });
    }));

    app.get('/orders/:id', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const order = await ordersService.byId(id);
        const documents = await ordersService.documents(id);
        res.render('orders/order', {
            id,
            order,
            documents,
            heading: order.order_name,
            pageScript: [
                'libs/photoswipe.min.js',
                'libs/photoswipe-ui-default.min.js',
                'order_view.bundle.js'
            ],
            pageStyle: [
                'photoswipe/photoswipe.css',
                'photoswipe/default-skin.css'
            ],
            menu: 'orders'
        });
    }));

    app.get('/orders/:id/pdf', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const buffer = await ordersService.orderPdf(id);
        res.contentType('application/pdf');
        res.send(buffer);
    }));

    app.get('/orders/:id/modify', wrap(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const order = await ordersService.byId(id);
        const companies = await companiesService.listIdName();
        const plans = await plansService.forSelector(order.plan_id);
        const loadings = await ordersService.dayLoadings(order.loading_date);
        res.render('orders/modify', {
            order,
            heading: order.name,
            pageScript: 'order.bundle.js',
            companies: companies,
            plans: plans,
            menu: 'orders',
            loadings: loadings.filter(loading => loading.order_id !== id)
        });
    }));

    app.get('/order/copy/:id', wrap(async (req, res) => {
        const today = Day.today();
        const id = parseInt(req.params.id, 10);
        const order = await ordersService.byId(id);
        const companies = await companiesService.listIdName();
        const loadings = await ordersService.dayLoadings(today);
        order.id = null;
        order.plan_id = null;
        order.loading_date = today;
        order.vehicle = null;
        res.render('orders/modify', {
            order,
            heading: order.name,
            pageScript: 'order.bundle.js',
            companies: companies,
            menu: 'orders',
            loadings: loadings
        });
    }));

    const SENDFILE_OPTIONS = {};

    if (process.env.NODE_ENV === 'production') {
        SENDFILE_OPTIONS.maxAge = '30d';
        SENDFILE_OPTIONS.immutable = true;
    }

    // TODO reduce code duplication.

    app.get('/order/photo/:id/full.jpg', wrap(async (req, res) => {
        const photoId = parseInt(req.params.id, 10);
        const photoData = await ordersService.photoData(photoId);
        const orderId = photoData.order_id;
        const generatedId = photoData.generated_id;
        const filename = path.join(__dirname, '..', '..',
            'data', 'photos', orderId.toString(), `${generatedId}.jpg`);
        res.sendFile(filename, SENDFILE_OPTIONS);
    }));

    app.get('/order/photo/:id/th.jpg', wrap(async (req, res) => {
        const photoId = parseInt(req.params.id, 10);
        const photoData = await ordersService.photoData(photoId);
        const orderId = photoData.order_id;
        const generatedId = photoData.generated_id;
        const filename = path.join(__dirname, '..', '..',
            'data', 'photos', orderId.toString(), `${generatedId}.th.jpg`);
        res.sendFile(filename, SENDFILE_OPTIONS);
    }));

    app.delete('/api/order/photo/:id', api(async (req, res) => {
        const photoId = parseInt(req.params.id, 10);
        await ordersService.removePhoto(photoId);
    }));

    app.get('/api/order/camera-app', api(async (req, res) => {
        return ordersService.cameraOrders();
    }));

    app.post('/api/order/new', json(), api(async (req, res) => {
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        data.author_id = req.user.id;
        console.trace('data', data);
        return ordersService.save(data);
    }));

    app.post('/api/order/send/:id', api(async (req, res) => {
        const orderId = req.params.id;
        return ordersService.send(req.user, orderId);
    }));

    app.put('/api/order/update/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        const errors = validate(data);
        if (errors.hasError()) {
            throw new ValidationError(errors);
        }
        data.author_id = req.user.id;
        // console.trace('data', data);
        return ordersService.update(id, data);
    }));

    app.post('/api/order/camera-app/:id/:generatedId', bodyParser.raw({limit: '200mb'}),
        api(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const generatedId = req.params.generatedId;
            const base64 = req.body.toString('ascii');
            const buffer = Buffer.from(base64, 'base64');
            const location = path.join(os.tmpdir(), uuid.v4());
            await writeFile(location, buffer);
            await ordersService.saveUploadedPhotos(id, [location], [generatedId]);
        }));

    app.put('/api/order/camera/upload/:id', api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = await formdata.create(req);
        await ordersService.saveUploadedPhotos(id,
            data.files.files.map(file => file.tmp));
    }));

    app.put('/api/order/update-vehicle-invoice/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = {
            vehicle: req.body.vehicle,
            invoice: req.body.invoice,
            planId: parseInt(req.body.plan_id, 10),
            salespersonId: parseInt(req.body.salesperson_id, 10),
            unload_date: req.body.unload_date
        };
        if (data.planId === 0 || Number.isNaN(data.planId)) {
            data.planId = null;
        }
        if (data.salespersonId === 0 || Number.isNaN(data.salespersonId)) {
            data.salespersonId = null;
        }
        return ordersService.updateVehicleAndInvoice(id, data);
    }));

    app.put('/api/order/update-vehicle/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = {vehicle: req.body.vehicle, unload_date: req.body.unload_date};
        return ordersService.updateVehicle(id, data);
    }));

    app.get('/api/loadings/:date', api(async (req, res) => {
        const id = parseInt(req.query.id, 10);
        const loadings = await ordersService.dayLoadings(req.params.date);
        return isNaN(id) ? loadings : loadings.filter(loading => loading.order_id !== id);
    }));

    app.put('/api/order/update-cancel/:id', json(), api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = req.body;
        return ordersService.updateCancel(id, data);
    }));

    app.get('/api/order/for-selector/:planId', api(async (req, res) => {
        const planId = parseInt(req.params.planId, 10);
        return ordersService.forSelector(planId);
    }));

    app.put('/api/order/upload-documents/:id', api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const data = await formdata.create(req);
        const newFiles = [];
        const comments = [];
        if (data.files.files) {
            data.files.files.forEach((file, i) => {
                newFiles.push({file, comment: data.data[`comment-${i}`] || ''});
            });
        }
        for (const key of Object.keys(data.data)) {
            const match = key.match(/^existing-file-comment-(\d+)$/);
            if (match) {
                comments.push({
                    document_id: parseInt(match[1], 10),
                    comment: data.data[key]
                });
            }
        }
        await ordersService.saveDocuments(id, newFiles, comments);
    }));

    app.get('/api/order/upload-documents/:id', api(async (req, res) => {
        const id = parseInt(req.params.id, 10);
        return ordersService.documents(id);
    }));

    app.get('/order/documents/:id', wrap(async (req, res) => {
        const documentId = parseInt(req.params.id, 10);
        const documentData = await ordersService.document(documentId);
        const orderId = documentData.order_id;
        const generatedId = documentData.generated_id;
        const extension = path.extname(documentData.original_name);
        const filename = path.join(__dirname, '..', '..',
            'data', 'documents', orderId.toString(), `${generatedId}${extension}`);
        res.sendFile(filename, SENDFILE_OPTIONS);
    }));

    app.delete('/api/order/document/:id', api(async (req, res) => {
        const documentId = parseInt(req.params.id, 10);
        await ordersService.removeDocument(documentId);
    }));
};
