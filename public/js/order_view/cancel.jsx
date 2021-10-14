const Textarea = require('../../../lib/views/form/textarea.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const validate = require('../../../lib/validation/order_cancel');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

const CancelForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        removeAt(this.props.values.element);
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
            <form className='vt-form-full' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <Checkbox
                    name='cancelled'
                    id='order-cancelled'
                    label='Tühistatud'
                    checked={values.cancelled}
                    onChange={inputChange}/>
                <Textarea
                    name='cancel_text'
                    id='order-cancel-text'
                    label='Selgitus'
                    rows='3'
                    placeholder='Tühistamise selgitus'
                    value={values.cancel_text}
                    error={errors.cancel_text}
                    onChange={inputChange}/>
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

const submit = async (values) => {
    const url = `/api/order/update-cancel/${encodeURIComponent(values.id)}`;
    await api.update(url, {
        cancelled: values.cancelled,
        cancel_text: values.cancel_text
    });
};

const success = (values) => {
    window.showFlash('Tellimuse andmed on salvestatud.');
    window.location.reload();
};

const removeAt = (element) => {
    ReactDOM.unmountComponentAtNode(element);
};

exports.init = () => {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const cancelHolder = document.getElementById('cancel-holder');
        const data = jsonScript.load('order-data');
        const initial = {
            element: cancelHolder,
            cancelled: data.cancelled,
            cancel_text: data.cancel_text || '',
            id: data.id
        };
        if (cancelHolder.children.length === 0) {
            ReactDOM.render(
                <CancelForm
                    submit={submit}
                    success={success}
                    validate={validate}
                    initial={initial}/>,
                cancelHolder);
        }
    }, false);
};
