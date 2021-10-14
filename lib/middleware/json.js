const bodyParser = require('body-parser');
const jsonReviver = require('../json_reviver');

// Returns configured body-parser JSON
// parsing middleware.
module.exports = () => {
    return bodyParser.json({
        reviver: jsonReviver
    });
};
