const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const jsonScript = require('../common/json_script');
const Errors = require('../../../lib/validation/errors');
const api = require('../common/api');

const LANGUAGES = ['et', 'en', 'ru'];

const LoadingForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setEtRef = this.setEtRef.bind(this);
        this.setEnRef = this.setEnRef.bind(this);
        this.setRuRef = this.setRuRef.bind(this);
        this.etRef = null;
        this.enRef = null;
        this.ruRef = null;
    }

    submit(e) {
        const extra = {
            et: this.etRef.files[0],
            en: this.enRef.files[0],
            ru: this.ruRef.files[0]
        };
        this.props.submit(e, extra);
    }

    setEtRef(dom) { this.etRef = dom; }
    setEnRef(dom) { this.enRef = dom; }
    setRuRef(dom) { this.ruRef = dom; }

    render() {
        const {
            meta,    
            error,
            errors,
            values,
            loading
        } = this.props;
        const initial = meta.initial;
        return (
            <form className='vt-form' onSubmit={this.submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                {initial.et === null &&
                    <div className='alert alert-warning'>
                        Eestikeelset juhendit pole veel üles laetud.
                    </div>
                }
                {initial.en === null &&
                    <div className='alert alert-warning'>
                        Inglisekeelset juhendit pole veel üles laetud.
                    </div>
                }
                {initial.ru === null &&
                    <div className='alert alert-warning'>
                        Venekeelset juhendit pole veel üles laetud.
                    </div>
                }
                <FormGroup>
                    <ul>
                        {initial.et !== null &&
                            <li><a href='/settings/file/loading_et'
                                target='_blank'>Praegune eestikeelne juhend</a></li>}
                        {initial.en !== null &&
                            <li><a href='/settings/file/loading_en'
                                target='_blank'>Praegune inglisekeelne juhend</a></li>}
                        {initial.ru !== null &&
                            <li><a href='/settings/file/loading_ru'
                                target='_blank'>Praegune venekeelne juhend</a></li>}
                    </ul>
                </FormGroup>
                <TextInput
                    name='et'
                    type='file'
                    id='settings-et'
                    error={errors.et}
                    label='Eestikeelne juhend'
                    inputRef={this.setEtRef}/>
                <TextInput
                    name='en'
                    type='file'
                    id='settings-en'
                    error={errors.en}
                    label='Inglisekeelne juhend'
                    inputRef={this.setEnRef}/>
                <TextInput
                    name='ru'
                    type='file'
                    id='settings-ru'
                    error={errors.ru}
                    label='Venekeelne juhend'
                    inputRef={this.setRuRef}/>
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
    }
});

const submit = async (values, meta, files) => {
    const data = new FormData();
    let added = false;
    for (const lang of LANGUAGES) {
        if (files[lang]) {
            data.append(lang, files[lang]);
            added = true;
        }
    }
    if (added) {
        const url = '/api/settings/loading';
        return api.updateFile(url, data);
    }
};

const validate = (values, files) => {
    const errors = new Errors();
    for (const lang of LANGUAGES) {
        if (files[lang]) {
            if (!files[lang].name.match(/\.pdf$/)) {
                errors.add(lang, 'Palun kasuta PDF faili.');
            }
        }
    }
    return errors;
};

const success = () => {
    window.scheduleFlash('Laadimisjuhendid on salvestatud.');
    window.location = '/settings';
};

const data = jsonScript.load('data-form');
const meta = {
    initial: {
        et: data.loading_et,
        en: data.loading_en,
        ru: data.loading_ru
    }    
};

ReactDOM.render(
    <LoadingForm
        meta={meta}
        submit={submit}
        success={success}
        validate={validate}/>,
    document.getElementById('loading-form-root'));
