const noCache = require('./no_cache');
const AppError = require('../app_error');
const ValidationError = require('../validation/validation_error');

// Helper to work with async API functions in Express.

module.exports = (fn) => {
    return (req, res) => {
        Promise.resolve().then(() => {
            return fn(req, res);
        }).then((data) => {
            sendSuccess(res, data);
        }).catch((err) => {
            sendError(res, err);
            if (!(err instanceof AppError)) {
                // Only log errors that are not
                // expected to be handled elsewhere.
                logError(err);
            }
        });
    };
};

// Sends success response.

const sendSuccess = (res, data) => {
    noCache(res);
    res.send({
        status: 'success',
        data: data
    });
};

// Sends error response.

const sendError = (res, err) => {
    const message = err.message ? err.message : 'Unknown error';
    const obj = {
        status: 'error',
        message: err.message,
        code: err.code
    };
    if (err instanceof ValidationError) {
        // Extract as validation errors.
        obj.errors = err.errors.extract();
    }
    noCache(res);
    res.send(obj);
};

// Logs error response.

const logError = (err) => {
    process.stderr.write('API call error.' + '\n');
    if (err.stack) {
        process.stderr.write(err.stack + '\n');
    } else {
        process.stderr.write(err + '\n');
    }
};
