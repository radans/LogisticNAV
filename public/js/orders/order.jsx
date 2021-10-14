const TextInput = require('../../../lib/views/form/text.jsx');
const Select = require('../../../lib/views/form/select.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const jsonScript = require('../common/json_script');
const dateString = require('../../../lib/date_string');
const pickr = require('../common/pickr');
const api = require('../common/api');

const salespeople = jsonScript.load('orders-salespeople');
const salespeopleOptions = salespeople.map(({id, name}) => ({
    value: id,
    label: name
}));
salespeopleOptions.unshift({
    value: '0',
    label: 'Määramata'
});

const OrdersForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
        this.state = { plans: [], plansLoading: true };
        this.dateInput = null;
        this.calendar = null;
        this.setDateInput = this.setDateInput.bind(this);
    }

    remove(e) {
        e.preventDefault();
        if (this.calendar) {
            this.calendar.destroy();
            this.calendar = null;
        }
        inlineForm.removeEditor(this.props.meta.element);
    }

    setDateInput(e) {
        if (this.calendar) {
            this.calendar.destroy();
        }
        this.dateInput = e;
        this.calendar = pickr(this.dateInput, (selectedDates, date) => {
            this.props.valueChange('unload_date', date);
        });
    }

    async componentDidMount() {
        const planId = this.props.values.plan_id;
        const url = `/api/plan/for-selector/${encodeURIComponent(planId)}`;
        try {
            const plans = await api.get(url);
            const plansOptions = plans.map(({id, label}) => ({
                value: id,
                label: label
            }));
            plansOptions.unshift({
                value: '0',
                label: 'Määramata'
            });
            this.setState({ plans: plansOptions, plansLoading: false });
        } catch (err) {
            window.showError('Viga plaanide leidmisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.plansLoading) {
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
                <TextInput
                    name='vehicle'
                    label='Auto number'
                    value={values.vehicle}
                    error={errors.vehicle}
                    onChange={inputChange}/>
                <TextInput
                    name='invoice'
                    label='Arve number'
                    value={values.invoice}
                    error={errors.invoice}
                    onChange={inputChange}/>
                <TextInput
                    name='unload_date'
                    label='Mahalaadimise kuupäev'
                    value={values.unload_date}
                    error={errors.unload_date}
                    onChange={inputChange}
                    inputRef={this.setDateInput}
                    inputClass='vt-form-control-date'/>
                <Select
                    name='plan_id'
                    label='Koormaplaan'
                    options={this.state.plans}
                    value={values.plan_id}
                    error={errors.plan_id}
                    onChange={inputChange}/>
                <Select
                    name='salesperson'
                    label='Müügijuht'
                    options={salespeopleOptions}
                    value={values.salesperson}
                    error={errors.salesperson}
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

const submit = async (values, meta) => {
    const url = `/api/order/update-vehicle-invoice/${encodeURIComponent(meta.id)}`;
    await api.update(url, {
        plan_id: values.plan_id,
        vehicle: values.vehicle,
        invoice: values.invoice,
        salesperson_id: values.salesperson,
        unload_date: values.unload_date === '' ? null :
            dateString.fromEstonian(values.unload_date)
    });
};

const success = (values) => {
    window.scheduleFlash('Tellimuse andmed on salvestatud.');
    window.location.reload();
};

exports.installFormHandler = () => {
    inlineForm.installPopupForm((cell, holder) => {    
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.order
        };
        let unloadDate = '';
        if (row.dataset.unload_date) {
            unloadDate = dateString.toEstonian(row.dataset.unload_date);
        }
        const initial = {
            plan_id: row.dataset.plan || '0',
            vehicle: row.dataset.vehicle || '',
            invoice: row.dataset.invoice || '',
            salesperson: row.dataset.salesperson || '0',
            unload_date: unloadDate
        };
        ReactDOM.render(
            <OrdersForm
                meta={meta}
                submit={submit}
                success={success}
                initial={initial}/>, holder);
    }, {
        ignore: (e) => {
            return e.target.href &&
                !e.target.classList.contains('vt-orders-select');
        },
        only: (e) => {
            return inlineForm.findAncestor(e.target, 'vt-orders-edit');
        }
    });
};
