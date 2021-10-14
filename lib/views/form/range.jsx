const FormGroup = require('./group.jsx');

let idValue = 1;

module.exports = (props) => {
    const error = props.error;
    const id = props.id || `_range-${(idValue++)}`;
    const inputClass = props.inputClass;
    const inputClasses = ['form-control'];
    const min = props.min || 0;
    const max = props.max || 1;    
    const step = props.step || 0.05;
    if (inputClass) {
        inputClasses.push(inputClass);
    }
    return (
        <FormGroup size={props.size} error={error}>
            <label htmlFor={id}>{props.label}</label>
            <input
                type='range'
                className={inputClasses.join(' ')}
                id={id}
                name={props.name}
                value={props.value}
                defaultValue={props.defaultValue}
                onChange={props.onChange}
                ref={props.inputRef}
                min={min}
                max={max}
                step={step}
                multiple={props.multiple}/>
            {error && <span className='help-block'>{error}</span>}
        </FormGroup>
    );
};
