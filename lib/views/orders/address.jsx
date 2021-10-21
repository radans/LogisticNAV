const addressParser = require('../../address');

module.exports = ({address}) => {
    if (!address) {
        return <span></span>;
    }
    const tokens = addressParser.parse(address);
    return (
        <span>{tokens.map((token, i) => {
            if (typeof token === 'string') {
                return <span key={i}>{token}</span>;
            } else if (token.name === 'time') {
                return <span key={i} className='vt-loading-time'>{token.text}</span>;
            } else {
                return <span key={i} className='vt-loading-coords'>{token.text}</span>;
            }
        })}</span>
    );
};
