const wrap = require('../express/wrap');

module.exports = (app) => {
    require('./old')(app);
    require('./auth')(app);
    require('./orders')(app);
    require('./companies')(app);
    require('./settings')(app);
    require('./statistics')(app);
    require('./calendar')(app);
    require('./plans')(app);
    require('./addresses')(app);
    require('./salespeople')(app);
    require('./packages')(app);
    require('./react')(app);
    app.get('/app', wrap(async (req, res) => {
        res.redirect('/Veopildid.apk');
    }));
    app.get('/', wrap(async (req, res) => {
        res.redirect('/login');
    }));
};
