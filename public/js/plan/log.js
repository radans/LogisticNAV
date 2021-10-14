exports.debug = (message) => {
    if (window.location.host === '' || window.location.host.match(/^localhost:/)) {
        console.log('DEBUG: ' + message);
    }    
};
