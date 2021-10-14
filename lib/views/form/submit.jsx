const Icon = require('../common/icon.jsx');

module.exports = (props) => {
    return (
        <button type='submit' className='btn btn-default' disabled={!!props.disabled}>
            {props.icon && <Icon name={props.icon}/>} {props.label}</button>
    );
};
