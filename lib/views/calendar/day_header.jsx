const moment = require('moment-timezone');
const dayClass = require('./day_class');

module.exports = ({ name, date, today, week, dayIndex, location }) => {
    return (
        <th colSpan='3' className={dayClass(date, today)}>
            <a href={`/calendar/day?day=${date}&location=${location}`}>
                {name}, {moment(date).format('DD.MM')} ({week.dayCounts[dayIndex]})</a>
        </th>
    );
};
