const Icon = require('../../../lib/views/common/icon.jsx');
const TextInput = require('../../../lib/views/form/text.jsx');
const Textarea = require('../../../lib/views/form/textarea.jsx');
const Checkbox = require('../../../lib/views/form/checkbox.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Select = require('../../../lib/views/form/select.jsx');
const LoadingList = require('./loading_list.jsx');
const FormHoc = require('../common/form_hoc.jsx');
const validate = require('../../../lib/validation/order');
const jsonScript = require('../common/json_script');
const debounce = require('../../../lib/debounce');
const dateString = require('../../../lib/date_string');
const pickr = require('../common/pickr');
const api = require('../common/api');
const move = require('./move');

const root = document.getElementById('order-form-root');

const companies = jsonScript.load('data-companies');
const companyOptions = companies.map(({id, name}) => ({
    value: id,
    label: name
}));
companyOptions.unshift({
    value: '0',
    label: 'Määramata'
});


const OrderForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        console.log('props', props)
        this.state = {
            addresses: [],
            editingOnload: false,
            loadings: jsonScript.load('data-loadings')
        };
        this.onOnloadChange = this.onOnloadChange.bind(this);
        this.onUnloadChange = this.onUnloadChange.bind(this);
        this.findAddresses = debounce(this.findAddresses.bind(this), 1000);
        this.selectAddress = this.selectAddress.bind(this);
        this.closeFinder = this.closeFinder.bind(this);
        this.setLoadingDateInput = this.setLoadingDateInput.bind(this);
        this.loadingDateInput = null;
        this.loadingDateCalendar = null;
    }

    // Updates the list on on-load addresses.

    onOnloadChange(onload, search = true) {
        this.props.valueChange('onload', onload);
        const lastFilled = onload[onload.length - 2];
        if (lastFilled && search) {
            const address = lastFilled.address;
            if (address.length > 2 && address.length < 10) {
                this.findAddresses(address, true);
            }
        }
    }

    setLoadingDateInput(e) {
        if (this.loadingDateCalendar) {
            this.loadingDateCalendar.destroy();
        }
        this.loadingDateInput = e;
        this.loadingDateCalendar = pickr(this.loadingDateInput, (selectedDates, date) => {
            this.props.valueChange('loading_date', date);
        });
    }

    // Updates the list on un-load addresses.

    onUnloadChange(unload, search = true) {
        this.props.valueChange('unload', unload);
        const lastFilled = unload[unload.length - 2];
        if (lastFilled && search) {
            const address = lastFilled.address;
            if (address.length > 2 && address.length < 10) {
                this.findAddresses(address, false);
            }
        }
    }

    // Queries addresses from API for autocomplete.

    async findAddresses(address, isOnload) {
        const url = `/api/addresses/${address}`;
        try {
            const addresses = await api.get(url);
            this.setState({addresses, editingOnload: isOnload});
        } catch (err) {
            window.showError('Viga aadresside leidmisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    // Updates the display of loadings occuring
    // on the same day.

    componentWillReceiveProps(props) {
        const date = props.values.loading_date;
        console.log('props', props)
        if (date !== this.props.values.loading_date) {
            this.updateLoadings(dateString.fromEstonian(date));
        }
    }

    // Updates the display of loadings occuring
    // on the same day.

    async updateLoadings(value) {
        let url = `/api/loadings/${value}`;
        if (this.props.values.id) {
            url += `?id=${this.props.values.id}`;
        }
        try {
            const loadings = await api.get(url);
            this.setState({loadings});
        } catch (err) {
            window.showError('Viga sama päeva laadimiste leidmisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    selectAddress(e, addressId) {
        e.preventDefault();
        const address = this.state.addresses.find(
            address => address.id === addressId);
        if (address) {
            const type = this.state.editingOnload ? 'onload' : 'unload';
            const copy = this.props.values[type].slice(0);
            const index = copy.length - 2;
            const editedAddress = copy[index];
            if (editedAddress) {
                copy[index] = Object.assign({},
                    editedAddress, {address: address.address});
                this.setState({addresses: []});
                this.props.valueChange(type, copy);
            }
        }
    }

    closeFinder(e) {
        e.preventDefault();
        this.setState({addresses: []});
    }

    render() {
        const {
            error,
            errors,
            values,
            submit,
            loading,
            inputChange,
            who
        } = this.props;
        const {
            loadings,
            addresses
        } = this.state;
        return (
            <form className='vt-form-full' onSubmit={submit}>
                <div className='row'>
                    <div className='col-xs-12'>
                        {error &&
                        <FormGroup>
                            <div className='vt-form-error'>{error}</div>
                        </FormGroup>}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <TextInput
                            name='name'
                            id='order-name'
                            label='Koorma nimetus'
                            placeholder='Koorma nimetus'
                            value={values.name}
                            error={errors.name}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <TextInput
                            name='loading_date'
                            id='order-loading_date'
                            label='Laadimise kuupäev'
                            placeholder='Laadimise kuupäev'
                            value={values.loading_date}
                            error={errors.loading_date}
                            onChange={inputChange}
                            inputRef={this.setLoadingDateInput}
                            inputClass='vt-form-control-date'/>
                    </div>
                    <div className='col-xs-2'>
                        <Select
                            name='company'
                            id='order-company'
                            label='Vedaja'
                            options={companyOptions}
                            value={values.company}
                            error={errors.company}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <TextInput
                            name='country'
                            id='order-country'
                            label='Riik'
                            placeholder='Riik'
                            value={values.country}
                            error={errors.country}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <TextInput
                            name='price'
                            id='order-price'
                            label='Hind'
                            placeholder='Hind'
                            value={values.price}
                            error={errors.price}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <TextInput
                            name='who'
                            id='who'
                            label='Kellelt'
                            placeholder='Kellelt'
                            value={values.who}
                            error={errors.who}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-2'>
                        <Checkbox
                            name='full_load'
                            id='order-full_load'
                            label='Täiskoorem'
                            checked={values.full_load}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <Checkbox
                            name='import'
                            id='order-import'
                            label='Import'
                            checked={values.import}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-2'>
                        <Checkbox
                            name='client_transport'
                            id='order-client_transport'
                            label='Kliendi transport'
                            checked={values.client_transport}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-3'>
                        <Textarea
                            name='notes'
                            id='order-notes'
                            label='Märkused'
                            rows='2'
                            placeholder='Märkused'
                            value={values.notes}
                            onChange={inputChange}/>
                    </div>
                    <div className='col-xs-3'>
                        <Textarea
                            name='info'
                            id='order-info'
                            label='Lisainfo vedajale'
                            rows='2'
                            placeholder='Lisainfo vedajale'
                            value={values.info}
                            onChange={inputChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-7'>
                        <FormGroup>
                            <strong className='vt-text-green'>Pealelaadimise kohad</strong><br/>
                            Uue pealelaadimise koha lisamiseks täida kõige alumine koht.
                            Ilma aadressita asukohti ei salvestata.
                        </FormGroup>
                        {loadings.length > 0 &&
                        <FormGroup>
                            Samal päeval lisaks toimuvad laadimised:
                            <table className='table table-bordered vt-order-loadings'>
                                <tbody>
                                {loadings.map(loading =>
                                    <tr key={`${loading.order_id}-${loading.time}`}>
                                        <th>{loading.time}</th>
                                        <td>{loading.order_name}</td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </FormGroup>
                        }
                        <LoadingList
                            timeEdit={true}
                            list={values.onload}
                            onChange={this.onOnloadChange}
                            error={errors.onload}/>
                        <FormGroup>
                            <strong className='vt-text-green'>Mahalaadimise kohad</strong><br/>
                            Uue mahalaadimise koha lisamiseks täida kõige alumine koht.
                            Ilma aadressita asukohti ei salvestata.
                        </FormGroup>
                        <LoadingList
                            list={values.unload}
                            onChange={this.onUnloadChange}
                            showNumbers={true}
                            error={errors.unload}/>
                        <FormGroup>
                            <Submit
                                icon='save'
                                label='Salvesta'
                                disabled={loading}/>
                            &nbsp;<Button
                            href='/orders'
                            icon='window-close-o'
                            label='Loobu'/>
                            {loading &&
                            <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                        </FormGroup>
                    </div>
                </div>
                {addresses.length > 0 &&
                <div className='vt-address-finder'>
                    <div className='vt-address-finder-close'>
                        <a href='#' onClick={this.closeFinder}>
                            <Icon name='close'/>
                        </a>
                    </div>
                    {addresses.map(address =>
                        <a key={`address-${address.id}`} href='#' className='vt-address-item'
                           onClick={(e) => this.selectAddress(e, address.id)}>{address.address}</a>
                    )}
                </div>}
            </form>
        );
    }
});

const postprocessValues = (values) => {
    const copy = Object.assign({}, values);
    copy.loading_date = dateString.fromEstonian(values.loading_date);
    copy.company = copy.company === '0' ? null : copy.company;
    copy.unload = copy.unload.map(place =>
        Object.assign({}, place, {
            date: place.date === '' ? null : dateString.fromEstonian(place.date),
            time: place.time === '' ? null : place.time
        }));
    return copy;
};

const submit = (values) => {
    if (values.id) {
        const url = `/api/order/update/${encodeURIComponent(values.id)}`;
        return api.update(url, postprocessValues(values));
    } else {
        const url = '/api/order/new';
        return api.save(url, postprocessValues(values));
    }
};

const success = () => {
    window.scheduleFlash('Tellimus on salvestatud.');
    window.location = '/orders';
};

const today = () => {
    return new Date().toISOString().substring(0, 10);
};

const plan = jsonScript.load('data-plan');
const data = jsonScript.load('data-form');
const initial = {
    id: null,
    name: '',
    planId: '0',
    loading_date: dateString.toEstonian(today()),
    company: '0',
    notes: '',
    info: '',
    price: '',
    country: '',
    who: '',
    full_load: true,
    import: false,
    client_transport: false,
    onload: [{
        address: 'Lasita Maja AS, Risu tee 2, Pihva küla, 61407' +
            ' Tähtvere vald, Tartumaa, Estonia 58.355089, 26.592400',
        time: '08:30'
    }],
    unload: []
};

if (plan) {
    initial.planId = plan.id;
    initial.name = plan.name;
}

if (data) {
    initial.id = data.id;
    initial.name = data.order_name;
    initial.loading_date = dateString.toEstonian(data.loading_date);
    initial.company = data.company_id || '0';
    initial.notes = data.notes;
    initial.info = data.info;
    initial.who = data.who;

    if (data.price !== null) {
        initial.price = data.price.toString();
    }
    initial.country = data.country;
    initial.full_load = data.full_load;
    initial.onload = data.onload;
    initial.unload = data.unload.map(place => ({
        address: place.address,
        date: place.date ? dateString.toEstonian(place.date) : '',
        time: place.time || ''
    }));
    initial.import = data.import;
    initial.client_transport = data.client_transport;
}

initial.onload.push({address: '', time: '09:30'});
initial.unload.push({address: '', date: '', time: ''});

ReactDOM.render(
    <OrderForm
        submit={submit}
        success={success}
        validate={validate}
        initial={initial}/>, root);
