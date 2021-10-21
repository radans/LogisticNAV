module.exports = (props) => {
    return (
        <div className='checkbox' style={props.style}>
            <label>
                <input
                    type='checkbox'
                    name={props.name}
                    checked={props.checked}
                    onChange={props.onChange}
                    defaultChecked={props.defaultChecked}
                    value={props.value}/> {props.label}</label>
        </div>
    );
};
