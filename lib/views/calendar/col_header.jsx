const dayClass = require('./day_class');

module.exports = ({date, today, label, classes}) => {
    return (
        <th className={dayClass(date, today, classes)}>{label}</th>
    );
};
