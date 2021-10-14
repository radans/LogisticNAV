const usersService = require('../service/users');
const settingsService = require('../service/settings');

// Populates req.user and sets res.locals.

module.exports = () => {
    return async (req, res, next) => {
        const email = req.cookies.get('email', { signed: true });
        if (email) {
            const user = await usersService.byEmail(email);
            if (user && user.active) {
                const countUnset = await settingsService.countUnset();
                res.locals.user = req.user = user;
                res.locals.loggedIn = req.loggedIn = true;
                res.locals.collapsed = user.collapsed;
                res.locals.help = user.help;
                res.locals.unsetSettings = countUnset > 0;
            }
            next();
        } else {
            next();
        }
    };
};
