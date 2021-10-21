const Icon = require('../../../lib/views/common/icon.jsx');
const Textarea = require('../../../lib/views/form/textarea.jsx');
const TextInput = require('../../../lib/views/form/text.jsx');
const pickr = require('../common/pickr');

const LOADING_TIMES = [
    '07:00', '07:30',
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30'
];

const UNLOADING_TIMES = [''];

for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m +=15) {
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
        return (
            <div className={classes.join(' ')}>
                {showNumbers &&
                    <div className='vt-order-form-load-number'>{this.props.index + 1}.</div>}
                {showNumbers &&
                    <div className='vt-order-form-load-date'>
                        <TextInput
                            value={date}
                            group={false}
                            onChange={this.onDateChange}
                            inputRef={this.setDateInput}
                            inputClass='vt-form-control-date'/>
                    </div>}
                {showNumbers &&
                    <select className='form-control vt-order-form-unload-time'
                        onChange={this.onTimeChange} value={time}>
                        {UNLOADING_TIMES.map(time =>
                            <option key={time} value={time}>{time}</option>)}
                    </select>}
                {timeEdit &&
                    <select className='form-control vt-order-form-load-time'
                        onChange={this.onTimeChange} value={time}>
                        {LOADING_TIMES.map(time =>
                            <option key={time} value={time}>{time}</option>)}
                    </select>}
                <Textarea rows='2' onChange={this.onChange} value={address} error={error}/>
                {orderable &&
                    <div className='vt-order-form-load-top'>
                        <a href='#' className='btn btn-default btn-xs'
                            onClick={this.onUp}><Icon name='arrow-up'/></a>
                    </div>}
                {orderable &&
                    <div className='vt-order-form-load-bottom'>
                        <a href='#' className='btn btn-default btn-xs'
                            onClick={this.onDown}><Icon name='arrow-down'/></a>
                    </div>}
            </div>
        );
    }
};
