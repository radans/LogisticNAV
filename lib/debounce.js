module.exports = (fn, time, runAtEnd = true) => {
    let allow = true;
    let atEnd = null;
    return (...args) => {
        atEnd = args;
        if (allow) {            
            allow = false;
            setTimeout(() => {
                allow = true;
                if (runAtEnd) {
                    fn(...atEnd);
                }                
            }, time);
            fn(...args);
        }
    };
};
