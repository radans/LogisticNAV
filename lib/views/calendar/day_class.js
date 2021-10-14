module.exports = (date, today, extra) => {
    const classes = [];
    if (extra) {
        if (typeof extra === 'string') {
            classes.push(extra);
        } else {
            for (const c of extra) {
                classes.push(c);
            }
        }        
    }
    if (date === today) {
        classes.push('vt-today');
    }
    return classes.length > 0 ? classes.join(' ') : null;
};
