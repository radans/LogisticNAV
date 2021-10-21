// Error that is not reported and is
// expected to be handled on the API
// client/frontend.

module.exports = class AppError extends Error {

    constructor(message) {
        super(message);
    }
};
