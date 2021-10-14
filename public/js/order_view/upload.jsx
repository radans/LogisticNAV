const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const jsonScript = require('../common/json_script');
const Errors = require('../../../lib/validation/errors');
const api = require('../common/api');

const UploadForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setFileRef = this.setFileRef.bind(this);
        this.fileRef = null;
    }

    submit(e) {
        this.props.submit(e, this.fileRef.files);
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
            <form className='vt-form-full' onSubmit={this.submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <TextInput
                    name='logo'
                    type='file'
                    label='Pildid'
                    id='settings-logo'
                    error={errors.files}                    
                    inputRef={this.setFileRef}
                    multiple={true}/>
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Lae üles'
                        disabled={loading}/>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );
    }
});

const submit = async (values, meta, files) => {
    if (files.length > 0) {
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
        const url = `/api/order/camera/upload/${meta.id}`;
        return api.updateFile(url, data);
    }
};

const validate = (values, files) => {
    const errors = new Errors();
    if (files.length > 0) {
        let badFile = false;
        for (const file of files) {
            if (!file.name.match(/\.(jpg|JPG|jpeg|JPEG)$/)) {
                badFile = true;
            }
        }
        if (badFile) {
            errors.add('files', 'Palun kasuta JPG faile.');
        }
    } else {
        errors.add('files', 'Failid on jäänud valimata.');
    }
    return errors;
};

const success = () => {
    window.scheduleFlash('Pildid on üles laetud.');
    window.location.reload();
};

exports.init = () => {
    const data = jsonScript.load('order-data');
    const meta = { id: data.id };
    ReactDOM.render(
        <UploadForm
            meta={meta}    
            submit={submit}
            success={success}
            validate={validate}/>,
        document.getElementById('upload-form-root'));
};
