// Helper middleware to clear/set session.
// Base options for setting cookies.

const options = (customize) => {
    const base = {
        secure: false,
        httpOnly: true,
        overwrite: true
    };
    Object.keys(customize).forEach((key) => {
        base[key] = customize[key];
    });
    return base;
};

module.exports = () => {
    return (req, res, next) => {
        // Sets user email upon login.
        req.setUser = (email) => {
            // Set user id cookie with session scope.
            req.cookies.set('email', email, options({ signed: true }));
        };
        // Clears the user id upon logout.
        req.clearUser = () => {
            // Set cookie value to null to clear it.
            req.cookies.set('email', null, options({ signed: true }));
        };
        next();
    };
};
