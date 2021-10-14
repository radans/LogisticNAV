const Layout = require('../common/layout.jsx');
const Icon = require('../common/icon.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const SortLink = require('../common/sortlink.jsx');
const Paginator = require('../common/paginator.jsx');
const JsonScript = require('../common/json_script.jsx');
const PlansSearch = require('./plans_search.jsx');
const day = require('../../day');
const dateString = require('../../date_string');

const SendLink = ({ sentAt }) => {
    const classes = ['vt-plans-send'];
    if (sentAt === null) {
        classes.push('vt-plans-link-unsent');
    }
    return <a href='#' className={classes.join(' ')} >Saada</a>;
};

const PlanRow = (props) => {
    const {
        id,
        name,
        order_id,
        updated_at,
        modified,
        modified_text,
        salesperson,
        loading_date,
        loading_time,
        company_name,
        company_id,
        salesperson_id,
        sent_at
    } = props.plan;
    let displayName = name;
    if (modified) {
        if (typeof modified_text === 'string' && modified_text.length > 0) {
            displayName = `${name} * (${modified_text})`;
        } else {
            displayName = `${name} *`;
        }
    }
    const style = {};
    if (salesperson) {
        style.background = salesperson.color;
    }
    return (
        <tr
            data-plan={id}
            data-order={order_id}
            data-name={name}
            data-salesperson={salesperson_id}
            style={style}>
            <td><a href={`/plan/${id}`}>{displayName}</a></td>
            <td className='text-right'>
                {loading_date ? <a href={`/calendar/day?day=${loading_date}&location=all`}>
                    {dateString.toEstonian(loading_date)}</a> : ''}
                {loading_time ? <span> {loading_time}</span> : ''}
            </td>
            <td>
                {company_id ? <a href={`/companies/${company_id}`}>
                    {company_name}</a> : ''}
            </td>
            <td className='text-right'>{day.formatDate(updated_at)}</td>
            <td className='vt-cell-editable'>
                <div className='vt-relative'>
                    <a href={`/plan/${id}/pdf`} target='_blank'>PDF</a>
                    <span> <a href={`/plan/${id}`}>Muuda</a></span>
                    <span> <a href={`/plan/copy/${id}`}>Kopeeri</a></span>
                    <span> <a href='#' className='vt-plans-remove'>Kustuta</a></span>
                    <span> <SendLink sentAt={sent_at}>Saada</SendLink></span>
                </div>
            </td>
            <td className='vt-cell-editable'>
                <div className='vt-relative'>
                    <a href='#' className='vt-plans-select'>Vali</a>&nbsp;
                    {order_id > 0 ?
                        <a href={`/orders/${order_id}`}>Vaata</a> :
                        <a href={`/orders/new?plan=${id}`}>Uus</a>}
                </div>
            </td>
        </tr>
    );
};

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Koormaplaanide nimekiri.<br />
                Tellimusega saab plaani siduda vajutades tabeli veerus "Seotud tellimus"
                vastava rea lahtris "Vali".
            </Help>
            <PlansSearch {...props} />
            <table className='table table-bordered'>
                <colgroup>
                    <col className='vt-plans-name-col' />
                    <col className='vt-plans-onload-col' />
                    <col className='vt-plans-company-col' />
                    <col className='vt-plans-date-col' />
                    <col className='vt-plans-actions-col' />
                    <col className='vt-plans-order-col' />
                </colgroup>
                <thead>
                    <tr>
                        <th><SortLink label='Nimetus' field='name' paginator={props.paginator} /></th>
                        <th className='text-right'>Laadimine</th>
                        <th><SortLink label='Vedaja' field='company_name' paginator={props.paginator} /></th>
                        <th className='text-right'><SortLink label='Muudetud' field='updated_at' paginator={props.paginator} /></th>
                        <th>Plaan</th>
                        <th><SortLink label='Seotud tellimus' field='plan_id' paginator={props.paginator} /></th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map(plan => <PlanRow key={plan.id} plan={plan} />)}
                </tbody>
            </table>
            <Paginator {...props} />
        </Layout>
    );
};
