const dayClass = require('./day_class');
const dateString = require('../../date_string');

module.exports = ({date, today, order}) => {
    if (!order) {
        return <td className={dayClass(date, today)}></td>;
    }
    const style = {};
    if (order.salesperson) {
        style.background = order.salesperson.color;
    }
    return (
        <td style={style}
            className={dayClass(date, today, ['vt-cell-editable', 'text-right'])}
            data-order={order.id}
            data-unload_date={order.unload_date}
            data-vehicle={order.vehicle}>
            <div className='vt-relative'>
                {order.unload_date ? dateString.toEstonian(order.unload_date) : ''}
            </div>
        </td>
    );
};
