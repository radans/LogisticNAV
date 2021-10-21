const path = require('path');
const assert = require('assert');

// Returns configuration for the given bundle.

module.exports = (name) => {
    assert.equal(typeof name, 'string');
    const entryFile = (name === 'plan' || name === 'common') ? 'index.js' : 'index.jsx';
    return {
        entry: path.join(__dirname, '..', 'public', 'js', name, entryFile),
        output: {
            path: path.resolve(__dirname, '..', 'public', 'js'),
            filename: `${name}.bundle.js`
        },
        module: {
            rules: [
                {
                    test: /\.jsx$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader'
                }
            ]
        }
    };
};
