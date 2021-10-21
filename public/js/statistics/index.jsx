const Filter = require('./filter.jsx');
const Orders = require('./orders.jsx');
const Numbers = require('./numbers.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const Buttons = require('../../../lib/views/common/buttons.jsx');
const validate = require('../../../lib/validation/statistics');
const dateString = require('../../../lib/date_string');
const api = require('../common/api');

class Statistics extends React.Component {

    constructor(props) {
        super(props);
        this.validatePeriod = this.validatePeriod.bind(this);
        this.updatePeriod = this.updatePeriod.bind(this);
        this.state = {
            orders: null,
            table: false,
            query: null
        };
        this.initial = {
            start: dateString.toEstonian(initialStart()),
            end: dateString.toEstonian(initialEnd()),
            company: '0',
            country: '0',
            region: '0',
            salesperson: '0',
            importExport: '1',
            clientTransport: '1',
            table: false
        };
    }

    handleStatistics(orders, table, query) {
        this.setState({ orders, table, query });
    }

    async updatePeriod(values) {
        const query = urlQuery(values);
        try {
            window.showLoader('Loen andmeid ...');
            const orders = await api.get(`/api/statistics?${query}`);
            this.handleStatistics(orders, values.table, query);
        } catch (err) {
            window.showError('Viga andmete lugemisel. Palun proovi' +
                ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        } finally {
            window.hideLoader();
        }
    }

    validatePeriod(values) {
        return validate(values);
    }

    render() {
        const {
            orders,
            table,
            query
        } = this.state;
        return (
            <div>
                <Filter
                    submit={this.updatePeriod}
                    validate={this.validatePeriod}
                    initial={this.initial}/>
                {orders !== null && orders.length > 0 &&
                    <div>
                        <h3>Numbrid</h3>
                        <Numbers orders={orders}/>
                        <Buttons>
                            <Button
                                icon='table'
                                label='Tulemused Exceli tabelina'
                                href={`/statistics/excel?${query}`}/>
                        </Buttons>
                    </div>
                }                
                {table && orders !== null && orders.length > 0 &&
                    <div>
                        <h3>Tellimused</h3>
                        <Orders orders={orders}/>
                    </div>
                }
                {orders !== null && orders.length === 0 &&
                    <div className='alert alert-success'>Andmed puuduvad.</div>
                }
            </div>
        );
    }
}

const initialStart = () => {
    const date = new Date();
    return `${date.getUTCFullYear()}-01-01`;
};

const initialEnd = () => {
    return new Date().toISOString().substring(0, 10);
};

const urlQuery = (values) => {
    const start = dateString.fromEstonian(values.start);
    const end = dateString.fromEstonian(values.end);
    const country = values.country;
    const region = values.region;
    const company = values.company;
    const salesperson = values.salesperson;
    const importExport = values.importExport;
    const clientTransport = values.clientTransport;
    return `start=${start}` +
        `&end=${end}` +
        `&country=${encodeURIComponent(country)}` +
        `&region=${encodeURIComponent(region)}` +
        `&company=${encodeURIComponent(company)}` +
        `&salesperson=${encodeURIComponent(salesperson)}` +
        `&importExport=${encodeURIComponent(importExport)}` +
        `&clientTransport=${encodeURIComponent(clientTransport)}`;
};

ReactDOM.render(
    <Statistics />,
    document.getElementById('statistics-root'));
