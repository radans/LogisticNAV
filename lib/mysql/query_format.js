// Custom bound parameters.
// :something for values and ?something for identifiers.
// https://github.com/mysqljs/mysql#custom-format

const DIRECTIONS = ['ASC', 'DESC'];

module.exports = function(query, values) {
    if (!values) {
        return query;
    }
    const formatted = query.replace(/\:(\w+)/g, (txt, key) => {
        // Bound values.
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        } else {
            throw new Error('No value parameter ' + key + ' supplied to MySQL query.');
        }
        return txt;
    }).replace(/\?(\w+)/g, (txt, key) => {
        // Bound identifiers.
        if (values.hasOwnProperty(key)) {
            return this.escapeId(values[key]);
        } else {
            throw new Error('No identifier parameter ' + key + ' supplied to MySQL query.');
        }
        return txt;
    });
    // Sorting direction
    if (formatted.indexOf('ORDER_DIRECTION') && values.ORDER_DIRECTION) {
        if (DIRECTIONS.indexOf(values.ORDER_DIRECTION) < 0) {
            throw new Error('ORDER_DIRECTION can only be ASC or DESC.');
        }
        return formatted.replace('ORDER_DIRECTION', values.ORDER_DIRECTION);
    } else {
        return formatted;
    }
};
