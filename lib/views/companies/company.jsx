const _ = require('lodash');
const Layout = require('../common/layout.jsx');
const Icon = require('../common/icon.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Paginator = require('../common/paginator.jsx');
const SortLink = require('../common/sortlink.jsx');
const Button = require('../form/button.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Varem tehtud veotellimuse saab kopeerida vajudates tabeli real nuppu "Kopeeri".
                Vajutades "Otsi", tuleb tellimus ette tellimuste tabelis.
            </Help>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-company-orders-name-col'/>
                    <col className='vt-company-orders-date-col'/>
                    <col className='vt-company-orders-action-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th><SortLink label='Koorma nimetus' field='order_name' paginator={props.paginator}/></th>
                        <th className='text-right'><SortLink label='Viimane vedu' field='loading_date' paginator={props.paginator}/></th>
                        <th>Tegevus</th>                         
                    </tr>
                </thead>
                <tbody>
                    {props.list.map((order, i) => {
                        const className = order.today ? 'vt-today' : null;
                        return (
                            <tr key={`order-${i}`} className={className}>
                                <td><a href={`/orders/${order.order_id}`}>{order.order_name}</a></td>
                                <td className='text-right'>{props.dateToEstonian(order.loading_date)}</td>
                                <td>
                                    <a href={`/order/copy/${order.order_id}`}>Kopeeri</a>
                                    <span> <a href={`/orders?number=${order.order_id}`}>Otsi</a></span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Paginator {...props}/>
            <h3>Kinnitamata tellimused</h3>
            <Help {...props}>
                Kinnitamata tellimuste tabelis on veo tellimused, millele pole
                vedajalt veel vastust tulnud. Tühistatud tellimusi siin ei kuvata.
                Tellimuse olekut saab muuta vajutades "Otsi" ja määrates auto numbri
                või arve numbri.
            </Help>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-company-orders-name-col'/>
                    <col className='vt-company-orders-date-col'/>
                    <col className='vt-company-orders-action-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th>Koorma nimetus</th>
                        <th className='text-right'>Laadimine</th>
                        <th>Tegevus</th>                       
                    </tr>
                </thead>
                <tbody>
                    {props.uncommitted.map(order => {
                        const className = order.today ? 'vt-today' : null;
                        return (
                            <tr key={`order-${order.order_id}`} className={className}>
                                <td><a href={`/orders/${order.order_id}`}>{order.order_name}</a></td>
                                <td className='text-right'>{props.dateToEstonian(order.loading_date)}</td>
                                <td><a href={`/orders?number=${order.order_id}`}>Otsi</a></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Buttons>
                <Button href={`/company/modify/${props.id}`} icon='address-card-o' label='Andmed'/>
                &nbsp;<Button href='/statistics' icon='bar-chart' label='Statistika'/>
            </Buttons>
        </Layout>
    );
};
