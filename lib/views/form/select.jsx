const FormGroup = require('./group.jsx');

module.exports = (props) => {
    const options = props.options;
    const error = props.error;
    return (
        <FormGroup size={props.size} error={error}>
            <label htmlFor={props.id}>{props.label}</label>
            <select
                className='form-control'
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                defaultValue={props.defaultValue}>
                {options.map((option) =>
                    <option
                        key={`option-${option.value}`}
                        value={option.value}>{option.label}</option>)}
            </select>
            {error && <span className='help-block'>{error}</span>}
        </FormGroup>
    );
};
