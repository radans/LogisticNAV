exports.pixelValue = function(observable) {
    return ko.pureComputed(function() {
        return observable() + 'px';
    });
};
