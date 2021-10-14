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
                Kasutajate nimekiri. Nähtav ainult peakasutajale.
            </Help>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-users-name-col'/>
                    <col className='vt-users-mail-col'/>
                    <col className='vt-users-phone-col'/>
                    <col className='vt-users-active-col'/>
                    <col className='vt-users-master-col'/>                    
                </colgroup>
                <thead>
                    <tr>                        
                        <th><SortLink label='Nimi' field='name' paginator={props.paginator}/></th>
                        <th><SortLink label='E-post' field='contact' paginator={props.paginator}/></th>
                        <th><SortLink label='Telefoninumber' field='phone' paginator={props.paginator}/></th>
                        <th><SortLink label='Aktiivne' field='active' paginator={props.paginator}/></th>
                        <th><SortLink label='Peakasutaja' field='master_user' paginator={props.paginator}/></th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map(user => {
                        return (
                            <tr key={`user-${user.id}`}
                                data-user={user.id}
                                data-active={user.active}
                                data-master_user={user.master_user}>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{user.name}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{user.email}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{user.phone}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{user.active ? 'Jah' : 'Ei'}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{user.master_user ? 'Jah' : 'Ei'}</div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Paginator {...props}/>
        </Layout>
    );
};
