const FormGroup = require('./group.jsx');

let idValue = 1;

module.exports = (props) => {
    const type = props.type || 'text';
    const error = props.error;
    const id = props.id || `_text-${(idValue++)}`;
    const inputClass = props.inputClass;
    const inputClasses = ['form-control'];
    const group = typeof props.group === 'undefined' ? true : props.group;
    if (inputClass) {
        inputClasses.push(inputClass);
    }
    const input = () => (
        <input
            type={type}
            className={inputClasses.join(' ')}
            id={id}
            name={props.name}
            value={props.value}
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            onChange={props.onChange}
            ref={props.inputRef}
            multiple={props.multiple}/>);
    if (!group) {
        return input();
    }
    return (
        <FormGroup size={props.size} error={error}>
            {props.label &&
                <label htmlFor={id}>{props.label}</label>}
                {input()}
            {error && <span className='help-block'>{error}</span>}
        </FormGroup>
    );
};
