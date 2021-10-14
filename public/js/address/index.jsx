const TextInput = require('../../../lib/views/form/text.jsx');
const Textarea = require('../../../lib/views/form/textarea.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const validate = require('../../../lib/validation/address');
const api = require('../common/api');

const root = document.getElementById('address-form-root');

const AddressForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
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
                <Textarea
                    name='address'
                    id='address-address'
                    label='Aadress'
                    rows='5'
                    placeholder='Aadress'
                    value={values.address}
                    error={errors.address}
                    onChange={inputChange}/>
                <Textarea
                    name='notes'
                    id='address-notes'
                    label='Märkused'
                    rows='2'
                    placeholder='Märkused'
                    value={values.notes}
                    onChange={inputChange}/>
                <TextInput
                    name='name'
                    id='address-name'
                    label='Kliendi/tellimuse nimi'
                    value={values.name}
                    error={errors.name}
                    onChange={inputChange}/>
                <TextInput
                    name='region'
                    id='address-region'
                    label='Regioon'
                    value={values.region}
                    error={errors.region}
                    onChange={inputChange}/>
                <TextInput
                    name='marker'
                    id='address-marker'
                    label='Tähis'
                    value={values.marker}
                    error={errors.marker}
                    onChange={inputChange}/>
                <Checkbox
                    name='archived'
                    id='address-archived'
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
    const url = `/api/address`;
    await api.save(url, {
        name: values.name,
        notes: values.notes,
        archived: values.archived,
        region: values.region,
        address: values.address,
        marker: values.marker
    });
};

const success = (values) => {
    window.scheduleFlash('Aadressi andmed on salvestatud.');
    window.location = '/addresses';
};

const initial = {
    name: '',
    notes: '',
    archived: false,
    region: '',
    address: '',
    marker: ''
};

ReactDOM.render(
    <AddressForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>, root);
