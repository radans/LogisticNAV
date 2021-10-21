const FormGroup = require('../../../lib/views/form/group.jsx');
const Loading = require('./loading.jsx');
const move = require('./move');
const dateString = require('../../../lib/date_string');

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
        if (copy.length < 3) { return; }
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
        copy[i] = Object.assign({}, copy[i], { address: value });
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
        copy[i] = Object.assign({}, copy[i], { time: value });
        this.props.onChange(copy, false);
    }

    // Sets the date value at the given index.

    onDateChange(i, value) {
        const copy = this.props.list.slice(0);
        copy[i] = Object.assign({}, copy[i], { date: value });
        this.props.onChange(copy, false);
    }

    render() {
        return (
            <div>
                {this.props.list.map((place, i, places) => 
                    <FormGroup key={`load-${i}`}>
                        <Loading                            
                            index={i}
                            address={place.address}
                            orderable={i < places.length - 1}
                            onUp={this.onUp}
                            onDown={this.onDown}
                            onChange={this.onChange}
                            onTimeChange={this.onTimeChange}
                            onDateChange={this.onDateChange}
                            timeEdit={this.props.timeEdit}
                            time={place.time}
                            date={place.date}
                            showNumbers={this.props.showNumbers}
                            error={this.props.error}/>
                    </FormGroup>
                )}
            </div>
        );
    }
};
