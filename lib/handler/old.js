const wrap = require('../express/wrap');

// Shows an informative page for users with a too old browser.

module.exports = (app) => {
    app.get('/old', wrap(async (req, res) => {
        res.render('old', {});
    }));
};
