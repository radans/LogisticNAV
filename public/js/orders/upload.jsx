const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const jsonScript = require('../common/json_script');
const dateString = require('../../../lib/date_string');
const generateId = require('../common/generate_id');
const api = require('../common/api');

const DocumentsForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
        this.state = { documentsLoading: false };
        this.setFileRef = this.setFileRef.bind(this);
        this.fileRef = null;
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
    }

    remove(e) {
        e.preventDefault();      
        inlineForm.removeEditor(this.props.meta.element);
    }

    setFileRef(dom) {
        this.fileRef = dom;        
    }

    fileChangeHandler(e) {
        this.props.changeValues((prevValues) => {
            const documents = prevValues.documents.slice(0);
            for (const file of e.target.files) {
                documents.push({
                    ui_id: generateId(),
                    original_name: file.name,
                    comment: '',
                    file: file
                });
            }
            return { documents };
        }, () => {
            this.fileRef.value = '';
        });
    }

    commentChange(i, e) {
        const comment = e.target.value;
        this.props.changeValues((prevValues) => {
            const documents = prevValues.documents.slice(0);
            documents[i] = Object.assign({}, documents[i], { comment });
            return { documents };
        });
    }

    async componentDidMount() {
        this.fileRef.addEventListener('change', this.fileChangeHandler);
        const orderId = this.props.meta.id;
        const url = `/api/order/upload-documents/${encodeURIComponent(orderId)}`;
        try {
            const documents = await api.get(url);
            for (const document of documents) {
                document.ui_id = generateId();
            }
            this.props.changeValues({ documents }, () => {
                this.setState({ documentsLoading: false });
            });
        } catch (err) {
            window.showError('Viga tellimuse olemasolevate dokumentide lugemisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.documentsLoading) {
            return <div className='vt-loader'></div>;
        }
        const {
            error,
            errors,
            values,
            loading,
            inputChange,
            submit
        } = this.props;
        return (
            <form className='vt-form-full' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <strong className='vt-text-green'>Dokumendid</strong>
                <span className='help-block'>
                    Dokumente saab kustutada tellimuse vaatest.
                </span>
                {values.documents.map((document, i) =>
                    <FormGroup key={document.ui_id}>                        
                        <div className='row'>
                            <div className='col-xs-6'>
                                <div className='vt-orders-document-name'>
                                    {typeof document.id === 'number' &&
                                        <a href={`/order/documents/${document.id}`} target='_blank'>{document.original_name}</a>}
                                    {typeof document.id === 'undefined' &&
                                        <span>{document.original_name}</span>}
                                </div>
                            </div>
                            <div className='col-xs-6'>
                                <TextInput
                                    id={`documents-files-${document.ui_id}`}
                                    inputClass='input-sm'
                                    placeholder='Kommentaar'
                                    value={document.comment}
                                    onChange={(e) => this.commentChange(i, e)}
                                    group={false}/>
                            </div>
                        </div>
                    </FormGroup>)}
                <TextInput
                    name='files'
                    type='file'
                    id='documents-files'
                    error={errors.files}
                    label='Lae üles'
                    multiple={true}
                    inputRef={this.setFileRef}/> 
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Salvesta'
                        disabled={loading}/>
                    &nbsp;<Button
                        href='#'
                        icon='window-close-o'
                        label='Loobu'
                        onClick={this.remove}/>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );
    }
});

const submit = async (values, meta) => {
    const data = new FormData();
    let fileIndex = 0;
    values.documents.forEach((document, i) => {
        if (document.file) {
            data.append('files', document.file);
            data.append(`comment-${fileIndex}`, document.comment);
            fileIndex++;
        } else {
            data.append(`existing-file-comment-${document.id}`, document.comment);
        }        
    });
    const url = `/api/order/upload-documents/${encodeURIComponent(meta.id)}`;
    return api.updateFile(url, data);
};

const success = (values) => {
    window.scheduleFlash('Muudatused on salvestatud.');
    window.location.reload();
};

exports.installFormHandler = () => {
    inlineForm.installPopupForm((cell, holder) => {    
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.order
        };
        const initial = { documents: [] };
        ReactDOM.render(
            <DocumentsForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        extraClass: 'vt-orders-documents-editor',
        only: (e) => {
            return !!inlineForm.findAncestor(e.target, 'vt-orders-documents-link');
        }
    });
};
