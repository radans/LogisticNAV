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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Icon = __webpack_require__(4);

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
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Icon = __webpack_require__(4);

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
/* 6 */
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
/* 7 */
/***/ (function(module, exports) {

// Assumes single table with form on
// the page.

exports.installPopupForm = (fn, options) => {
    const actualOptions = options || {};
    document.addEventListener('click', e => {
        if (typeof actualOptions.ignore === 'function') {
            if (actualOptions.ignore(e)) {
                return;
            }
        }
        if (typeof actualOptions.only === 'function') {
            if (!actualOptions.only(e)) {
                return;
            }
        }
        const existing = document.querySelector('.vt-cell-editor');
        if (existing) {
            return;
        }
        const target = e.target;
        const cell = findAncestor(target, 'vt-cell-editable');
        if (!cell) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        cell.parentNode.classList.add('vt-row-highlight');
        const holder = document.createElement('div');
        holder.classList.add('vt-cell-editor');
        if (typeof actualOptions.extraClass === 'string') {
            holder.classList.add(actualOptions.extraClass);
        }
        if (cell.getBoundingClientRect().top > 500) {
            holder.classList.add('vt-cell-editor-top');
        }
        if (cell.getBoundingClientRect().left < 600) {
            holder.classList.add('vt-cell-editor-right');
        }
        const wrapper = cell.querySelector('.vt-relative');
        wrapper.appendChild(holder);
        fn(cell, holder, e);
    });
};

exports.removeEditor = holder => {
    const cell = findAncestor(holder, 'vt-cell-editable');
    const row = cell.parentNode;
    row.classList.remove('vt-row-highlight');
    ReactDOM.unmountComponentAtNode(holder);
    holder.remove();
};

const findAncestor = exports.findAncestor = (element, clazz) => {
    if (!element) {
        return null;
    }
    if (element.classList && element.classList.contains(clazz)) {
        return element;
    } else {
        return findAncestor(element.parentNode, clazz);
    }
};

/***/ }),
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const order = __webpack_require__(11);
const send = __webpack_require__(14);
const upload = __webpack_require__(15);

order.installFormHandler();
send.installSendHandler();
upload.installFormHandler();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(2);
const Select = __webpack_require__(12);
const Submit = __webpack_require__(3);
const FormGroup = __webpack_require__(0);
const Button = __webpack_require__(5);
const FormHoc = __webpack_require__(6);
const inlineForm = __webpack_require__(7);
const jsonScript = __webpack_require__(8);
const dateString = __webpack_require__(9);
const pickr = __webpack_require__(13);
const api = __webpack_require__(1);

const salespeople = jsonScript.load('orders-salespeople');
const salespeopleOptions = salespeople.map(({ id, name }) => ({
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
            const plansOptions = plans.map(({ id, label }) => ({
                value: id,
                label: label
            }));
            plansOptions.unshift({
                value: '0',
                label: 'Määramata'
            });
            this.setState({ plans: plansOptions, plansLoading: false });
        } catch (err) {
            window.showError('Viga plaanide leidmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.plansLoading) {
            return React.createElement('div', { className: 'vt-loader' });
        }
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
            { className: 'vt-form', onSubmit: submit },
            error && React.createElement(
                FormGroup,
                null,
                React.createElement(
                    'div',
                    { className: 'vt-form-error' },
                    error
                )
            ),
            React.createElement(TextInput, {
                name: 'vehicle',
                label: 'Auto number',
                value: values.vehicle,
                error: errors.vehicle,
                onChange: inputChange }),
            React.createElement(TextInput, {
                name: 'invoice',
                label: 'Arve number',
                value: values.invoice,
                error: errors.invoice,
                onChange: inputChange }),
            React.createElement(TextInput, {
                name: 'unload_date',
                label: 'Mahalaadimise kuup\xE4ev',
                value: values.unload_date,
                error: errors.unload_date,
                onChange: inputChange,
                inputRef: this.setDateInput,
                inputClass: 'vt-form-control-date' }),
            React.createElement(Select, {
                name: 'plan_id',
                label: 'Koormaplaan',
                options: this.state.plans,
                value: values.plan_id,
                error: errors.plan_id,
                onChange: inputChange }),
            React.createElement(Select, {
                name: 'salesperson',
                label: 'M\xFC\xFCgijuht',
                options: salespeopleOptions,
                value: values.salesperson,
                error: errors.salesperson,
                onChange: inputChange }),
            React.createElement(
                FormGroup,
                null,
                React.createElement(Submit, {
                    icon: 'save',
                    label: 'Salvesta',
                    disabled: loading }),
                '\xA0',
                React.createElement(Button, {
                    href: '#',
                    icon: 'window-close-o',
                    label: 'Loobu',
                    onClick: this.remove }),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
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
        unload_date: values.unload_date === '' ? null : dateString.fromEstonian(values.unload_date)
    });
};

const success = values => {
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
        ReactDOM.render(React.createElement(OrdersForm, {
            meta: meta,
            submit: submit,
            success: success,
            initial: initial }), holder);
    }, {
        ignore: e => {
            return e.target.href && !e.target.classList.contains('vt-orders-select');
        },
        only: e => {
            return inlineForm.findAncestor(e.target, 'vt-orders-edit');
        }
    });
};

/***/ }),
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const api = __webpack_require__(1);

exports.installSendHandler = () => {
    document.addEventListener('click', async e => {
        const target = e.target;
        if (target.classList.contains('vt-send-button')) {
            e.preventDefault();
            e.stopPropagation();
            const row = target.parentNode.parentNode.parentNode;
            let text = 'Saada tellimus vedajale?';
            if (row.dataset.sent > 0) {
                text = 'Tellimus on varem saadetud. Saada uuesti?';
            }
            if (confirm(text)) {
                try {
                    window.showLoader('Saadan e-posti...');
                    await api.save(`/api/order/send/${row.dataset.order}`, {});
                    window.scheduleFlash('Tellimus on vedajale saadetud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga tellimuse saatmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                } finally {
                    window.hideLoader();
                }
            }
        }
    });
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(2);
const Submit = __webpack_require__(3);
const FormGroup = __webpack_require__(0);
const Button = __webpack_require__(5);
const FormHoc = __webpack_require__(6);
const inlineForm = __webpack_require__(7);
const jsonScript = __webpack_require__(8);
const dateString = __webpack_require__(9);
const generateId = __webpack_require__(16);
const api = __webpack_require__(1);

const DocumentsForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
        this.state = { documentsLoading: false };
        this.setFileRef = this.setFileRef.bind(this);
        this.fileRef = null;
        this.fileChangeHandler = this.fileChangeHandler.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);
    }

    setFileRef(dom) {
        this.fileRef = dom;
    }

    fileChangeHandler(e) {
        this.props.changeValues(prevValues => {
            const documents = prevValues.documents.slice(0);
            for (const file of e.target.files) {
                documents.push({
                    ui_id: generateId(),
                    original_name: file.name,
                    comment: '',
                    file: file
                });
            }
            return { documents };
        }, () => {
            this.fileRef.value = '';
        });
    }

    commentChange(i, e) {
        const comment = e.target.value;
        this.props.changeValues(prevValues => {
            const documents = prevValues.documents.slice(0);
            documents[i] = Object.assign({}, documents[i], { comment });
            return { documents };
        });
    }

    async componentDidMount() {
        this.fileRef.addEventListener('change', this.fileChangeHandler);
        const orderId = this.props.meta.id;
        const url = `/api/order/upload-documents/${encodeURIComponent(orderId)}`;
        try {
            const documents = await api.get(url);
            for (const document of documents) {
                document.ui_id = generateId();
            }
            this.props.changeValues({ documents }, () => {
                this.setState({ documentsLoading: false });
            });
        } catch (err) {
            window.showError('Viga tellimuse olemasolevate dokumentide lugemisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.documentsLoading) {
            return React.createElement('div', { className: 'vt-loader' });
        }
        const {
            error,
            errors,
            values,
            loading,
            inputChange,
            submit
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
                'strong',
                { className: 'vt-text-green' },
                'Dokumendid'
            ),
            React.createElement(
                'span',
                { className: 'help-block' },
                'Dokumente saab kustutada tellimuse vaatest.'
            ),
            values.documents.map((document, i) => React.createElement(
                FormGroup,
                { key: document.ui_id },
                React.createElement(
                    'div',
                    { className: 'row' },
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(
                            'div',
                            { className: 'vt-orders-document-name' },
                            typeof document.id === 'number' && React.createElement(
                                'a',
                                { href: `/order/documents/${document.id}`, target: '_blank' },
                                document.original_name
                            ),
                            typeof document.id === 'undefined' && React.createElement(
                                'span',
                                null,
                                document.original_name
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'col-xs-6' },
                        React.createElement(TextInput, {
                            id: `documents-files-${document.ui_id}`,
                            inputClass: 'input-sm',
                            placeholder: 'Kommentaar',
                            value: document.comment,
                            onChange: e => this.commentChange(i, e),
                            group: false })
                    )
                )
            )),
            React.createElement(TextInput, {
                name: 'files',
                type: 'file',
                id: 'documents-files',
                error: errors.files,
                label: 'Lae \xFCles',
                multiple: true,
                inputRef: this.setFileRef }),
            React.createElement(
                FormGroup,
                null,
                React.createElement(Submit, {
                    icon: 'save',
                    label: 'Salvesta',
                    disabled: loading }),
                '\xA0',
                React.createElement(Button, {
                    href: '#',
                    icon: 'window-close-o',
                    label: 'Loobu',
                    onClick: this.remove }),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
        );
    }
});

const submit = async (values, meta) => {
    const data = new FormData();
    let fileIndex = 0;
    values.documents.forEach((document, i) => {
        if (document.file) {
            data.append('files', document.file);
            data.append(`comment-${fileIndex}`, document.comment);
            fileIndex++;
        } else {
            data.append(`existing-file-comment-${document.id}`, document.comment);
        }
    });
    const url = `/api/order/upload-documents/${encodeURIComponent(meta.id)}`;
    return api.updateFile(url, data);
};

const success = values => {
    window.scheduleFlash('Muudatused on salvestatud.');
    window.location.reload();
};

exports.installFormHandler = () => {
    inlineForm.installPopupForm((cell, holder) => {
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.order
        };
        const initial = { documents: [] };
        ReactDOM.render(React.createElement(DocumentsForm, {
            meta: meta,
            submit: submit,
            success: success,
            initial: initial }), holder);
    }, {
        extraClass: 'vt-orders-documents-editor',
        only: e => {
            return !!inlineForm.findAncestor(e.target, 'vt-orders-documents-link');
        }
    });
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

// Helper to generate unique ids wrt to
// current execution context.

let id = 0;

module.exports = () => {
    return (id++).toString();
};


/***/ })
/******/ ]);