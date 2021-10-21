const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/password_confirm');
const api = require('../common/api');

const PasswordForm = FormHoc((props) => {
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
    const url = `/api/auth/password-confirm/${values.registrationId}`;
    return api.save(url, {
        password1: values.password1,
        password2: values.password2
    });
};

const success = () => {
    window.scheduleFlash('Parool on vahetatud.');
    window.location = '/orders';
};

const root = document.getElementById('password-form-root');

const initial = {
    password1: '',
    password2: '',
    registrationId: root.dataset.id
};

ReactDOM.render(
    <PasswordForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>, root);
