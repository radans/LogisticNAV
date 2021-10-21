// Sets up load-time Babel transforms,
// including the JSX processing.

require('babel-register')({
    plugins: ['transform-react-jsx'],
    extensions: ['.jsx']
});

const fs = require('fs');
const path = require('path');
const http = require('http');
const util = require('util');
const express = require('express');
const config = require('./config');
const log = require('./log');

const app = express();

// Set up templating.
require('./react')(app);

// Defaults for locals.
require('./defaults')(app);

// Generic middleware stack.
require('./middleware')(app);

// Set up route handlers.
require('./handler')(app);

// Set up not-found and error handlers.
require('./error')(app);

const listen = util.promisify((httpServer, cb) =>
    httpServer.listen(config.port, cb));

// Creates HTTP server instance and
// starts to listen to requests.

exports.listen = async () => {
    const httpServer = http.createServer();
    httpServer.on('request', app);
    return listen(httpServer);
};
