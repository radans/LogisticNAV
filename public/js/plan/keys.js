const keys = {};

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
}, false);

// Returns whether the key is currently pressed down.

exports.isDown = function(keyCode) {
    return !!keys[keyCode];
};
