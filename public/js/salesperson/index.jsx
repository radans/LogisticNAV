const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/salesperson');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

const CompanyForm = FormHoc((props) => {
    const {            
        error,
        errors,
        values,
        submit,
        loading,
        inputChange
    } = props;
    return (
        <form className='vt-form' onSubmit={submit}>
            {error &&
                <FormGroup>
                    <div className='vt-form-error'>{error}</div>
                </FormGroup>}
            <TextInput
                name='name'
                id='salespeople-name'
                error={errors.name}
                value={values.name}
                label='Müügijuhi nimi'
                placeholder='Nimi'
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='save'
                    label='Salvesta'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/salespeople'
                    icon='window-close-o'
                    label='Loobu'/>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const submit = async (values) => {
    if (values.id) {
        const url = `/api/salespeople/${encodeURIComponent(values.id)}`;
        return api.update(url, values);
    } else {
        const url = '/api/salespeople/new';
        return api.save(url, values);
    }
};

const success = () => {
    window.scheduleFlash('Müügijuhi andmed on salvestatud.');
    window.location = '/salespeople';
};

const initial = jsonScript.load('data-form') || {
    name: ''
};

ReactDOM.render(
    <CompanyForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('salesperson-form-root'));
