const TextInput = require('../../../lib/views/form/text.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const api = require('../common/api');

const PackageForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);  
    }

    render() {
        const {            
            error,
            errors,
            values,
            submit,
            loading,
            inputChange
        } = this.props;
        return (
            <form className='vt-form' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}                
                <TextInput
                    name='name'
                    id='package-name'
                    label='Nimetus'
                    value={values.name}
                    error={errors.name}
                    onChange={inputChange}/>
                <Checkbox
                    name='archived'
                    id='package-archived'
                    label='Arhiveeritud'
                    checked={values.archived}
                    onChange={inputChange}/>
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Salvesta'
                        disabled={loading}/>
                    <span> <Button
                        href='#'
                        icon='window-close-o'
                        label='Loobu'
                        onClick={this.remove}/></span>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );        
    }
});

const submit = async (values, meta) => {
    const url = `/api/packages/${encodeURIComponent(meta.code)}`;
    await api.update(url, {
        name: values.name,
        archived: values.archived
    });
};

const success = (values) => {
    window.scheduleFlash('Koormapaki andmed on salvestatud.');
    window.location.reload();
};

inlineForm.installPopupForm((cell, holder) => {
    const row = cell.parentNode;
    const meta = {
        element: holder,
        code: row.dataset.code
    };
    const initial = {
        name: row.dataset.name || '',        
        archived: row.dataset.archived === 'true'
    };
    ReactDOM.render(
        <PackageForm
            meta={meta}
            submit={submit}
            success={success}
            initial={initial}/>, holder);
});
