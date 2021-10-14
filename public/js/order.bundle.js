/******/
(function (modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/
    var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/
        if (installedModules[moduleId]) {
            /******/
            return installedModules[moduleId].exports;
            /******/
        }
        /******/ 		// Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/            i: moduleId,
            /******/            l: false,
            /******/            exports: {}
            /******/
        };
        /******/
        /******/ 		// Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/
        return module.exports;
        /******/
    }

    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/
    __webpack_require__.d = function (exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/                configurable: false,
                /******/                enumerable: true,
                /******/                get: getter
                /******/
            });
            /******/
        }
        /******/
    };
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function (module) {
        /******/
        var getter = module && module.__esModule ?
            /******/            function getDefault() {
                return module['default'];
            } :
            /******/            function getModuleExports() {
                return module;
            };
        /******/
        __webpack_require__.d(getter, 'a', getter);
        /******/
        return getter;
        /******/
    };
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ 	// __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 7);
    /******/
})
    /************************************************************************/
    /******/ ([
    /* 0 */
    /***/ (function (module, exports) {

        module.exports = ({children, size, error}) => {
            const classes = ['form-group'];
            if (size) {
                classes.push(`form-group-${size}`);
            }
            if (error) {
                classes.push(`has-error`);
            }
            return React.createElement(
                'div',
                {className: classes.join(' ')},
                children
            );
        };

        /***/
    }),
    /* 1 */
    /***/ (function (module, exports) {

// Helper to display Font-Awesome icons.

        module.exports = ({name, id, extraClass}) => {
            const classes = ['fa', `fa-${name}`];
            if (extraClass) {
                classes.push(extraClass);
            }
            return React.createElement('i', {className: classes.join(' '), 'aria-hidden': 'true', id: id});
        };

        /***/
    }),
    /* 2 */
    /***/ (function (module, exports, __webpack_require__) {

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
                multiple: props.multiple
            });
            if (!group) {
                return input();
            }
            return React.createElement(
                FormGroup,
                {size: props.size, error: error},
                props.label && React.createElement(
                'label',
                {htmlFor: id},
                props.label
                ),
                input(),
                error && React.createElement(
                'span',
                {className: 'help-block'},
                error
                )
            );
        };

        /***/
    }),
    /* 3 */
    /***/ (function (module, exports, __webpack_require__) {

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
                {error: error},
                label && React.createElement(
                'label',
                {htmlFor: id},
                label
                ),
                React.createElement('textarea', {
                    className: 'form-control', id: id, name: name, rows: actualRows,
                    placeholder: placeholder, onChange: onChange, value: value
                }),
                error && React.createElement(
                'span',
                {className: 'help-block'},
                error
                )
            );
        };

        /***/
    }),
    /* 4 */
    /***/ (function (module, exports) {

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


        /***/
    }),
    /* 5 */
    /***/ (function (module, exports) {

// Returns swap-pair.

        exports.up = (i, length) => {
            if (i <= 0) {
                return [i, length - 1];
            } else if (i <= length - 1) {
                return [i, i - 1];
            } else {
                return [i, i];
            }
        };

// Returns swap-pair.

        exports.down = (i, length) => {
            if (i >= length - 1) {
                return [i, 0];
            } else if (i >= 0) {
                return [i, i + 1];
            } else {
                return [i, i];
            }
        };

// Swaps properties at the given positions.
// Properties are set on fresh objects.

        exports.swapProps = (array, i, j) => {
            const x = Object.assign({}, array[i]);
            const y = Object.assign({}, array[j]);
            array[i] = y;
            array[j] = x;
        };


        /***/
    }),
    /* 6 */
    /***/ (function (module, exports) {

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


        /***/
    }),
    /* 7 */
    /***/ (function (module, exports, __webpack_require__) {

        const Icon = __webpack_require__(1);
        const TextInput = __webpack_require__(2);
        const Textarea = __webpack_require__(3);
        const Checkbox = __webpack_require__(8);
        const Submit = __webpack_require__(9);
        const FormGroup = __webpack_require__(0);
        const Button = __webpack_require__(10);
        const Select = __webpack_require__(11);
        const LoadingList = __webpack_require__(12);
        const FormHoc = __webpack_require__(14);
        const validate = __webpack_require__(15);
        const jsonScript = __webpack_require__(17);
        const debounce = __webpack_require__(18);
        const dateString = __webpack_require__(6);
        const pickr = __webpack_require__(4);
        const api = __webpack_require__(19);
        const move = __webpack_require__(5);

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
                    window.showError('Viga aadresside leidmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                    throw err;
                }
            }

            // Updates the display of loadings occuring
            // on the same day.

            componentWillReceiveProps(props) {
                const date = props.values.loading_date;
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
                    window.showError('Viga sama päeva laadimiste leidmisel. Palun proovi' + ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                    throw err;
                }
            }

            selectAddress(e, addressId) {
                e.preventDefault();
                const address = this.state.addresses.find(address => address.id === addressId);
                if (address) {
                    const type = this.state.editingOnload ? 'onload' : 'unload';
                    const copy = this.props.values[type].slice(0);
                    const index = copy.length - 2;
                    const editedAddress = copy[index];
                    if (editedAddress) {
                        copy[index] = Object.assign({}, editedAddress, {address: address.address});
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
                    inputChange
                } = this.props;
                const {
                    loadings,
                    addresses
                } = this.state;
                return React.createElement(
                    'form',
                    {className: 'vt-form-full', onSubmit: submit},
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-12'},
                            error && React.createElement(
                            FormGroup,
                            null,
                            React.createElement(
                                'div',
                                {className: 'vt-form-error'},
                                error
                            )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(TextInput, {
                                name: 'name',
                                id: 'order-name',
                                label: 'Koorma nimetus',
                                placeholder: 'Koorma nimetus',
                                value: values.name,
                                error: errors.name,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(TextInput, {
                                name: 'loading_date',
                                id: 'order-loading_date',
                                label: 'Laadimise kuup\xE4ev',
                                placeholder: 'Laadimise kuup\xE4ev',
                                value: values.loading_date,
                                error: errors.loading_date,
                                onChange: inputChange,
                                inputRef: this.setLoadingDateInput,
                                inputClass: 'vt-form-control-date'
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(Select, {
                                name: 'company',
                                id: 'order-company',
                                label: 'Vedaja',
                                options: companyOptions,
                                value: values.company,
                                error: errors.company,
                                onChange: inputChange
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(TextInput, {
                                name: 'country',
                                id: 'order-country',
                                label: 'Riik',
                                placeholder: 'Riik',
                                value: values.country,
                                error: errors.country,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(TextInput, {
                                name: 'price',
                                id: 'order-price',
                                label: 'Hind',
                                placeholder: 'Hind',
                                value: values.price,
                                error: errors.price,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(TextInput, {
                                name: 'companyWho',
                                id: 'company-who',
                                label: 'Kellelt',
                                placeholder: 'Kellelt',
                                value: values.who,
                                error: errors.who,
                                onChange: inputChange
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(Checkbox, {
                                name: 'full_load',
                                id: 'order-full_load',
                                label: 'T\xE4iskoorem',
                                checked: values.full_load,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(Checkbox, {
                                name: 'import',
                                id: 'order-import',
                                label: 'Import',
                                checked: values.import,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-2'},
                            React.createElement(Checkbox, {
                                name: 'client_transport',
                                id: 'order-client_transport',
                                label: 'Kliendi transport',
                                checked: values.client_transport,
                                onChange: inputChange
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-3'},
                            React.createElement(Textarea, {
                                name: 'notes',
                                id: 'order-notes',
                                label: 'M\xE4rkused',
                                rows: '2',
                                placeholder: 'M\xE4rkused',
                                value: values.notes,
                                onChange: inputChange
                            })
                        ),
                        React.createElement(
                            'div',
                            {className: 'col-xs-3'},
                            React.createElement(Textarea, {
                                name: 'info',
                                id: 'order-info',
                                label: 'Lisainfo vedajale',
                                rows: '2',
                                placeholder: 'Lisainfo vedajale',
                                value: values.info,
                                onChange: inputChange
                            })
                        )
                    ),
                    React.createElement(
                        'div',
                        {className: 'row'},
                        React.createElement(
                            'div',
                            {className: 'col-xs-7'},
                            React.createElement(
                                FormGroup,
                                null,
                                React.createElement(
                                    'strong',
                                    {className: 'vt-text-green'},
                                    'Pealelaadimise kohad'
                                ),
                                React.createElement('br', null),
                                'Uue pealelaadimise koha lisamiseks t\xE4ida k\xF5ige alumine koht. Ilma aadressita asukohti ei salvestata.'
                            ),
                            loadings.length > 0 && React.createElement(
                            FormGroup,
                            null,
                            'Samal p\xE4eval lisaks toimuvad laadimised:',
                            React.createElement(
                                'table',
                                {className: 'table table-bordered vt-order-loadings'},
                                React.createElement(
                                    'tbody',
                                    null,
                                    loadings.map(loading => React.createElement(
                                        'tr',
                                        {key: `${loading.order_id}-${loading.time}`},
                                        React.createElement(
                                            'th',
                                            null,
                                            loading.time
                                        ),
                                        React.createElement(
                                            'td',
                                            null,
                                            loading.order_name
                                        )
                                    ))
                                )
                            )
                            ),
                            React.createElement(LoadingList, {
                                timeEdit: true,
                                list: values.onload,
                                onChange: this.onOnloadChange,
                                error: errors.onload
                            }),
                            React.createElement(
                                FormGroup,
                                null,
                                React.createElement(
                                    'strong',
                                    {className: 'vt-text-green'},
                                    'Mahalaadimise kohad'
                                ),
                                React.createElement('br', null),
                                'Uue mahalaadimise koha lisamiseks t\xE4ida k\xF5ige alumine koht. Ilma aadressita asukohti ei salvestata.'
                            ),
                            React.createElement(LoadingList, {
                                list: values.unload,
                                onChange: this.onUnloadChange,
                                showNumbers: true,
                                error: errors.unload
                            }),
                            React.createElement(
                                FormGroup,
                                null,
                                React.createElement(Submit, {
                                    icon: 'save',
                                    label: 'Salvesta2',
                                    disabled: loading
                                }),
                                '\xA0',
                                React.createElement(Button, {
                                    href: '/orders',
                                    icon: 'window-close-o',
                                    label: 'Loobu'
                                }),
                                loading && React.createElement('div', {className: 'vt-loader vt-loader-small vt-loader-top-right'})
                            )
                        )
                    ),
                    addresses.length > 0 && React.createElement(
                    'div',
                    {className: 'vt-address-finder'},
                    React.createElement(
                        'div',
                        {className: 'vt-address-finder-close'},
                        React.createElement(
                            'a',
                            {href: '#', onClick: this.closeFinder},
                            React.createElement(Icon, {name: 'close'})
                        )
                    ),
                    addresses.map(address => React.createElement(
                        'a',
                        {
                            key: `address-${address.id}`, href: '#', className: 'vt-address-item',
                            onClick: e => this.selectAddress(e, address.id)
                        },
                        address.address
                    ))
                    )
                );
            }
        });

        const postprocessValues = values => {
            const copy = Object.assign({}, values);
            copy.loading_date = dateString.fromEstonian(values.loading_date);
            copy.company = copy.company === '0' ? null : copy.company;
            copy.unload = copy.unload.map(place => Object.assign({}, place, {
                date: place.date === '' ? null : dateString.fromEstonian(place.date),
                time: place.time === '' ? null : place.time
            }));
            return copy;
        };

        const submit = values => {
            console.log('values', values);
            if (values.id) {
                const url = `/api/order/update/${encodeURIComponent(values.id)}`;
                return api.update(url, postprocessValues(values));
            } else {
                const url = '/api/order/new';
                console.log('values', values)
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
            companyWho: '',
            country: '',
            full_load: true,
            who: '',
            import: false,
            client_transport: false,
            onload: [{
                address: 'Lasita Maja AS, Risu tee 2, Pihva küla, 61407' + ' Tähtvere vald, Tartumaa, Estonia 58.355089, 26.592400',
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
            if (data.price !== null) {
                initial.price = data.price.toString();
            }
            initial.companyWho = data.companyWho;
            initial.who = data.who;
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

        ReactDOM.render(React.createElement(OrderForm, {
            submit: submit,
            success: success,
            validate: validate,
            initial: initial
        }), root);

        /***/
    }),
    /* 8 */
    /***/ (function (module, exports) {

        module.exports = props => {
            return React.createElement(
                'div',
                {className: 'checkbox', style: props.style},
                React.createElement(
                    'label',
                    null,
                    React.createElement('input', {
                        type: 'checkbox',
                        name: props.name,
                        checked: props.checked,
                        onChange: props.onChange,
                        defaultChecked: props.defaultChecked,
                        value: props.value
                    }),
                    ' ',
                    props.label
                )
            );
        };

        /***/
    }),
    /* 9 */
    /***/ (function (module, exports, __webpack_require__) {

        const Icon = __webpack_require__(1);

        module.exports = props => {
            return React.createElement(
                'button',
                {type: 'submit', className: 'btn btn-default', disabled: !!props.disabled},
                props.icon && React.createElement(Icon, {name: props.icon}),
                ' ',
                props.label
            );
        };

        /***/
    }),
    /* 10 */
    /***/ (function (module, exports, __webpack_require__) {

        var _extends = Object.assign || function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };

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
                    onClick: props.onClick
                }),
                props.icon && React.createElement(Icon, {name: props.icon}),
                ' ',
                props.label
            );
        };

        /***/
    }),
    /* 11 */
    /***/ (function (module, exports, __webpack_require__) {

        const FormGroup = __webpack_require__(0);

        module.exports = props => {
            const options = props.options;
            const error = props.error;
            return React.createElement(
                FormGroup,
                {size: props.size, error: error},
                React.createElement(
                    'label',
                    {htmlFor: props.id},
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
                        defaultValue: props.defaultValue
                    },
                    options.map(option => React.createElement(
                        'option',
                        {
                            key: `option-${option.value}`,
                            value: option.value
                        },
                        option.label
                    ))
                ),
                error && React.createElement(
                'span',
                {className: 'help-block'},
                error
                )
            );
        };

        /***/
    }),
    /* 12 */
    /***/ (function (module, exports, __webpack_require__) {

        const FormGroup = __webpack_require__(0);
        const Loading = __webpack_require__(13);
        const move = __webpack_require__(5);
        const dateString = __webpack_require__(6);

        const today = () => {
            return new Date().toISOString().substring(0, 10);
        };

// Helper to keep list with loading locations.

        module.exports = class LoadingList extends React.PureComponent {

            constructor(props) {
                super(props);
                this.onUp = this.onUp.bind(this);
                this.onDown = this.onDown.bind(this);
                this.onChange = this.onChange.bind(this);
                this.onTimeChange = this.onTimeChange.bind(this);
                this.onDateChange = this.onDateChange.bind(this);
            }

            // Moves element at the position into
            // the given directory.

            move(dir, i) {
                const copy = this.props.list.slice(0);
                if (copy.length < 3) {
                    return;
                }
                const [j, k] = move[dir](i, copy.length - 1);
                move.swapProps(copy, j, k);
                this.props.onChange(copy, false);
            }

            // Moves onloading address one position up.

            onUp(i) {
                this.move('up', i);
            }

            // Moves onloading address one position down.

            onDown(i) {
                this.move('down', i);
            }

            // Sets the address value at the given index.

            onChange(i, value) {
                const copy = this.props.list.slice(0);
                copy[i] = Object.assign({}, copy[i], {address: value});
                if (i === copy.length - 1) {
                    copy.push({
                        address: '',
                        time: this.props.showNumbers ? '' : '08:30',
                        date: ''
                    });
                }
                this.props.onChange(copy, true);
            }

            // Sets the time value at the given index.

            onTimeChange(i, value) {
                const copy = this.props.list.slice(0);
                copy[i] = Object.assign({}, copy[i], {time: value});
                this.props.onChange(copy, false);
            }

            // Sets the date value at the given index.

            onDateChange(i, value) {
                const copy = this.props.list.slice(0);
                copy[i] = Object.assign({}, copy[i], {date: value});
                this.props.onChange(copy, false);
            }

            render() {
                return React.createElement(
                    'div',
                    null,
                    this.props.list.map((place, i, places) => React.createElement(
                        FormGroup,
                        {key: `load-${i}`},
                        React.createElement(Loading, {
                            index: i,
                            address: place.address,
                            orderable: i < places.length - 1,
                            onUp: this.onUp,
                            onDown: this.onDown,
                            onChange: this.onChange,
                            onTimeChange: this.onTimeChange,
                            onDateChange: this.onDateChange,
                            timeEdit: this.props.timeEdit,
                            time: place.time,
                            date: place.date,
                            showNumbers: this.props.showNumbers,
                            error: this.props.error
                        })
                    ))
                );
            }
        };

        /***/
    }),
    /* 13 */
    /***/ (function (module, exports, __webpack_require__) {

        const Icon = __webpack_require__(1);
        const Textarea = __webpack_require__(3);
        const TextInput = __webpack_require__(2);
        const pickr = __webpack_require__(4);

        const LOADING_TIMES = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

        const UNLOADING_TIMES = [''];

        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                UNLOADING_TIMES.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            }
        }

        module.exports = class Loading extends React.PureComponent {

            constructor(props) {
                super(props);
                this.onChange = this.onChange.bind(this);
                this.onUp = this.onUp.bind(this);
                this.onDown = this.onDown.bind(this);
                this.onTimeChange = this.onTimeChange.bind(this);
                this.onDateChange = this.onDateChange.bind(this);
                this.setDateInput = this.setDateInput.bind(this);
                this.dateInput = null;
                this.dateCalendar = null;
            }

            // Calls the onChange callback with the address index
            // and the changed address value.

            onChange(e) {
                this.props.onChange(this.props.index, e.target.value);
            }

            // Calls the callback onloadUp with the address index.

            onUp(e) {
                e.preventDefault();
                this.props.onUp(this.props.index);
            }

            // Calls the callback onloadDown with the address index.

            onDown(e) {
                e.preventDefault();
                this.props.onDown(this.props.index);
            }

            onTimeChange(e) {
                this.props.onTimeChange(this.props.index, e.target.value);
            }

            onDateChange(e) {
                this.props.onDateChange(this.props.index, e.target.value);
            }

            setDateInput(e) {
                if (this.dateCalendar) {
                    this.dateCalendar.destroy();
                }
                this.dateInput = e;
                this.dateCalendar = pickr(this.dateInput, (selectedDates, date) => {
                    this.props.onDateChange(this.props.index, date);
                }, true);
            }

            render() {
                const {
                    address,
                    orderable,
                    time,
                    date,
                    error,
                    timeEdit,
                    showNumbers // also used for toggling the date editor
                } = this.props;
                const classes = ['vt-order-form-load'];
                if (timeEdit) {
                    classes.push('vt-order-form-load-with-time');
                }
                if (showNumbers) {
                    classes.push('vt-order-form-load-with-numbers');
                }
                return React.createElement(
                    'div',
                    {className: classes.join(' ')},
                    showNumbers && React.createElement(
                    'div',
                    {className: 'vt-order-form-load-number'},
                    this.props.index + 1,
                    '.'
                    ),
                    showNumbers && React.createElement(
                    'div',
                    {className: 'vt-order-form-load-date'},
                    React.createElement(TextInput, {
                        value: date,
                        group: false,
                        onChange: this.onDateChange,
                        inputRef: this.setDateInput,
                        inputClass: 'vt-form-control-date'
                    })
                    ),
                    showNumbers && React.createElement(
                    'select',
                    {
                        className: 'form-control vt-order-form-unload-time',
                        onChange: this.onTimeChange, value: time
                    },
                    UNLOADING_TIMES.map(time => React.createElement(
                        'option',
                        {key: time, value: time},
                        time
                    ))
                    ),
                    timeEdit && React.createElement(
                    'select',
                    {
                        className: 'form-control vt-order-form-load-time',
                        onChange: this.onTimeChange, value: time
                    },
                    LOADING_TIMES.map(time => React.createElement(
                        'option',
                        {key: time, value: time},
                        time
                    ))
                    ),
                    React.createElement(Textarea, {rows: '2', onChange: this.onChange, value: address, error: error}),
                    orderable && React.createElement(
                    'div',
                    {className: 'vt-order-form-load-top'},
                    React.createElement(
                        'a',
                        {
                            href: '#', className: 'btn btn-default btn-xs',
                            onClick: this.onUp
                        },
                        React.createElement(Icon, {name: 'arrow-up'})
                    )
                    ),
                    orderable && React.createElement(
                    'div',
                    {className: 'vt-order-form-load-bottom'},
                    React.createElement(
                        'a',
                        {
                            href: '#', className: 'btn btn-default btn-xs',
                            onClick: this.onDown
                        },
                        React.createElement(Icon, {name: 'arrow-down'})
                    )
                    )
                );
            }
        };

        /***/
    }),
    /* 14 */
    /***/ (function (module, exports) {

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
                            values: Object.assign({}, prevValues, {[name]: value})
                        };
                    });
                }

                changeValues(values, cb) {
                    if (typeof values === 'object') {
                        this.setState(prevState => {
                            const prevValues = prevState.values;
                            return {values: Object.assign({}, prevValues, values)};
                        }, cb);
                    } else if (typeof values === 'function') {
                        this.setState(prevState => {
                            const prevValues = prevState.values;
                            const change = values(prevValues);
                            return {values: Object.assign({}, prevValues, change)};
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
                            this.setState({errors: errors.extract()});
                            return;
                        }
                    }
                    try {
                        this.setState({loading: true});
                        const data = await submit(values, meta, extra);
                        if (typeof success === 'function') {
                            success(values, data, this, meta);
                        }
                    } catch (err) {
                        if (err.json) {
                            if (err.json.errors) {
                                this.setState({errors: err.json.errors});
                            } else if (err.json.message) {
                                this.setState({error: err.json.message});
                            }
                        } else {
                            window.showSaveError();
                            throw err;
                        }
                    } finally {
                        // success handler might cause unmount.
                        if (this.mounted) {
                            this.setState({loading: false});
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
                        changeValues: this.changeValues
                    });
                }
            };
        };

        /***/
    }),
    /* 15 */
    /***/ (function (module, exports, __webpack_require__) {

        const Errors = __webpack_require__(16);

// Shared validator for order data.

        module.exports = (values) => {
            const {
                name,
                loading_date,
                country,
                price,
                companyWho,
                onload,
                unload
            } = values;
            const errors = new Errors();
            if (name.trim() === '') {
                errors.add('name', 'Nimi on jäänud sisestamata.');
            }
            if (loading_date.trim() === '') {
                errors.add('loading_date', 'Kuupäev on jäänud sisestamata.');
            }
            if (country.trim() === '') {
                errors.add('country', 'Riik on jäänud sisestamata.');
            }
            if (price.trim() !== '') {
                if (!price.match(/^\d+(\.\d+)?$/)) {
                    errors.add('price', 'Hind pole numbriline väärtus.');
                } else {
                    const priceNumber = parseFloat(price);
                    if (Number.isNaN(priceNumber)) {
                        errors.add('price', 'Hind pole numbriline väärtus.');
                    } else {
                        if (priceNumber <= 0) {
                            errors.add('price', 'Hind pole positiivne.');
                        }
                    }
                }
            }
            // if (companyWho.trim() !== '') {
            //     errors.add('companyWho', 'Kellelt tekstiväli on jäänud sisestamata.');
            // }
            if (!hasNonEmptyLoad(onload)) {
                errors.add('onload', 'Pealelaadimise aadress puudub.');
            }
            for (const place of onload) {
                if (!place.time.match(/^\d\d:\d\d$/)) {
                    errors.add('unload', 'Pealelaadimise kellaaja formaat ei ole HH:mm.');
                }
            }
            return errors;
        };

        const hasNonEmptyLoad = (array) => {
            for (const item of array) {
                if (item.address.trim() !== '') {
                    return true;
                }
            }
            return false;
        };


        /***/
    }),
    /* 16 */
    /***/ (function (module, exports) {

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


        /***/
    }),
    /* 17 */
    /***/ (function (module, exports) {

// Loads JSON script from the given element.

        exports.load = (id) => {
            const element = document.getElementById(id);
            if (element) {
                return JSON.parse(element.innerText);
            }
            return null;
        };


        /***/
    }),
    /* 18 */
    /***/ (function (module, exports) {

        module.exports = (fn, time, runAtEnd = true) => {
            let allow = true;
            let atEnd = null;
            return (...args) => {
                atEnd = args;
                if (allow) {
                    allow = false;
                    setTimeout(() => {
                        allow = true;
                        if (runAtEnd) {
                            fn(...atEnd);
                        }
                    }, time);
                    fn(...args);
                }
            };
        };


        /***/
    }),
    /* 19 */
    /***/ (function (module, exports) {

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


        /***/
    })
    /******/]);