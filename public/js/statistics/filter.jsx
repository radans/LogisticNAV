const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Select = require('../../../lib/views/form/select.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const pickr = require('../common/pickr');
const jsonScript = require('../common/json_script');

const companies = jsonScript.load('data-companies');
const companyOptions = companies.map(({ids, name}) =>
    ({ value: ids, label: name }));
companyOptions.unshift({ value: '0', label: 'Määramata' });

const countries = jsonScript.load('data-countries');
const countryOptions = countries.map(({country}) =>
    ({ value: country, label: country }));
countryOptions.unshift({ value: '0', label: 'Määramata' });

const regions = jsonScript.load('data-regions');
const regionOptions = regions.map(({region}) =>
    ({ value: region, label: region }));
regionOptions.unshift({ value: '0', label: 'Määramata' });

const salespeople = jsonScript.load('data-salespeople');
const salespersonOptions = salespeople.map(person =>
    ({ value: person.id, label: person.name }));
salespersonOptions.unshift({ value: '0', label: 'Määramata' });

const importExportOptions = [
    { value: '0', label: 'Kõik' },
    { value: '1', label: 'Eksport' },
    { value: '2', label: 'Import' }
];

const clientTransportOptions = [
    { value: '0', label: 'Kõik' },
    { value: '1', label: 'Ei' },
    { value: '2', label: 'Jah' }
];

module.exports = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.setStartInput = this.setStartInput.bind(this);
        this.setEndInput = this.setEndInput.bind(this);
        this.startInput = null;
        this.endInput = null;
        this.startCalendar = null;
        this.endCalendar = null;
    }

    setStartInput(e) {
        if (this.startCalendar) {
            this.startCalendar.destroy();
        }
        this.startInput = e;
        this.startCalendar = pickr(e, (selectedDates, date) => {
            this.props.valueChange('start', date);
        });
    }

    setEndInput(e) {
        if (this.endCalendar) {
            this.endCalendar.destroy();
        }
        this.endInput = e;
        this.endCalendar = pickr(e, (selectedDates, date) => {
            this.props.valueChange('end', date);
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
            <form className='vt-form-full' onSubmit={submit}>
                {error &&
                    <FormGroup>
                        <div className='vt-form-error'>{error}</div>
                    </FormGroup>}
                <div className='row'>
                    <div className='col-xs-2'>
                        <TextInput
                            name='start'
                            label='Perioodi algus'
                            placeholder='Algus'
                            value={values.start}
                            error={errors.start}
                            onChange={inputChange}
                            inputRef={this.setStartInput}
                            inputClass='vt-form-control-date'/>
                    </div>
                    <div className='col-xs-2'>
                        <TextInput
                            name='end'
                            label='Perioodi lõpp'
                            placeholder='Lõpp'
                            value={values.end}
                            error={errors.end}
                            onChange={inputChange}
                            inputRef={this.setEndInput}
                            inputClass='vt-form-control-date'/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <Select
                            name='country'
                            label='Riik'
                            options={countryOptions}
                            value={values.country}
                            error={errors.country}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <Select
                            name='region'
                            label='Regioon'
                            options={regionOptions}
                            value={values.region}
                            error={errors.region}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <Select
                            name='company'
                            label='Vedaja'
                            options={companyOptions}
                            value={values.company}
                            error={errors.company}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <Select
                            name='salesperson'
                            label='Müügijuht'
                            options={salespersonOptions}
                            value={values.salesperson}
                            error={errors.salesperson}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <Select
                            name='importExport'
                            label='Import/eksport'
                            options={importExportOptions}
                            value={values.importExport}
                            error={errors.importExport}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2 vt-form-grid-checkbox'>
                        <Checkbox
                            name='table'
                            label='Näita tabelit'
                            checked={values.table}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <Select
                            name='clientTransport'
                            label='Kliendi transport'
                            options={clientTransportOptions}
                            value={values.clientTransport}
                            error={errors.clientTransport}
                            onChange={inputChange}/>
                    </div>
                </div>
                <FormGroup>
                    <Submit
                        icon='refresh'
                        label='Kuva'
                        disabled={loading}/>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );
    }
});
