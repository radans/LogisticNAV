const TextInput = require('../../../lib/views/form/text.jsx');
const Submit = require('../../../lib/views/form/submit.jsx');
const FormGroup = require('../../../lib/views/form/group.jsx');
const Button = require('../../../lib/views/form/button.jsx');
const pickr = require('../common/pickr');
const FormHoc = require('../common/form_hoc.jsx');

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
                <FormGroup>
                    <Submit
                        icon='save'
                        label='Värskenda'
                        disabled={loading}/>
                    {loading &&
                        <div className='vt-loader vt-loader-small vt-loader-top-right'></div>}
                </FormGroup>
            </form>
        );
    }
});
