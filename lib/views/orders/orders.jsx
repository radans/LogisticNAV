const _ = require('lodash');
const Layout = require('../common/layout.jsx');
const Icon = require('../common/icon.jsx');
const Help = require('../common/help.jsx');
const Paginator = require('../common/paginator.jsx');
const SortLink = require('../common/sortlink.jsx');
const JsonScript = require('../common/json_script.jsx');
const OrdersSearch = require('./orders_search.jsx');

const SendLink = ({order}) => {
    const classes = ['vt-send-button'];
    if (order.sent_date === null) {
        classes.push('vt-orders-link-unsent');
    }
    return <a href='#' className={classes.join(' ')} >Saada</a>;
};

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Nimekirjas on autonumber kuvatud kinnitatud tellimustel.
                Auto numbrit saab muuta "Auto" veerus vastava rea lahtrile vajutades.<br/>
                Tellimust saab tühistada tellimuse vaate kaudu. Tellimuse
                vaatesse pääseb "Tellimuse nr." veerus numbrile vajutades.<br/>
                <a href='#' className='vt-orders-link-unsent'>Saada</a> - tellimus vedajale saatmata.<br/>
                <a href='#'>Saada</a> - tellimus vedajale saadetud.<br/>
                <strong>T</strong> - täiskoorem.<br/>
                <strong>O</strong> - osakoorem.
            </Help>
            <h3>Otsing</h3>
            <OrdersSearch {...props}/>
            <JsonScript id='orders-salespeople' data={props.salespeople}/>
            <table className='table table-bordered'>
                <colgroup>
                    <col className='vt-orders-number-col'/>
                    <col className='vt-orders-company-col'/>
                    <col className='vt-orders-name-col'/>
                    <col className='vt-orders-action-col'/>
                    <col className='vt-orders-vehicle-col'/>
                    <col className='vt-orders-date-col'/>
                    <col className='vt-orders-country-col'/>
                    <col className='vt-orders-unload-col'/>                    
                    <col className='vt-orders-plan-col'/>
                    <col className='vt-orders-price-col'/>
                    <col className='vt-orders-invoice-col'/>
                    <col className='vt-orders-notes-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th className='text-right'><SortLink label='Number' field='id' paginator={props.paginator}/></th>
                        <th><SortLink label='Vedaja' field='company_name' paginator={props.paginator}/></th>
                        <th><SortLink label='Koorem' field='order_name' paginator={props.paginator}/></th>
                        <th>Tellimus</th>
                        <th className='text-right'><SortLink label='Auto' field='vehicle' paginator={props.paginator}/></th>
                        <th className='text-right'><SortLink label='Laadimine' field='loading_date' paginator={props.paginator}/></th>
                        <th><SortLink label='Riik' field='country' paginator={props.paginator}/></th>
                        <th>Maha</th>
                        <th>Plaan</th>
                        <th className='text-right'><SortLink label='Hind' field='price' paginator={props.paginator}/></th>
                        <th className='text-right'>Arve</th>
                        <th>Märkus</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map((order, i) => {
                        const style = {};
                        if (order.salesperson) {
                            style.background = order.salesperson.color;
                        }
                        const className = order.today ? 'vt-today' : null;
                        return (
                            <tr
                                key={order.id}
                                data-order={order.id}
                                data-plan={order.plan_id}
                                data-vehicle={order.vehicle}
                                data-invoice={order.invoice}
                                data-sent={order.sent_date}
                                data-salesperson={order.salesperson_id}
                                data-unload_date={order.unload_date}
                                className={className}
                                style={style}>
                                <th className='vt-cell-editable vt-cell-editable-normal-cursor text-right'>
                                    <div className='vt-relative'>
                                        {order.cancelled &&
                                            <span className='vt-orders-cancelled'>(T)</span>}
                                        <span> <a href={`/orders/${order.id}`}>{order.id}</a></span>
                                        <div className='vt-orders-documents'>
                                            {order.document_count > 0 &&
                                                <a href='#' className='vt-orders-documents-link'><Icon name='paperclip'/></a>}
                                            {!(order.document_count > 0) &&
                                                <a href='#' className='vt-orders-documents-link'><Icon name='cloud-upload'/></a>}
                                        </div>
                                    </div>
                                </th>
                                <td>{order.company_id > 0 &&
                                    <a href={`/companies/${order.company_id}`}>{order.company_name}</a>}</td>
                                <td>{order.order_name}</td>
                                <td>
                                    <a href={`/order/copy/${order.id}`}>Kopeeri</a>
                                    <span> <a href={`/orders/${order.id}/pdf`} target='_blank'>PDF</a></span>
                                    <span> <a href={`/orders/${order.id}/modify`}>Muuda</a></span>
                                    {order.company_id !== null &&
                                        <span> <SendLink order={order}/></span>}
                                </td>
                                <td className='vt-cell-editable vt-orders-edit text-right'>
                                    <div className='vt-relative'>{order.vehicle}</div>
                                </td>
                                <td className='text-right'>{props.dateToEstonian(order.loading_date)}</td>
                                <td>{order.country}</td>
                                <td>
                                    {(order.unloading_region ? order.unloading_region + '/' : '') +
                                        (order.full_load ? 'T/' : 'O/') +
                                        (order.unloading_count === null ? 0 : order.unloading_count)}
                                </td>
                                <td className='vt-cell-editable vt-orders-edit'>
                                    <div className='vt-relative'>
                                        <a href='#' className='vt-orders-select'>Vali</a>
                                        {order.plan_id ?
                                            <span> <a href={`/plan/${order.plan_id}/pdf`} target='_blank'>PDF</a></span> :
                                            <span> <a href={`/plans/new?order=${order.id}`}>Uus</a></span>}
                                        {order.plan_id !== null &&
                                            <span> <a href={`/plan/copy/${order.plan_id}`}>Kopeeri</a></span>}
                                        
                                    </div>
                                </td>
                                <td className='text-right'>
                                    {order.price === null ? '' : Number(order.price).toFixed(0) }
                                </td>
                                <td className='vt-cell-editable vt-orders-edit text-right'>
                                    <div className='vt-relative'>{order.invoice}</div>
                                </td>
                                <td className='vt-note-column'>{order.notes}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Paginator {...props}/>
        </Layout>
    );
};
