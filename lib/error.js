// General error handler with logging
// and custom message page.

module.exports = (app) => {
    app.use(notFound());
    app.use(error());
};

// Returns function to handle non-found routes.

const notFound = () => {
    return (req, res, next) => {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    };
};

// Returns function to handle all errors.

const error = () => {
    return (err, req, res, next) => {
        if (err.status !== 404 && err.status !== 401) {
            // TODO use log.error.
            process.stderr.write('Page error:\n');
            process.stderr.write(err + '\n');
            if (err.stack) {
                process.stderr.write(err.stack + '\n');
            }
        }
        const status = err.status || 500;
        res.status(status);
        let message;
        if (err.status === 404) {
            message = 'Lehte ei leitud.';
        } else if (err.status === 401) {
            message = 'Juurdepääs puudub. Palun logi sisse.';
        } else {
            message = 'Serveripoolne viga. Palun proovige hiljem uuesti';
        }
        res.render('error', { message: message });
    };
};
