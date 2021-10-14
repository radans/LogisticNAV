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
                Vedajate nimekiri on vaikimisi sorteeritud vedaja nime järgi.
                Vajadusel saab sorteerida ka viimase veo kuupäeva järgi.
            </Help>
            <Buttons>
                <Button href='/company/new' icon='address-card-o' label='Uus vedaja'/>
            </Buttons>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-companies-name-col'/>
                    <col className='vt-companies-contact-col'/>
                    <col className='vt-companies-phone-col'/>
                    <col className='vt-companies-mail-col'/>
                    <col className='vt-companies-date-col'/>
                </colgroup>
                <thead>
                    <tr>                        
                        <th><SortLink label='Vedaja' field='name' paginator={props.paginator}/></th>
                        <th><SortLink label='Kontaktisik' field='contact' paginator={props.paginator}/></th>
                        <th><SortLink label='Telefoninumber' field='phone' paginator={props.paginator}/></th>
                        <th><SortLink label='E-post' field='email' paginator={props.paginator}/></th>
                        <th className='text-right'><SortLink label='Viimane vedu' field='last_loading_date' paginator={props.paginator}/></th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map(company => {
                        const className = company.today ? 'vt-today' : null;
                        return (
                            <tr key={`company-${company.id}`} className={className}>
                                <td><a href={`/companies/${company.id}`}>{company.name}</a></td>
                                <td>{company.contact}</td>
                                <td>{company.phone}</td>
                                <td><a href={`mailto:${company.email}`}>{company.email}</a></td>
                                <td className='text-right'>{company.last_loading_date ? props.dateToEstonian(company.last_loading_date) : ''}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Paginator {...props}/>
        </Layout>
    );
};
