const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const Icon = require('../common/icon.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const CompanyLink = require('./company_link.jsx');
const Address = require('./address.jsx');
const JsonScript = require('../common/json_script.jsx');
const isEmpty = require('../../is_empty');
const OrderPhotos = require('./order_photos.jsx');
const Pswp = require('./pswp.jsx');

module.exports = (props) => {
    const { order, documents } = props;
    return (
        <Layout {...props}>
            <Help {...props}>
                Tellimuse andmete vaatamine.<br/>
                Tellimuse kinnitamiseks sisesta autonumber tellimuste tabelist. Kinnitatud
                tellimust saab hiljem muuta.<br/>
                Tellimuse tühistamiseks vajuta nupule "Tühista", vali tühistatud oleks ja
                sisesta tühistamise seletus.<br/>
                Tellimusega seotud arve numbrit saad muuta tellimuste tabelist.<br/>
                Mahalaadimise kuupäeva saab muuta kalendri vaatest.
            </Help>
            <JsonScript data={order} id='order-data'/>
            <div className='row'>
                <div className='col-xs-5'>
                    {order.cancelled &&
                        <h3 className='vt-order-heading-cancelled'>TÜHISTATUD</h3>}
                    <h3>Põhiandmed</h3>
                    <table className='table table-bordered vt-table-full-width'>
                        <colgroup>
                            <col className='vt-order-data-label'/>
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>Tellimuse number</th>
                                <td>{order.id}</td>
                            </tr>
                            <tr>
                                <th>Koorma nimetus</th>
                                <td>{order.order_name}</td>
                            </tr>
                            {order.company_id !== null &&
                                <tr>
                                    <th>Vedaja</th>
                                    <td>
                                        <CompanyLink
                                            id={order.company_id}
                                            name={order.company_name}/>
                                    </td>
                                </tr>}
                            {!isEmpty(order.vehicle) &&
                                <tr>
                                    <th>Auto</th>
                                    <td>{order.vehicle}</td>
                                </tr>}
                            {order.import &&
                                <tr>
                                    <th>Import</th>
                                    <td>Jah</td>
                                </tr>}
                            {order.client_transport &&
                                <tr>
                                    <th>Kliendi transport</th>
                                    <td>Jah</td>
                                </tr>}
                            <tr>
                                <th>Riik</th>
                                <td>{order.country}</td>
                            </tr>
                            {order.price !== null &&
                                <tr>
                                    <th>Hind</th>
                                    <td>{order.price.toFixed(2)} EUR</td>
                                </tr>}                            
                            {!isEmpty(order.notes) &&
                                <tr>
                                    <th>Märkused</th>
                                    <td>{order.notes}</td>
                                </tr>}
                            {!isEmpty(order.info) &&
                                <tr>
                                    <th>Lisainformatsioon vedajale</th>
                                    <td>{order.info}</td>
                                </tr>}
                            {order.cancelled &&
                                <tr>
                                    <th>Tühistamise seletus</th>
                                    <td>{order.cancel_text}</td>
                                </tr>}
                            {order.cancelled &&
                                <tr>
                                    <th>Tühistatud</th>
                                    <td>{props.formatUnixDate(order.cancel_date)}</td>
                                </tr>}
                            <tr>
                                <th>Pealelaadimine</th>
                                <td>{props.dateToEstonian(order.loading_date)}</td>
                            </tr>
                            {!!order.unload_date &&
                                <tr>
                                    <th>Mahalaadimine</th>
                                    <td>{props.dateToEstonian(order.unload_date)}</td>
                                </tr>}
                            <tr>
                                <th>Koostatud</th>
                                <td>{props.formatUnixDate(order.created_at)}</td>
                            </tr>
                            {!isEmpty(order.vehicle) &&
                                <tr>
                                    <th>Kinnitatud</th>
                                    <td>{props.formatUnixDate(order.commit_date)}</td>
                                </tr>}
                            <tr>
                                <th>Viimati muudetud</th>
                                <td>{props.formatUnixDate(order.updated_at)}</td>
                            </tr>
                            {order.sent_date !== null &&
                                <tr>
                                    <th>Saadetud</th>
                                    <td>{props.formatUnixDate(order.sent_date)}</td>
                                </tr>}
                            {!isEmpty(order.invoice) &&                   
                                <tr>
                                    <th>Arve number</th>
                                    <td>{order.invoice}</td>
                                </tr>
                            }
                            {order.salesperson_id !== null &&
                                <tr>
                                    <th>Müügijuht</th>
                                    <td>{order.salesperson_name}</td>
                                </tr>}
                        </tbody>
                    </table>
                    <Buttons>
                        <Button href={`/order/copy/${props.id}`} icon='copy' label='Uus'/>
                        <span> <Button href={`/orders?number=${props.id}`} icon='database' label='Tabelis'/></span>
                        <span> <Button href={`/orders/${props.id}/modify`} icon='edit' label='Muuda'/></span>
                        <span> <Button href='#' icon='times-circle-o' label='Tühista' id='cancel-button'/></span>
                        {order.company_id !== null &&
                            <span> <Button href='#' icon='send' label='Saada' id='send-button'/></span>}
                        {order.plan_id === null &&
                            <span> <Button href={`/plans/new?order=${order.id}`} icon='photo' label='Uus plaan'/></span>}
                        {order.plan_id !== null &&
                            <span> <Button href={`/plan/${order.plan_id}`} icon='photo' label='Plaan'/></span>}
                    </Buttons>
                    <div id='cancel-holder'></div>
                    <h3>Pildid</h3>
                    {order.photos.length === 0 &&
                        <div className='alert alert-success'>
                            Ühtegi pilti pole veel lisatud.
                        </div>
                    }
                    <OrderPhotos order={order} version={props.version}/>
                    <div id='upload-form-root'>
                        <div className='vt-loader'></div>
                    </div>
                </div>
                <div className='col-xs-5'>
                    <h3>Pealelaadimised</h3>
                    <table className='table table-bordered vt-table-full-width'>
                        <tbody>
                            <tr>
                                <th>Nr.</th>
                                <th>Koht</th>
                            </tr>
                            {order.onload.map((place, i) => {
                                return (
                                    <tr key={`onload-${i}`}>
                                        <td>{i + 1}</td>
                                        <td><Address address={place.address}/></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {order.unload.length > 0 &&
                        <h3>Mahalaadimised</h3>}
                    {order.unload.length > 0 &&
                        <table className='table table-bordered vt-table-full-width'>
                            <tbody>
                                <tr>
                                    <th>Nr.</th>
                                    <th className='text-right'>Kuupäev</th>
                                    <th>Koht</th>
                                </tr>
                                {order.unload.map((place, i) => {
                                    return (
                                        <tr key={`unload-${i}`}>
                                            <td>{i + 1}</td>
                                            <td className='text-right'>{place.date ? props.dateToEstonian(place.date) : ''}</td>
                                            <td><Address address={place.address}/></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>}
                    {documents.length > 0 &&
                        <h3>Dokumendid</h3>}
                    {documents.length > 0 &&
                        <table className='table table-bordered vt-table-full-width'>
                            <tbody>
                                <tr>
                                    <th>Failinimi</th>
                                    <th className='text-right'>Kuupäev</th>
                                    <th>Dokument</th>
                                    <th>Kommentaar</th>
                                </tr>
                                {documents.map(document =>
                                    <tr key={document.id}>
                                        <td><a href={`/order/documents/${document.id}`} target='_blank'>{document.original_name}</a></td>
                                        <td className='text-right'>{props.formatUnixDate(document.upload_date)}</td>
                                        <td><a href='#' className='vt-order-document-remove'
                                            data-document={document.id} data-name={document.original_name}>Kustuta</a></td>
                                        <td>{document.comment}</td>
                                    </tr>)}
                            </tbody>
                        </table>}
                </div>
            </div>
            <Pswp/>
        </Layout>
    );
};
