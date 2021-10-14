// Helper to generate random string ids.

const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

module.exports = function() {
    var id = '';
    for (var i = 0; i < 16; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
};
