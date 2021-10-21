const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Textarea = require('../../../lib/views/form/textarea.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/main_settings');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

const MainSettingsForm = FormHoc((props) => {
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
                name='loading_upper'
                id='settings-upper'
                value={values.loading_upper}
                error={errors.loading_upper}
                label='Ülemine versiooninumber'
                placeholder='Ülemine versiooninumber'
                onChange={inputChange}/>
            <TextInput
                name='loading_bottom'
                id='settings-bottom'
                value={values.loading_bottom}
                error={errors.loading_bottom}
                label='Alumine versiooninumber'
                placeholder='Alumine versiooninumber'
                onChange={inputChange}/>
            <Textarea
                name='loading_contacts'
                id='settings-contact'
                label='Kontaktandmed'
                rows='10'
                placeholder='Kontaktandmed'
                value={values.loading_contacts}
                error={errors.loading_contacts}
                onChange={inputChange}/>
            <FormGroup>
                <Submit
                    icon='save'
                    label='Salvesta'
                    disabled={loading}/>
                &nbsp;<Button
                    href='/settings'
                    icon='window-close-o'
                    label='Loobu'/>
                {loading &&
                    <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
            </FormGroup>
        </form>
    );
});

const initial = jsonScript.load('data-form');

const submit = async (values) => {
    const url = '/api/settings/main';
    return api.update(url, values);
};

const success = () => {
    window.scheduleFlash('Põhiandmed on salvestatud.');
    window.location = '/settings';
};

ReactDOM.render(
    <MainSettingsForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>,
    document.getElementById('main-form-root'));
