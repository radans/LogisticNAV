const React = require('react');
const ReactDOMServer = require('react-dom/server');
const debug = require('debug')('app:engine');

// Returns rendering function that uses require.
// Express instance app is used for clearing the
// module cache in development.

module.exports = (app) => (filepath, props, cb) => {
    try {
        const component = require(filepath);
        cb(null, '<!DOCTYPE html>' + ReactDOMServer.renderToStaticMarkup(
            React.createElement(component, props)));        
    } catch (err) {
        cb(err);
    } finally {
        if (process.env.NODE_ENV !== 'production') {
            // Clears the require cache.
            clearCache(app.get('views'));
        }
    }
};

// Clears the require cache used by the view modules.

const clearCache = (views) => {
    debug(`Clearing the view cache.`);
    Object.keys(require.cache).forEach((module) => {
        if (require.cache[module].filename.startsWith(views)) {
            delete require.cache[module];
        }
    });
};
