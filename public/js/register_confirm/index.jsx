const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/register_confirm');
const api = require('../common/api');

const RegisterForm = FormHoc((props) => {
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
                id='register-name'
                value={values.name}
                error={errors.name}
                label='Nimi'
                placeholder='Maris'
                onChange={inputChange}/>
            <TextInput
                name='phone'
                id='register-phone'
                value={values.phone}
                error={errors.phone}
                label='Telefoninumber'
                placeholder='Telefoninumber'                
                onChange={inputChange}/>
            <TextInput
                name='password1'
                type='password'
                id='register-password1'
                value={values.password1}
                error={errors.password1}
                label='Parool'
                onChange={inputChange}/>
            <TextInput
                name='password2'
                type='password'
                id='register-password2'
                value={values.password2}
                error={errors.password2}
                label='Parooli kontroll'
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='save'
                    label='Salvesta'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/login'
                    icon='window-close-o'
                    label='Loobu'/>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const submit = async (values) => {
    const url = `/api/auth/register-confirm/${values.registrationId}`;
    return api.save(url, {
        name: values.name,
        phone: values.phone,
        password1: values.password1,
        password2: values.password2
    });
};

const success = () => {
    window.scheduleFlash('Kasutaja on registreeritud ja sisse logitud.');
    window.location = '/orders';
};

const root = document.getElementById('register-form-root');

const initial = {
    name: '',
    phone: '',
    password1: '',
    password2: '',
    registrationId: root.dataset.id
};

ReactDOM.render(
    <RegisterForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>, root);
