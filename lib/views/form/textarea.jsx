const FormGroup = require('./group.jsx');

const Textarea = module.exports = (props) => {
    const {
        id,
        name,
        label,
        placeholder,
        onChange,
        rows,
        value,
        error
    } = props;
    const actualRows = rows || '3';
    return (
        <FormGroup error={error}>
            {label && <label htmlFor={id}>{label}</label>}
            <textarea className='form-control' id={id} name={name} rows={actualRows}
                placeholder={placeholder} onChange={onChange} value={value}/>
            {error && <span className='help-block'>{error}</span>}
        </FormGroup>
    );
};
