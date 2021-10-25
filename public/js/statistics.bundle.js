/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = ({ children, size, error }) => {
    const classes = ['form-group'];
    if (size) {
        classes.push(`form-group-${size}`);
    }
    if (error) {
        classes.push(`has-error`);
    }
    return React.createElement(
        'div',
        { className: classes.join(' ') },
        children
    );
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Helper to display Font-Awesome icons.

module.exports = ({ name, id, extraClass }) => {
    const classes = ['fa', `fa-${name}`];
    if (extraClass) {
        classes.push(extraClass);
    }
    return React.createElement('i', { className: classes.join(' '), 'aria-hidden': 'true', id: id });
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Icon = __webpack_require__(1);

// Used by Bootstrap JavaScript components.

const dataProps = ['toggle', 'target'].map(prop => 'data-' + prop);

const Button = module.exports = props => {
    const classes = ['btn', 'btn-default', 'hidden-print'];
    if (props.size) {
        classes.push(`btn-${props.size}`);
    }
    const href = props.href || '#';
    const dataAttr = {};
    for (const key of dataProps) {
        dataAttr[key] = props[key];
    }
    return React.createElement(
        'a',
        _extends({
            href: href,
            className: classes.join(' ')
        }, dataAttr, {
            id: props.id,
            onClick: props.onClick }),
        props.icon && React.createElement(Icon, { name: props.icon }),
        ' ',
        props.label
    );
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Filter = __webpack_require__(4);
const Orders = __webpack_require__(12);
const Numbers = __webpack_require__(13);
const Button = __webpack_require__(2);
const Buttons = __webpack_require__(14);
const validate = __webpack_require__(15);
const dateString = __webpack_require__(17);
const api = __webpack_require__(18);

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
            window.showError('Viga andmete lugemisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
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
        return React.createElement(
            'div',
            null,
            React.createElement(Filter, {
                submit: this.updatePeriod,
                validate: this.validatePeriod,
                initial: this.initial }),
            orders !== null && orders.length > 0 && React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Numbrid'
                ),
                React.createElement(Numbers, { orders: orders }),
                React.createElement(
                    Buttons,
                    null,
                    React.createElement(Button, {
                        icon: 'table',
                        label: 'Tulemused Exceli tabelina',
                        href: `/statistics/excel?${query}` })
                )
            ),
            table && orders !== null && orders.length > 0 && React.createElement(
                'div',
                null,
                React.createElement(
                    'h3',
                    null,
                    'Tellimused'
                ),
                React.createElement(Orders, { orders: orders })
            ),
            orders !== null && orders.length === 0 && React.createElement(
                'div',
                { className: 'alert alert-success' },
                'Andmed puuduvad.'
            )
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

const urlQuery = values => {
    const start = dateString.fromEstonian(values.start);
    const end = dateString.fromEstonian(values.end);
    const country = values.country;
    const region = values.region;
    const company = values.company;
    const salesperson = values.salesperson;
    const importExport = values.importExport;
    const clientTransport = values.clientTransport;
    return `start=${start}` + `&end=${end}` + `&country=${encodeURIComponent(country)}` + `&region=${encodeURIComponent(region)}` + `&company=${encodeURIComponent(company)}` + `&salesperson=${encodeURIComponent(salesperson)}` + `&importExport=${encodeURIComponent(importExport)}` + `&clientTransport=${encodeURIComponent(clientTransport)}`;
};

ReactDOM.render(React.createElement(Statistics, null), document.getElementById('statistics-root'));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(5);
const Submit = __webpack_require__(6);
const FormGroup = __webpack_require__(0);
const Button = __webpack_require__(2);
const Select = __webpack_require__(7);
const Checkbox = __webpack_require__(8);
const FormHoc = __webpack_require__(9);
const pickr = __webpack_require__(10);
const jsonScript = __webpack_require__(11);

const companies = jsonScript.load('data-companies');
const companyOptions = companies.map(({ ids, name }) => ({ value: ids, label: name }));
companyOptions.unshift({ value: '0', label: 'Määramata' });

const countries = jsonScript.load('data-countries');
const countryOptions = countries.map(({ country }) => ({ value: country, label: country }));
countryOptions.unshift({ value: '0', label: 'Määramata' });

const regions = jsonScript.load('data-regions');
const regionOptions = regions.map(({ region }) => ({ value: region, label: region }));
regionOptions.unshift({ value: '0', label: 'Määramata' });

const salespeople = jsonScript.load('data-salespeople');
const salespersonOptions = salespeople.map(person => ({ value: person.id, label: person.name }));
salespersonOptions.unshift({ value: '0', label: 'Määramata' });

const importExportOptions = [{ value: '0', label: 'Kõik' }, { value: '1', label: 'Eksport' }, { value: '2', label: 'Import' }];

const clientTransportOptions = [{ value: '0', label: 'Kõik' }, { value: '1', label: 'Ei' }, { value: '2', label: 'Jah' }];

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
        return React.createElement(
            'form',
            { className: 'vt-form-full', onSubmit: submit },
            error && React.createElement(
                FormGroup,
                null,
                React.createElement(
                    'div',
                    { className: 'vt-form-error' },
                    error
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(TextInput, {
                        name: 'start',
                        label: 'Perioodi algus',
                        placeholder: 'Algus',
                        value: values.start,
                        error: errors.start,
                        onChange: inputChange,
                        inputRef: this.setStartInput,
                        inputClass: 'vt-form-control-date' })
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(TextInput, {
                        name: 'end',
                        label: 'Perioodi l\xF5pp',
                        placeholder: 'L\xF5pp',
                        value: values.end,
                        error: errors.end,
                        onChange: inputChange,
                        inputRef: this.setEndInput,
                        inputClass: 'vt-form-control-date' })
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'country',
                        label: 'Riik',
                        options: countryOptions,
                        value: values.country,
                        error: errors.country,
                        onChange: inputChange })
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'region',
                        label: 'Regioon',
                        options: regionOptions,
                        value: values.region,
                        error: errors.region,
                        onChange: inputChange })
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'company',
                        label: 'Vedaja',
                        options: companyOptions,
                        value: values.company,
                        error: errors.company,
                        onChange: inputChange })
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'salesperson',
                        label: 'M\xFC\xFCgijuht',
                        options: salespersonOptions,
                        value: values.salesperson,
                        error: errors.salesperson,
                        onChange: inputChange })
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'importExport',
                        label: 'Import/eksport',
                        options: importExportOptions,
                        value: values.importExport,
                        error: errors.importExport,
                        onChange: inputChange })
                ),
                React.createElement(
                    'div',
                    { className: 'col-xs-2 vt-form-grid-checkbox' },
                    React.createElement(Checkbox, {
                        name: 'table',
                        label: 'N\xE4ita tabelit',
                        checked: values.table,
                        onChange: inputChange })
                )
            ),
            React.createElement(
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col-xs-2' },
                    React.createElement(Select, {
                        name: 'clientTransport',
                        label: 'Kliendi transport',
                        options: clientTransportOptions,
                        value: values.clientTransport,
                        error: errors.clientTransport,
                        onChange: inputChange })
                )
            ),
            React.createElement(
                FormGroup,
                null,
                React.createElement(Submit, {
                    icon: 'refresh',
                    label: 'Kuva',
                    disabled: loading }),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
        );
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(0);

let idValue = 1;

module.exports = props => {
    const type = props.type || 'text';
    const error = props.error;
    const id = props.id || `_text-${idValue++}`;
    const inputClass = props.inputClass;
    const inputClasses = ['form-control'];
    const group = typeof props.group === 'undefined' ? true : props.group;
    if (inputClass) {
        inputClasses.push(inputClass);
    }
    const input = () => React.createElement('input', {
        type: type,
        className: inputClasses.join(' '),
        id: id,
        name: props.name,
        value: props.value,
        defaultValue: props.defaultValue,
        placeholder: props.placeholder,
        onChange: props.onChange,
        ref: props.inputRef,
        multiple: props.multiple });
    if (!group) {
        return input();
    }
    return React.createElement(
        FormGroup,
        { size: props.size, error: error },
        props.label && React.createElement(
            'label',
            { htmlFor: id },
            props.label
        ),
        input(),
        error && React.createElement(
            'span',
            { className: 'help-block' },
            error
        )
    );
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const Icon = __webpack_require__(1);

module.exports = props => {
    return React.createElement(
        'button',
        { type: 'submit', className: 'btn btn-default', disabled: !!props.disabled },
        props.icon && React.createElement(Icon, { name: props.icon }),
        ' ',
        props.label
    );
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(0);

module.exports = props => {
    const options = props.options;
    const error = props.error;
    return React.createElement(
        FormGroup,
        { size: props.size, error: error },
        React.createElement(
            'label',
            { htmlFor: props.id },
            props.label
        ),
        React.createElement(
            'select',
            {
                className: 'form-control',
                id: props.id,
                name: props.name,
                value: props.value,
                onChange: props.onChange,
                defaultValue: props.defaultValue },
            options.map(option => React.createElement(
                'option',
                {
                    key: `option-${option.value}`,
                    value: option.value },
                option.label
            ))
        ),
        error && React.createElement(
            'span',
            { className: 'help-block' },
            error
        )
    );
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = props => {
    return React.createElement(
        'div',
        { className: 'checkbox', style: props.style },
        React.createElement(
            'label',
            null,
            React.createElement('input', {
                type: 'checkbox',
                name: props.name,
                checked: props.checked,
                onChange: props.onChange,
                defaultChecked: props.defaultChecked,
                value: props.value }),
            ' ',
            props.label
        )
    );
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// HOC to generically handle forms.

module.exports = FormComponent => {

    return class extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                values: props.initial || {},
                error: null,
                errors: {},
                loading: false
            };
            this.inputChange = this.inputChange.bind(this);
            this.valueChange = this.valueChange.bind(this);
            this.changeValues = this.changeValues.bind(this);
            this.submit = this.submit.bind(this);
            this.mounted = false;
        }

        inputChange(e) {
            const target = e.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            this.changeValue(name, value);
        }

        valueChange(name, value) {
            this.changeValue(name, value);
        }

        changeValue(name, value) {
            this.setState(prevState => {
                const prevValues = prevState.values;
                return {
                    values: Object.assign({}, prevValues, { [name]: value })
                };
            });
        }

        changeValues(values, cb) {
            if (typeof values === 'object') {
                this.setState(prevState => {
                    const prevValues = prevState.values;
                    return { values: Object.assign({}, prevValues, values) };
                }, cb);
            } else if (typeof values === 'function') {
                this.setState(prevState => {
                    const prevValues = prevState.values;
                    const change = values(prevValues);
                    return { values: Object.assign({}, prevValues, change) };
                }, cb);
            }
        }

        componentDidMount() {
            this.mounted = true;
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        async submit(e, extra) {
            e.preventDefault();
            const {
                meta,
                submit,
                success,
                validate
            } = this.props;
            const values = this.state.values;
            if (typeof validate === 'function') {
                const errors = validate(values, extra);
                if (errors.hasError()) {
                    this.setState({ errors: errors.extract() });
                    return;
                }
            }
            try {
                this.setState({ loading: true });
                const data = await submit(values, meta, extra);
                if (typeof success === 'function') {
                    success(values, data, this, meta);
                }
            } catch (err) {
                if (err.json) {
                    if (err.json.errors) {
                        this.setState({ errors: err.json.errors });
                    } else if (err.json.message) {
                        this.setState({ error: err.json.message });
                    }
                } else {
                    window.showSaveError();
                    throw err;
                }
            } finally {
                // success handler might cause unmount.
                if (this.mounted) {
                    this.setState({ loading: false });
                }
            }
        }

        render() {
            const {
                error,
                errors,
                values,
                loading
            } = this.state;
            return React.createElement(FormComponent, {
                error: error,
                errors: errors,
                values: values,
                submit: this.submit,
                loading: loading,
                inputChange: this.inputChange,
                valueChange: this.valueChange,
                meta: this.props.meta,
                changeValues: this.changeValues });
        }
    };
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// Helper to construct a flatpickr instance.

module.exports = (element, fn, clear = false) => {
    const options = {
        dateFormat: 'd.m.Y',
        locale: 'et',
        onChange: fn
    };
    if (clear) {
        options.onReady = (dateObj, dateStr, instance) => {
            const clear = document.createElement('div');
            clear.className = 'flatpickr-clear';
            clear.textContent = 'Tühjenda';
            clear.addEventListener('click', (e) => {
                instance.clear();
                instance.close();
            });
            instance.calendarContainer.appendChild(clear);
        };
    }
    return flatpickr(element, options);
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

// Loads JSON script from the given element.

exports.load = (id) => {
    const element = document.getElementById(id);
    if (element) {
        return JSON.parse(element.innerText);
    }
    return null;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = class Orders extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const { orders } = this.props;
        return React.createElement(
            'table',
            { className: 'table table-bordered table-striped' },
            React.createElement(
                'colgroup',
                null,
                React.createElement('col', { className: 'vt-stats-orders-number-col' }),
                React.createElement('col', { className: 'vt-stats-orders-date-col' }),
                React.createElement('col', { className: 'vt-stats-orders-country-col' }),
                React.createElement('col', { className: 'vt-stats-orders-region-col' }),
                React.createElement('col', { className: 'vt-stats-orders-price-col' }),
                React.createElement('col', { className: 'vt-stats-orders-full-col' }),
                React.createElement('col', { className: 'vt-stats-orders-load-count-col' }),
                React.createElement('col', { className: 'vt-stats-orders-company-col' }),
                React.createElement('col', { className: 'vt-stats-orders-invoice-col' }),
                React.createElement('col', { className: 'vt-stats-orders-import-col' }),
                React.createElement('col', { className: 'vt-stats-orders-notes-col' })
            ),
            React.createElement(
                'thead',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Number'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Laadimine'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Riik'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Regioon'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Hind'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'T/O'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Laadimisi'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'Vedaja'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Arve'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Import/eksport'
                    ),
                    React.createElement(
                        'th',
                        { className: 'text-right' },
                        'Kliendi transport'
                    ),
                    React.createElement(
                        'th',
                        null,
                        'M\xE4rkused'
                    )
                )
            ),
            React.createElement(
                'tbody',
                null,
                orders.map(order => React.createElement(
                    'tr',
                    { key: order.id },
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        React.createElement(
                            'a',
                            { href: `/orders/${order.id}` },
                            order.id
                        )
                    ),
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        order.loading_date_formatted
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.country
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.region
                    ),
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        order.price === null ? '' : order.price.toFixed(0)
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.full_load ? 'T' : 'O'
                    ),
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        order.unloading_count
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.company_name
                    ),
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        order.invoice
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.import ? 'Import' : 'Eksport'
                    ),
                    React.createElement(
                        'td',
                        { className: 'text-right' },
                        order.client_transport ? 'Jah' : 'Ei'
                    ),
                    React.createElement(
                        'td',
                        null,
                        order.notes
                    )
                ))
            )
        );
    }
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = class Numbers extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const { orders } = this.props;
        const count = orders.reduce((prev, cur) => prev + (cur.price === 0 ? 0 : cur.full_load ? 1 : 0.5), 0);
        const totalPrice = orders.reduce((prev, cur) => prev + cur.price, 0);
        const averagePrice = totalPrice / count;
        const maxPrice = orders.reduce((prev, cur) => Math.max(prev, cur.price), 0);
        const minPrice = orders.reduce((prev, cur) => Math.min(prev, cur.price), Number.MAX_VALUE);
        return React.createElement(
            'table',
            { className: 'table table-bordered table-striped' },
            React.createElement(
                'tbody',
                null,
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Laadimiste kogus'
                    ),
                    React.createElement(
                        'td',
                        null,
                        count.toFixed(1)
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Summa kokku'
                    ),
                    React.createElement(
                        'td',
                        null,
                        totalPrice.toFixed(0)
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Keskmine hind'
                    ),
                    React.createElement(
                        'td',
                        null,
                        averagePrice.toFixed(0)
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Maksimaalne hind'
                    ),
                    React.createElement(
                        'td',
                        null,
                        maxPrice.toFixed(0)
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Minimaalne hind'
                    ),
                    React.createElement(
                        'td',
                        null,
                        minPrice.toFixed(0)
                    )
                ),
                React.createElement(
                    'tr',
                    null,
                    React.createElement(
                        'th',
                        null,
                        'Hinnavahe'
                    ),
                    React.createElement(
                        'td',
                        null,
                        (maxPrice - minPrice).toFixed(0)
                    )
                )
            )
        );
    }
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

// Helper to display a set of buttons.

module.exports = props => {
    return React.createElement(
        'div',
        { className: 'vt-buttons' },
        props.children
    );
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const Errors = __webpack_require__(16);

module.exports = ({start, end}) => {
    const errors = new Errors();
    if (start.trim() === '') {
        errors.add('start', 'Alguse kuupäev on jäänud sisestamata.');
    }
    if (end.trim() === '') {
        errors.add('end', 'Lõpu kuupäev on jäänud sisestamata.');
    }
    return errors;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

// Helper to keep the set of errors during
// validation. Shared between frontend and
// backend.

module.exports = class Errors {

    constructor() {
        this.errors = {};
    }

    add(field, message) {
        if (!this.errors[field]) {
            this.errors[field] = [];
        }
        this.errors[field].push(message);
    }

    hasError() {
        return Object.keys(this.errors).length > 0;
    }

    extract() {
        const extracted = {};
        for (const key in this.errors) {
            extracted[key] = this.errors[key].join(' ');
        }
        return extracted;
    }
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// 1993-06-30 to 30.06.1993.

exports.toEstonian = (string) => {
    const match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
    if (!match) {
        throw new Error('Invalid date.');
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);    
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
};

// 30.06.1993 to 1993-06-30.

exports.fromEstonian = (string) => {
    const match = string.match(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
    if (!match) {
        throw new Error('Invalid date.');
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

exports.get = async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return handleResponse(response);
};

exports.save = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.update = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.updateFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'PUT',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.postFile = async (url, file) => {
    const response = await fetch(url, {
        method: 'POST',
        body: file,
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.remove = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
    });
    return handleResponse(response);
};

const handleResponse = async (response) => {
    const json = await response.json();
    if (json.status === 'success') {
        return json.data;
    } else {
        const error = new Error('Serveri poolne viga.');
        error.json = json;
        throw error;
    }
};


/***/ })
/******/ ]);