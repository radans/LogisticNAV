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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
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

const TextInput = __webpack_require__(3);
const Textarea = __webpack_require__(4);
const Checkbox = __webpack_require__(5);
const Submit = __webpack_require__(6);
const FormGroup = __webpack_require__(0);
const Button = __webpack_require__(7);
const FormHoc = __webpack_require__(8);
const inlineForm = __webpack_require__(9);
const validate = __webpack_require__(10);
const api = __webpack_require__(12);

const root = document.getElementById('address-form-root');

const AddressForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
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
            React.createElement(Textarea, {
                name: 'address',
                id: 'address-address',
                label: 'Aadress',
                rows: '5',
                placeholder: 'Aadress',
                value: values.address,
                error: errors.address,
                onChange: inputChange }),
            React.createElement(Textarea, {
                name: 'notes',
                id: 'address-notes',
                label: 'M\xE4rkused',
                rows: '2',
                placeholder: 'M\xE4rkused',
                value: values.notes,
                onChange: inputChange }),
            React.createElement(TextInput, {
                name: 'name',
                id: 'address-name',
                label: 'Kliendi/tellimuse nimi',
                value: values.name,
                error: errors.name,
                onChange: inputChange }),
            React.createElement(TextInput, {
                name: 'region',
                id: 'address-region',
                label: 'Regioon',
                value: values.region,
                error: errors.region,
                onChange: inputChange }),
            React.createElement(TextInput, {
                name: 'marker',
                id: 'address-marker',
                label: 'T\xE4his',
                value: values.marker,
                error: errors.marker,
                onChange: inputChange }),
            React.createElement(Checkbox, {
                name: 'archived',
                id: 'address-archived',
                label: 'Arhiveeritud',
                checked: values.archived,
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
    const url = `/api/address`;
    await api.save(url, {
        name: values.name,
        notes: values.notes,
        archived: values.archived,
        region: values.region,
        address: values.address,
        marker: values.marker
    });
};

const success = values => {
    window.scheduleFlash('Aadressi andmed on salvestatud.');
    window.location = '/addresses';
};

const initial = {
    name: '',
    notes: '',
    archived: false,
    region: '',
    address: '',
    marker: ''
};

ReactDOM.render(React.createElement(AddressForm, {
    submit: submit,
    success: success,
    validate: validate,
    initial: initial }), root);

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(0);

const Textarea = module.exports = props => {
    const {
        id,
        name,
        label,
        placeholder,
        onChange,
        rows,
        value,
        error
    } = props;
    const actualRows = rows || '3';
    return React.createElement(
        FormGroup,
        { error: error },
        label && React.createElement(
            'label',
            { htmlFor: id },
            label
        ),
        React.createElement('textarea', { className: 'form-control', id: id, name: name, rows: actualRows,
            placeholder: placeholder, onChange: onChange, value: value }),
        error && React.createElement(
            'span',
            { className: 'help-block' },
            error
        )
    );
};

/***/ }),
/* 5 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const Errors = __webpack_require__(11);

module.exports = ({address}) => {
    const errors = new Errors();
    if (address === '') {
        errors.add('address', 'Aadress on jäänud sisestamata.');
    }    
    return errors;
};


/***/ }),
/* 11 */
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
/* 12 */
/***/ (function(module, exports) {

exports.get = async (url) => {
    const response = await fetch(url, {credentials: 'include'});
    return handleResponse(response);
};

exports.save = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'include'
    });
    return handleResponse(response);
};

exports.update = async (url, data) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
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