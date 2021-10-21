const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/company');
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
                id='company-name'
                error={errors.name}
                value={values.name}
                label='Ettevõtte nimi'
                placeholder='Ettevõtte nimi'
                onChange={inputChange}/>
            <TextInput
                name='contact'
                id='company-contact'
                error={errors.contact}
                value={values.contact}
                label='Kontaktisiku nimi'
                placeholder='Kontaktisiku nimi'
                onChange={inputChange}/>
            <TextInput
                name='email'
                id='company-email'
                error={errors.email}
                value={values.email}
                label='E-post'
                placeholder='E-post'
                onChange={inputChange}/>
            <TextInput
                name='address'
                id='company-address'
                error={errors.address}
                value={values.address}
                label='Aadress'
                placeholder='Aadress'
                onChange={inputChange}/>
            <TextInput
                name='phone'
                id='company-phone'
                error={errors.phone}
                value={values.phone}
                label='Telefoninumber'
                placeholder='Telefoninumber'
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='save'
                    label='Salvesta'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/companies'
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
        const url = `/api/company/update/${encodeURIComponent(values.id)}`;
        return api.update(url, values);
    } else {
        const url = '/api/company/new';
        return api.save(url, values);
    }    
};

const success = () => {
    window.scheduleFlash('Vedaja andmed on salvestatud.');
    window.location = '/companies';
};

const initial = jsonScript.load('data-form') || {
    name: '',    
    email: '',
    phone: '',
    contact: '',
    address: ''
};

ReactDOM.render(
    <CompanyForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('company-form-root'));
