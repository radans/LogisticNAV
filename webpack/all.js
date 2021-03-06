const common = require('./common');
module.exports = [
    'calendar',
    'common',
    'company',
    'loading',
    'login',
    'logo',
    'main_settings',
    'order',
    'order_view',
    'orders',
    'user_settings',
    'users',
    'packages',
    'packages_excel',
    'password',
    'password_confirm',
    'plan',
    'plans',
    'address',
    'addresses',
    'register',
    'register_confirm',
    'salespeople',
    'salesperson',
    'statistics'
].map((name) => common(name));
