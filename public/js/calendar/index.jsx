const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const inlineForm = require('../common/inline_form.jsx');
const dateString = require('../../../lib/date_string');
const pickr = require('../common/pickr');
const api = require('../common/api');

const CalendarForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
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
                    name='vehicle'
                    label='Auto number'
                    value={values.vehicle}
                    error={errors.vehicle}
                    onChange={inputChange}/>
                <TextInput
                    name='unload_date'
                    label='Mahalaadimise kuupäev'
                    value={values.unload_date}
                    error={errors.unload_date}
                    onChange={inputChange}
                    inputRef={this.setDateInput}
                    inputClass='vt-form-control-date'/>
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
    const url = `/api/order/update-vehicle/${encodeURIComponent(meta.id)}`;
    await api.update(url, {
        vehicle: values.vehicle,
        unload_date: values.unload_date === '' ? null :
            dateString.fromEstonian(values.unload_date)
    });
};

const success = (values) => {
    window.scheduleFlash('Mahalaadimise kuupäev/auto number on salvestatud.');
    window.location.reload();
};

inlineForm.installPopupForm((cell, holder) => {
    let unloadDate = '';
    if (cell.dataset.unload_date) {
        unloadDate = dateString.toEstonian(cell.dataset.unload_date);
    }
    const meta = {
        element: holder,
        id: cell.dataset.order
    };
    const initial = {
        unload_date: unloadDate,
        vehicle: cell.dataset.vehicle || ''
    };
    ReactDOM.render(
        <CalendarForm
            meta={meta}
            submit={submit}
            success={success}
            initial={initial}/>, holder);
}, {
    ignore: (e) => {
        return e.target.href;
    }
});
