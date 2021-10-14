const moment = require('moment-timezone');
const Layout = require('../common/layout.jsx');
const Icon = require('../common/icon.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const CellOrder = require('./cell_order.jsx');
const CellCompany = require('./cell_company.jsx');
const CellDate = require('./cell_date.jsx');
const DayHeader = require('./day_header.jsx');
const ColHeader = require('./col_header.jsx');
const Salespeople = require('./salespeople.jsx');
const dayClass = require('./day_class');

const Paginator = ({ weeks, location }) => {
    const prev = weeks.prev[weeks.prev.length - 1];
    const next = weeks.next[0];
    const current = weeks.current;
    return (
        <ul className='pagination hidden-print'>
            <li><a href={`/calendar/week?day=${prev.date}&location=${location}`}>«</a></li>
            {weeks.prev.map(week => <li key={week.date}><a href={`/calendar/week?day=${week.date}&location=${location}`}>{week.week}</a></li>)}
            <li className='active'><span>{current.week}</span></li>
            {weeks.next.map(week => <li key={week.date}><a href={`/calendar/week?day=${week.date}&location=${location}`}>{week.week}</a></li>)}
            <li><a href={`/calendar/week?day=${next.date}&location=${location}`}>»</a></li>
        </ul>
    );
};

module.exports = (props) => {
    const { week, today, start, weeks, location } = props;
    return (
        <Layout {...props}>
            <Help {...props}>
                Kalendri nädala vaade.<br />
                Vedaja juures näitavad kantsulud <strong>[n]</strong> pealelaadimiskohtade arvu.<br />
                Vedaja juures näitab tärn <strong>*</strong> osakoormat.<br />
                Plaani juures näitab tärn <strong>*</strong> muudetud plaani.<br />
                Muudetud tekstiga plaani juures on <strong>*/tekst</strong>.
            </Help>
            <table className='table table-bordered vt-calendar-week'>
                <colgroup>
                    <col className='vt-calendar-time-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                    <col className='vt-calendar-price-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                    <col className='vt-calendar-price-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                    <col className='vt-calendar-price-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                    <col className='vt-calendar-price-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                    <col className='vt-calendar-price-col' />
                </colgroup>
                <thead>
                    <tr>
                        <th className='text-center'>Aeg</th>
                        <DayHeader name='Esmaspäev' today={today} date={week.days[0]} week={week} dayIndex={0} location={location} />
                        <DayHeader name='Teisipäev' today={today} date={week.days[1]} week={week} dayIndex={1} location={location} />
                        <DayHeader name='Kolmapäev' today={today} date={week.days[2]} week={week} dayIndex={2} location={location} />
                        <DayHeader name='Neljapäev' today={today} date={week.days[3]} week={week} dayIndex={3} location={location} />
                        <DayHeader name='Reede' today={today} date={week.days[4]} week={week} dayIndex={4} location={location} />
                    </tr>
                    <tr>
                        <th></th>
                        <ColHeader label='Plaan' today={today} date={week.days[0]} />
                        <ColHeader label='Vedaja' today={today} date={week.days[0]} />
                        <ColHeader label='Maha kp.' today={today} date={week.days[0]} classes={'text-right'} />
                        <ColHeader label='Plaan' today={today} date={week.days[1]} />
                        <ColHeader label='Vedaja' today={today} date={week.days[1]} />
                        <ColHeader label='Maha kp.' today={today} date={week.days[1]} classes={'text-right'} />
                        <ColHeader label='Plaan' today={today} date={week.days[2]} />
                        <ColHeader label='Vedaja' today={today} date={week.days[2]} />
                        <ColHeader label='Maha kp.' today={today} date={week.days[2]} classes={'text-right'} />
                        <ColHeader label='Plaan' today={today} date={week.days[3]} />
                        <ColHeader label='Vedaja' today={today} date={week.days[3]} />
                        <ColHeader label='Maha kp.' today={today} date={week.days[3]} classes={'text-right'} />
                        <ColHeader label='Plaan' today={today} date={week.days[4]} />
                        <ColHeader label='Vedaja' today={today} date={week.days[4]} />
                        <ColHeader label='Maha kp.' today={today} date={week.days[4]} classes={'text-right'} />
                    </tr>
                </thead>
                <tbody>
                    {week.times.map((row, i) =>
                        <tr key={`row-${i}`}>
                            <th className='vt-calendar-time'>{row.time}</th>
                            <CellOrder today={today} date={week.days[0]} order={row.orders[0]} />
                            <CellCompany today={today} date={week.days[0]} order={row.orders[0]} />
                            <CellDate today={today} date={week.days[0]} order={row.orders[0]} editable={true} />
                            <CellOrder today={today} date={week.days[1]} order={row.orders[1]} />
                            <CellCompany today={today} date={week.days[1]} order={row.orders[1]} />
                            <CellDate today={today} date={week.days[1]} order={row.orders[1]} editable={true} />
                            <CellOrder today={today} date={week.days[2]} order={row.orders[2]} />
                            <CellCompany today={today} date={week.days[2]} order={row.orders[2]} />
                            <CellDate today={today} date={week.days[2]} order={row.orders[2]} editable={true} />
                            <CellOrder today={today} date={week.days[3]} order={row.orders[3]} />
                            <CellCompany today={today} date={week.days[3]} order={row.orders[3]} />
                            <CellDate today={today} date={week.days[3]} order={row.orders[3]} editable={true} />
                            <CellOrder today={today} date={week.days[4]} order={row.orders[4]} />
                            <CellCompany today={today} date={week.days[4]} order={row.orders[4]} />
                            <CellDate today={today} date={week.days[4]} order={row.orders[4]} editable={true} />
                        </tr>
                    )}
                </tbody>
            </table>
            <div className='vt-margin'>
                <span className='vt-calendar-load-count'>Koormaid kokku: {week.orders.length}</span><br />
                Päeva keskmine: {(week.orders.length / 5).toFixed(2)}
            </div>
            <Salespeople people={props.salespeople} />
            <div className='vt-margin'>
                {location !== 'foreign' &&
                    <span><a href='/calendar/week?location=foreign'>Välislaadimised</a> </span>
                }
                {location !== 'estonia' &&
                    <span><a href='/calendar/week'>Eesti</a> </span>
                }
                {location !== 'all' &&
                    <a href='/calendar/week?location=all'>Kõik</a>
                }
            </div>
            <Paginator weeks={weeks} location={location} />
        </Layout>
    );
};
