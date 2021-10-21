const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/user_settings');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

const UserSettingsForm = FormHoc((props) => {
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
                id='settings-name'
                value={values.name}
                error={errors.name}
                label='Nimi'
                placeholder='Nimi'
                onChange={inputChange}/>
            <TextInput
                name='phone'
                id='settings-phone'
                value={values.phone}
                error={errors.phone}
                label='Telefoninumber'
                placeholder='Telefoninumber'                
                onChange={inputChange}/>
            <TextInput
                name='order_email'
                id='settings-order-email'
                value={values.order_email}
                error={errors.order_email}
                label='Tellimuse e-post'
                placeholder='Tellimuse e-post'
                onChange={inputChange}/>
            <Checkbox
                name='help'
                id='settings-help'
                label='Kuva abiteateid'
                checked={values.help}
                onChange={inputChange}/>
            <Checkbox
                name='receive_plan_mails'
                id='settings-receive_plan_mails'
                label='Saan plaani meile'
                checked={values.receive_plan_mails}
                onChange={inputChange}/>
            <Checkbox
                name='order_mail_copy'
                id='settings-order_mail_copy'
                label='Saan tellimuse meili koopia'
                checked={values.order_mail_copy}
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='save'
                    label='Salvesta'
                    disabled={loading}/>
                <span> <Button
                    href='/settings'
                    icon='window-close-o'
                    label='Loobu'/></span>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const initial = jsonScript.load('data-form');

initial.name = initial.name || '';
initial.phone = initial.phone || '';
initial.order_email = initial.order_email || '';

const submit = async (values) => {
    const url = '/api/settings/user';
    return api.update(url, values);
};

const success = () => {
    window.scheduleFlash('Kasutaja andmed on salvestatud.');
    window.location = '/settings';
};

ReactDOM.render(
    <UserSettingsForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('user-settings-form-root'));
