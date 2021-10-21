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
    let { id, order_name, plan_id, loading_marker } = order;
    if (order.plan_modified) {
        if (order.plan_modified_text) {
            order_name = `${order_name} */${order.plan_modified_text}`
        } else {
            order_name = `${order_name} *`;
        }
    }
    return (
        <td style={style}
            className={dayClass(date, today, 'vt-calendar-order')}>
            <div className='vt-relative'>
                <strong>{order_name}</strong>
                {loading_marker &&
                    <span><br/><strong>({loading_marker})</strong></span>
                }
                <div className='vt-calendar-order-popover'>
                    <a href={`/orders/${id}`}>Andmed</a>
                    <span> <a href={`/orders/${id}/pdf`} target='_blank'>TPDF</a></span>
                    {plan_id !== null &&
                        <span> <a href={`/plan/${plan_id}/pdf`} target='_blank'>PPDF</a></span>}
                </div>
            </div>
        </td>
    );
};
