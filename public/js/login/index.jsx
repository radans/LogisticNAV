const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/login');
const api = require('../common/api');

const LoginForm = FormHoc((props) => {
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
                name='email'
                id='login-email'
                error={errors.email}
                value={values.email}
                label='E-post'
                placeholder='Astel EST'
                onChange={inputChange}/>
            <TextInput
                name='password'
                id='login-password'
                error={errors.password}
                value={values.password}
                type='password'
                label='Parool'
                placeholder='parool'
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='sign-in'
                    label='Sisene'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/register'
                    icon='lock'
                    label='Registreeru'/>
                &nbsp;<Button
                    href='/password'
                    icon='lock'
                    label='Uus parool'/>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const submit = (values) => {
    const url = '/api/auth/check';
    return api.save(url, values);
};

const success = () => {
    const match = window.location.href.toString().match(/url=([^&]+)$/);
    if (match) {
        window.location = decodeURIComponent(match[1]);
    } else {
        window.location = '/orders';
    }
};

const initial = {
    email: '',
    password: ''
};

ReactDOM.render(
    <LoginForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('login-form-root'));
