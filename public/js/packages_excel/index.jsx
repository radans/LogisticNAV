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
        return (
            <form className='vt-form' onSubmit={this.submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <TextInput
                    name='file'
                    type='file'
                    id='packages-file'
                    error={errors.file}
                    label='Fail'
                    inputRef={this.setFileRef}/>
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Salvesta'
                        disabled={loading}/>
                    <span> <Button
                        href='/packages'
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
        const url = '/api/packages/update-sheet';
        return api.postFile(url, data);
    }
};

const validate = (values, file) => {
    const errors = new Errors();
    if (file) {
        if (!file.name.match(/\.xlsx$/)) {
            errors.add('file', 'Palun Exceli (xlsx) faili.');
        }
    } else {
        errors.add('file', 'Fail on jäänud valimata.');
    }
    return errors;
};

const success = () => {
    window.scheduleFlash('Pakkide info on uuendatud.');
    window.location = '/packages';
};

ReactDOM.render(
    <LogoForm
        submit={submit}
        success={success}
        validate={validate}/>,
    document.getElementById('package-upload-form-root'));
