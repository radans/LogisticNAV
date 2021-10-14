// Middleware checks that the user is identified
// and redirects to login page when not.

const WHITELIST = [
    '/login',
    '/api/auth/check',
    '/js/react',
    '/api/order/camera',
    '/api/order/camera-app',
    '/register',
    '/api/auth/register',
    '/password',
    '/api/auth/password',
    '/old',
    '/mail/test',
    '/app',
    '/veopildid.apk',
    '/Veopildid.apk'
];

const isWhitelisted = (url) => {
    for (const path of WHITELIST) {
        if (url.indexOf(path) === 0) {
            return true;
        }
    }
    return false;
};

module.exports = (app) => {
    return (req, res, next) => {
        if (!req.user && !isWhitelisted(req.url)) {
            if (req.url === '/') {
                res.redirect(`/login`);
            } else {
                res.redirect(`/login?url=${encodeURIComponent(req.url)}`);
            }            
        } else {
            next();
        }
    };
};
