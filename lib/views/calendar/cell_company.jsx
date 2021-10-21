const dayClass = require('./day_class');
const dateString = require('../../date_string');

module.exports = ({date, today, order, editable}) => {
    if (!order) {
        return <td className={dayClass(date, today)}></td>;
    }
    const style = {};
    if (order.salesperson) {
        style.background = order.salesperson.color;
    }
    if (order.company_id === null) {
        if (order.vehicle) {
            return <td style={style} className={dayClass(date, today)}>{order.vehicle}</td>;
        } else {
            return <td style={style} className={dayClass(date, today)}></td>;
        }        
    }
    const { company_id, shortCompanyName, vehicle, onload_count } = order;
    let actualName = onload_count > 1 ?
        `[${onload_count}] ${shortCompanyName}` : shortCompanyName;
    if (!order.full_load) {
        actualName = `* ${actualName}`;
    }
    const className = editable ? 'vt-cell-editable' : null;
    return (
        <td style={style}
            className={dayClass(date, today, editable)}
            data-order={order.id}
            data-unload_date={order.unload_date}
            data-vehicle={order.vehicle}>
            <div className='vt-relative'>
                <a href={`/companies/${company_id}`}
                    className='vt-calendar-company-link'>
                        <strong>{actualName}</strong></a><br/>
                {vehicle}
            </div>
        </td>
    );
};
