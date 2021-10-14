const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/register');
const api = require('../common/api');

const RegisterForm = FormHoc((props) => {
    if (props.values.sent) {
        return (
            <div className='alert alert-success'>
                Registreerimise link on saadetud.
            </div>
        );
    }
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
                placeholder='mina@lasita.ee'                
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='send'
                    label='Saada link'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/'
                    icon='lock'
                    label='Tagasi'/>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const submit = (values) => {
    const url = '/api/auth/register';
    return api.save(url, values);
};

const success = (values, data, form) => {
    form.setState((prevState) => {
        return { values: Object.assign({}, prevState, { sent: true }) };
    });
};

const initial = { email: '' };

ReactDOM.render(
    <RegisterForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('register-form-root'));
