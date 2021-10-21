const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <JsonScript id='data-users' data={props.users}/>
            <Buttons>
                <Button href='/salespeople/new' icon='address-card-o' label='Uus'/>
            </Buttons>
            <table className='table table-bordered'>
                <colgroup>
                    <col className='vt-salespeople-name-col'/>
                    <col className='vt-salespeople-action-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th>Nimi</th>
                        <th>Müügijuht</th>
                        <th>Kasutaja</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map(person => {
                        return (
                            <tr
                                key={person.id}
                                data-name={person.name}
                                data-salesperson={person.id}                                
                                data-users={person.users.map(user => user.id).join(',')}
                                data-hue={person.color_hue}
                                data-saturation={person.color_saturation}
                                data-lightness={person.color_lightness}
                                style={{background: person.color}}>
                                <td><a href={`/salespeople/${person.id}`}>{person.name}</a></td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>
                                        <a href={`/orders?salesperson_id=${person.id}`}>Tellimused</a>
                                        <span> <a href='#' className='vt-salespeople-color'>Värvus</a></span>
                                        <span> <a href='#' className='vt-salesperson-remove'>Kustuta</a></span>                                        
                                    </div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>
                                        {person.users.map(user =>
                                            <span key={user.id}><a
                                                data-user={user.id}
                                                href='#'
                                                className='vt-salespeople-select'>{user.name}</a>, </span>
                                        )}
                                        <a href='#' className='vt-salespeople-select'>Vali</a>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Layout>
    );
};
