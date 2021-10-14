const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const jsonScript = require('../common/json_script');
const Errors = require('../../../lib/validation/errors');
const api = require('../common/api');

const LogoForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setFileRef = this.setFileRef.bind(this);
        this.fileRef = null;
    }

    submit(e) {
        this.props.submit(e, this.fileRef.files[0]);
    }

    setFileRef(dom) {
        this.fileRef = dom;
    }    

    render() {
        const {
            meta,    
            error,
            errors,
            values,
            loading,
            inputChange
        } = this.props;
        const initial = meta.initial;
        return (
            <form className='vt-form' onSubmit={this.submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                {initial === null &&
                    <div className='alert alert-warning'>
                        Ühtegi faili pole seni üles laetud.
                    </div>
                }
                {initial !== null &&
                    <div className='vt-settings-image'>
                        <img src='/settings/file/logo' alt='Logo fail'/>
                    </div>
                }
                <TextInput
                    name='logo'
                    type='file'
                    id='settings-logo'
                    error={errors.logo}
                    label='Logo'
                    inputRef={this.setFileRef}/>
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
    }
});

const submit = async (values, meta, file) => {
    if (file) {
        const data = new FormData();
        data.append('file', file);
        const url = '/api/settings/logo';
        return api.updateFile(url, data);
    }
};

const validate = (values, file) => {
    const errors = new Errors();
    if (file) {
        if (!file.name.match(/\.png$/)) {
            errors.add('logo', 'Palun kasuta PNG faili.');
        }
    } else {
        errors.add('logo', 'Fail on jäänud valimata.');
    }
    return errors;
};

const success = () => {
    window.scheduleFlash('Uus logo on salvestatud.');
    window.location = '/settings';
};

const data = jsonScript.load('data-form');
const meta = { initial: data.logo };

ReactDOM.render(
    <LogoForm
        meta={meta}
        submit={submit}
        success={success}
        validate={validate}/>,
    document.getElementById('logo-form-root'));
