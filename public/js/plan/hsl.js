// From http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c

exports.toRgbString = function(h, s, l) {
    var array = exports.toRgb(h, s, l);
    return '#' + array.map(function(value) {
        var high = Math.floor(value / 16);
        var low = value % 16;
        return high.toString(16) + low.toString(16);
    }).join('');
};

exports.toRgb = function(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
};

function hue2rgb(p, q, t) {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}
