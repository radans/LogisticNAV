module.exports = (key, value) => {
    return typeof value === 'string' ? value.trim().replace(/ +/g, ' ') : value;
};
