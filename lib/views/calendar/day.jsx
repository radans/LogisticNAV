const moment = require('moment-timezone');
const Layout = require('../common/layout.jsx');
const Icon = require('../common/icon.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const Day = require('../../day');
const CellOrder = require('./cell_order.jsx');
const CellCompany = require('./cell_company.jsx');
const ColHeader = require('./col_header.jsx');
const Salespeople = require('./salespeople.jsx');
const dayClass = require('./day_class');

module.exports = (props) => {
    const { day, today, date, location } = props;
    return (
        <Layout {...props}>
            <Help {...props}>
                Kalendri päeva vaade.<br />
                Vedaja juures näitavad kantsulud <strong>[n]</strong> pealelaadimiskohtade arvu.<br />
                Vedaja juures näitab tärn <strong>*</strong> osakoormat.
            </Help>
            <div className='vt-margin'>
                {location === 'foreign' &&
                    <span>Hetkel kuvatakse ainult välislaadimiste kalendrit</span>
                }
                {location === 'estonia' &&
                    <span>Hetkel kuvatakse ainult Eesti laadimiste kalendrit</span>
                }
            </div>
            <table className='table table-bordered vt-calendar-day'>
                <colgroup>
                    <col className='vt-calendar-time-col' />
                    <col className='vt-calendar-name-col' />
                    <col className='vt-calendar-company-col' />
                </colgroup>
                <thead>
                    <tr>
                        <th className='text-center'>Aeg</th>
                        <ColHeader label='Plaan' today={today} date={date} />
                        <ColHeader label='Vedaja' today={today} date={date} />
                    </tr>
                </thead>
                <tbody>
                    {day.times.map((row, i) =>
                        <tr key={`row-${i}`}>
                            <th className='vt-calendar-time'>{row.time}</th>
                            <CellOrder today={today} date={date} order={row.order} />
                            <CellCompany today={today} date={date} order={row.order} editable={false} />
                        </tr>
                    )}
                </tbody>
            </table>
            <Salespeople people={props.salespeople} />
            <Buttons>
                <Button label='« Eelmine päev'
                    href={`/calendar/day?day=${Day.prevWorkday(date)}&location=${location}`} />
                <span> <Button label='Järgmine päev »'
                    href={`/calendar/day?day=${Day.nextWorkday(date)}&location=${location}`} /></span>
                <span> <Button label='Nädal'
                    href={`/calendar/week?day=${date}&location=${location}`} icon='calendar' /></span>
            </Buttons>
        </Layout>
    );
};
