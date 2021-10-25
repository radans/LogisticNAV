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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Icon = __webpack_require__(3);

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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Icon = __webpack_require__(3);

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
/* 5 */
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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const api = __webpack_require__(0);
const order = __webpack_require__(8);
const send = __webpack_require__(10);

// Sets up order selection form.
order.init();

// Sets up send form.
send.init();

document.addEventListener('click', async e => {
    if (e.target.className === 'vt-plans-remove') {
        const row = e.target.parentNode.parentNode.parentNode.parentNode;
        if (confirm(`Kustuta plaan "${row.dataset.name}"?`)) {
            const url = `/api/plan/${encodeURIComponent(row.dataset.plan)}`;
            await api.remove(url);
            window.scheduleFlash('Plaan on kustutatud.');
            window.location.reload();
        }
    }
}, false);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const Select = __webpack_require__(9);
const Submit = __webpack_require__(2);
const FormGroup = __webpack_require__(1);
const Button = __webpack_require__(4);
const FormHoc = __webpack_require__(5);
const inlineForm = __webpack_require__(6);
const api = __webpack_require__(0);

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
            const ordersOptions = orders.map(({ id, label }) => ({
                value: id,
                label: label
            }));
            ordersOptions.unshift({
                value: '0',
                label: 'Määramata'
            });
            this.setState({ orders: ordersOptions, ordersLoading: false });
        } catch (err) {
            window.showError('Viga tellimuste leidmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
    }

    render() {
        if (this.state.ordersLoading) {
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
            React.createElement(Select, {
                name: 'order_id',
                label: 'Tellimus',
                options: this.state.orders,
                value: values.order_id,
                error: errors.order_id,
                onChange: inputChange }),
            React.createElement(
                FormGroup,
                null,
                React.createElement(Submit, {
                    icon: 'save',
                    label: 'Salvesta',
                    disabled: loading }),
                React.createElement(
                    'span',
                    null,
                    ' ',
                    React.createElement(Button, {
                        href: '#',
                        icon: 'window-close-o',
                        label: 'Loobu',
                        onClick: this.remove })
                ),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
        );
    }
});

const submit = async (values, meta) => {
    const url = `/api/plan/update-order/${encodeURIComponent(meta.id)}`;
    await api.update(url, {
        order_id: values.order_id
    });
};

const success = values => {
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
        ReactDOM.render(React.createElement(PlansForm, {
            meta: meta,
            submit: submit,
            success: success,
            initial: initial }), holder);
    }, {
        ignore: e => {
            return !e.target.classList.contains('vt-plans-select');
        }
    });
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(1);

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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Checkbox = __webpack_require__(11);
const Submit = __webpack_require__(2);
const FormGroup = __webpack_require__(1);
const Button = __webpack_require__(4);
const FormHoc = __webpack_require__(5);
const inlineForm = __webpack_require__(6);
const api = __webpack_require__(0);

const SendForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.state = { people: [], peopleLoading: true };
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        inlineForm.removeEditor(this.props.meta.element);
    }

    async componentDidMount() {
        const planId = this.props.meta.id;
        const url = `/api/plan/email-receivers/${encodeURIComponent(planId)}`;
        try {
            const people = await api.get(url);
            const values = {};
            for (const person of people) {
                values[`person-${person.email}`] = person.selected;
            }
            this.props.changeValues(values, () => {
                this.setState({ people, peopleLoading: false });
            });
        } catch (err) {
            window.showError('Viga saajate laadimisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            throw err;
        }
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
        if (this.state.peopleLoading) {
            return React.createElement('div', { className: 'vt-loader' });
        }
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
            React.createElement(
                FormGroup,
                null,
                React.createElement(
                    FormGroup,
                    null,
                    'Vali plaani saajad.'
                ),
                this.state.people.map(person => React.createElement(Checkbox, {
                    key: `person-${person.email}`,
                    name: `person-${person.email}`,
                    label: (person.always ? '*' : '') + person.name,
                    checked: values[`person-${person.email}`],
                    onChange: inputChange })),
                React.createElement(Submit, {
                    icon: 'save',
                    label: 'Saada',
                    disabled: loading }),
                React.createElement(
                    'span',
                    null,
                    ' ',
                    React.createElement(Button, {
                        href: '#',
                        icon: 'window-close-o',
                        label: 'Loobu',
                        onClick: this.remove })
                ),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
        );
    }
});

const submit = async (values, meta) => {
    const userEmails = [];
    for (const key of Object.keys(values)) {
        if (values[key]) {
            const match = key.match(/person-(.+)$/);
            if (match) {
                userEmails.push(match[1]);
            }
        }
    }
    if (userEmails.length > 0) {
        const url = `/api/plan/send-to-salespeople/${encodeURIComponent(meta.id)}`;
        await api.update(url, { userEmails });
    }
};

const success = values => {
    window.scheduleFlash('Plaan on saadetud.');
    window.location.reload();
};

exports.init = () => {
    inlineForm.installPopupForm((cell, holder) => {
        const row = cell.parentNode;
        const meta = {
            element: holder,
            id: row.dataset.plan
        };
        const initial = {};
        ReactDOM.render(React.createElement(SendForm, {
            meta: meta,
            submit: submit,
            success: success,
            initial: initial }), holder);
    }, {
        ignore: e => {
            return !e.target.classList.contains('vt-plans-send');
        }
    });
};

/***/ }),
/* 11 */
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

/***/ })
/******/ ]);