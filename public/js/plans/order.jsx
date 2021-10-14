const Select = require('../../../lib/views/form/select.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const api = require('../common/api');

const PlansForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { orders: [], ordersLoading: true };
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);
    }

    async componentDidMount() {
        const planId = this.props.meta.id;
        const url = `/api/order/for-selector/${encodeURIComponent(planId)}`;
        try {
            const orders = await api.get(url);
            const ordersOptions = orders.map(({id, label}) => ({
                value: id,
                label: label
            }));
            ordersOptions.unshift({
                value: '0',
                label: 'Määramata'
            });
            this.setState({ orders: ordersOptions, ordersLoading: false });
        } catch (err) {
            window.showError('Viga tellimuste leidmisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.ordersLoading) {
            return <div className='vt-loader'></div>;
        }
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
                <Select
                    name='order_id'
                    label='Tellimus'
                    options={this.state.orders}
                    value={values.order_id}
                    error={errors.order_id}
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
    const url = `/api/plan/update-order/${encodeURIComponent(meta.id)}`;
    await api.update(url, {
        order_id: values.order_id
    });
};

const success = (values) => {
    window.scheduleFlash('Plaani seos tellimusega on uuendatud.');
    window.location.reload();
};

exports.init = () => {
    inlineForm.installPopupForm((cell, holder) => {
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.plan
        };
        const initial = {        
            order_id: row.dataset.order || '0'
        };
        ReactDOM.render(
            <PlansForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        ignore: (e) => {
            return !e.target.classList.contains('vt-plans-select');
        }
    });
};
