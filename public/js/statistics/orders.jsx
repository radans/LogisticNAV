module.exports = class Orders extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {        
        const { orders } = this.props;        
        return (
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-stats-orders-number-col'/>
                    <col className='vt-stats-orders-date-col'/>
                    <col className='vt-stats-orders-country-col'/>
                    <col className='vt-stats-orders-region-col'/>
                    <col className='vt-stats-orders-price-col'/>
                    <col className='vt-stats-orders-full-col'/>
                    <col className='vt-stats-orders-load-count-col'/>
                    <col className='vt-stats-orders-company-col'/>
                    <col className='vt-stats-orders-invoice-col'/>
                    <col className='vt-stats-orders-import-col'/>
                    <col className='vt-stats-orders-notes-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th className='text-right'>Number</th>
                        <th className='text-right'>Laadimine</th>
                        <th>Riik</th>
                        <th>Regioon</th>
                        <th className='text-right'>Hind</th>
                        <th>T/O</th>
                        <th className='text-right'>Laadimisi</th>
                        <th>Vedaja</th>
                        <th className='text-right'>Arve</th>
                        <th className='text-right'>Import/eksport</th>
                        <th className='text-right'>Kliendi transport</th>
                        <th>Märkused</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order =>
                        <tr key={order.id}>
                            <td className='text-right'><a href={`/orders/${order.id}`}>{order.id}</a></td>
                            <td className='text-right'>{order.loading_date_formatted}</td>
                            <td>{order.country}</td>
                            <td>{order.region}</td>
                            <td className='text-right'>{order.price === null ? '' : order.price.toFixed(0)}</td>
                            <td>{order.full_load ? 'T' : 'O'}</td>
                            <td className='text-right'>{order.unloading_count}</td>
                            <td>{order.company_name}</td>
                            <td className='text-right'>{order.invoice}</td>
                            <td>{order.import ? 'Import' : 'Eksport'}</td>
                            <td className='text-right'>{order.client_transport ? 'Jah' : 'Ei'}</td>
                            <td>{order.notes}</td>
                        </tr>)}
                </tbody>
            </table>
        );
    }
};
