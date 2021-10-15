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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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


/***/ }),
/* 2 */
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
/* 3 */
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Icon = __webpack_require__(5);

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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const Icon = __webpack_require__(5);

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
/* 7 */
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
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const remove = __webpack_require__(10);
const upload = __webpack_require__(11);
const cancel = __webpack_require__(13);
const send = __webpack_require__(17);
const photos = __webpack_require__(18);
const removeDocument = __webpack_require__(19);

remove.init();
upload.init();
cancel.init();
send.init();
photos.init();
removeDocument.init();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const inlineForm = __webpack_require__(3);
const jsonScript = __webpack_require__(0);
const api = __webpack_require__(1);

exports.init = () => {
    document.addEventListener('click', async e => {
        const target = e.target;
        const button = inlineForm.findAncestor(target, 'vt-order-photo-remove');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Kustuta pilt?')) {
                const wrapper = button.parentNode;
                const data = jsonScript.load('order-data');
                const id = wrapper.dataset.id;
                try {
                    await api.remove(`/api/order/photo/${id}`);
                    window.scheduleFlash('Pilt on kustutatud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga pildi kustutamisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                }
            }
        }
    }, false);
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const TextInput = __webpack_require__(12);
const Submit = __webpack_require__(4);
const FormGroup = __webpack_require__(2);
const Button = __webpack_require__(6);
const FormHoc = __webpack_require__(7);
const jsonScript = __webpack_require__(0);
const Errors = __webpack_require__(8);
const api = __webpack_require__(1);

const UploadForm = FormHoc(class extends React.Component {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
        this.setFileRef = this.setFileRef.bind(this);
        this.fileRef = null;
    }

    submit(e) {
        this.props.submit(e, this.fileRef.files);
    }

    setFileRef(dom) {
        this.fileRef = dom;
    }

    render() {
        const {
            meta,
            error,
            errors,
            values,
            loading,
            inputChange
        } = this.props;
        const initial = meta.initial;
        return React.createElement(
            'form',
            { className: 'vt-form-full', onSubmit: this.submit },
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
                name: 'logo',
                type: 'file',
                label: 'Pildid',
                id: 'settings-logo',
                error: errors.files,
                inputRef: this.setFileRef,
                multiple: true }),
            React.createElement(
                FormGroup,
                null,
                React.createElement(Submit, {
                    icon: 'save',
                    label: 'Lae \xFCles',
                    disabled: loading }),
                loading && React.createElement('div', { className: 'vt-loader vt-loader-small vt-loader-top-right' })
            )
        );
    }
});

const submit = async (values, meta, files) => {
    if (files.length > 0) {
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('files', files[i]);
        }
        const url = `/api/order/camera/upload/${meta.id}`;
        return api.updateFile(url, data);
    }
};

const validate = (values, files) => {
    const errors = new Errors();
    if (files.length > 0) {
        let badFile = false;
        for (const file of files) {
            if (!file.name.match(/\.(jpg|JPG|jpeg|JPEG)$/)) {
                badFile = true;
            }
        }
        if (badFile) {
            errors.add('files', 'Palun kasuta JPG faile.');
        }
    } else {
        errors.add('files', 'Failid on jäänud valimata.');
    }
    return errors;
};

const success = () => {
    window.scheduleFlash('Pildid on üles laetud.');
    window.location.reload();
};

exports.init = () => {
    const data = jsonScript.load('order-data');
    const meta = { id: data.id };
    ReactDOM.render(React.createElement(UploadForm, {
        meta: meta,
        submit: submit,
        success: success,
        validate: validate }), document.getElementById('upload-form-root'));
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(2);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const Textarea = __webpack_require__(14);
const Submit = __webpack_require__(4);
const FormGroup = __webpack_require__(2);
const Button = __webpack_require__(6);
const Checkbox = __webpack_require__(15);
const FormHoc = __webpack_require__(7);
const inlineForm = __webpack_require__(3);
const validate = __webpack_require__(16);
const jsonScript = __webpack_require__(0);
const api = __webpack_require__(1);

const CancelForm = FormHoc(class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.remove = this.remove.bind(this);
    }

    remove(e) {
        e.preventDefault();
        removeAt(this.props.values.element);
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
            React.createElement(Checkbox, {
                name: 'cancelled',
                id: 'order-cancelled',
                label: 'T\xFChistatud',
                checked: values.cancelled,
                onChange: inputChange }),
            React.createElement(Textarea, {
                name: 'cancel_text',
                id: 'order-cancel-text',
                label: 'Selgitus',
                rows: '3',
                placeholder: 'T\xFChistamise selgitus',
                value: values.cancel_text,
                error: errors.cancel_text,
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

const submit = async values => {
    const url = `/api/order/update-cancel/${encodeURIComponent(values.id)}`;
    await api.update(url, {
        cancelled: values.cancelled,
        cancel_text: values.cancel_text
    });
};

const success = values => {
    window.showFlash('Tellimuse andmed on salvestatud.');
    window.location.reload();
};

const removeAt = element => {
    ReactDOM.unmountComponentAtNode(element);
};

exports.init = () => {
    const cancelButton = document.getElementById('cancel-button');
    cancelButton.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const cancelHolder = document.getElementById('cancel-holder');
        const data = jsonScript.load('order-data');
        const initial = {
            element: cancelHolder,
            cancelled: data.cancelled,
            cancel_text: data.cancel_text || '',
            id: data.id
        };
        if (cancelHolder.children.length === 0) {
            ReactDOM.render(React.createElement(CancelForm, {
                submit: submit,
                success: success,
                validate: validate,
                initial: initial }), cancelHolder);
        }
    }, false);
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const FormGroup = __webpack_require__(2);

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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Errors = __webpack_require__(8);

// Shared validator for user settings.

module.exports = ({cancelled, cancel_text}) => {
    const errors = new Errors();
    if (cancelled) {
        if (cancel_text === '') {
            errors.add('cancel_text', 'Tühistamise selgitus on jäänud sisestamata.');
        }        
    }
    return errors;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const jsonScript = __webpack_require__(0);
const api = __webpack_require__(1);

// Helper to send the order mail.

exports.init = () => {
    const sendButton = document.getElementById('send-button');
    if (!sendButton) {
        return;
    }
    sendButton.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();
        const data = jsonScript.load('order-data');
        let text = 'Saada tellimus vedajale?';
        if (data.sent_date !== null) {
            text = 'Tellimus on varem saadetud. Saada uuesti?';
        }
        if (confirm(text)) {
            try {
                window.showLoader('Saadan e-posti...');
                await api.save(`/api/order/send/${data.id}`, {});
                window.scheduleFlash('Tellimus on vedajale saadetud.');
                window.location.reload();
            } catch (err) {
                window.showError('Viga tellimuse saatmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            } finally {
                window.hideLoader();
            }
        }
    }, false);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const jsonScript = __webpack_require__(0);

exports.init = () => {
    const pswpElement = document.querySelector('.pswp');
    if (!pswpElement) {
        throw new Error('No pswp element.');
    }
    const title = jsonScript.load('order-data').order_name;
    const slides = [];
    const items = document.querySelectorAll('.vt-order-photo-wrap');
    for (const item of items) {
        const link = item.querySelector('a');
        const img = link.querySelector('img');
        slides.push({
            src: link.href,
            title: title,
            msrc: img.src,
            w: 2048,
            h: 1536
        });
        img.addEventListener('click', e => {
            const index = parseInt(item.dataset.index, 10);
            const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, slides, {
                index,
                history: false,
                shareButtons: [{
                    id: 'download',
                    label: 'Tõmba arvutisse',
                    url: '{{raw_image_url}}',
                    download: true
                }]
            });
            gallery.init();
            e.preventDefault();
            e.stopPropagation();
        }, false);
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const jsonScript = __webpack_require__(0);
const api = __webpack_require__(1);

exports.init = () => {
    document.addEventListener('click', async e => {
        const target = e.target;
        if (target.classList.contains('vt-order-document-remove')) {
            e.preventDefault();
            e.stopPropagation();
            const documentId = target.dataset.document;
            const name = target.dataset.name;
            if (confirm(`Kustuta dokument ${name}?`)) {
                try {
                    await api.remove(`/api/order/document/${documentId}`);
                    window.scheduleFlash('Dokument on kustutatud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga dokumendi kustutamisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                }
            }
        }
    }, false);
};

/***/ })
/******/ ]);