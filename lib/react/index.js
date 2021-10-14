const engine = require('./engine');
const path = require('path');
const React = require('react');

// Set up EJS templating engine.

module.exports = (app) => {
    app.engine('jsx', engine(app));
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jsx');
    // This makes views cleaner as we do not have to
    // require React in every view file.
    global.React = React;
};
