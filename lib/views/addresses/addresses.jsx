const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const Paginator = require('../common/paginator.jsx');
const SortLink = require('../common/sortlink.jsx');
const FormGroup = require('../form/group.jsx');
const TextInput = require('../form/text.jsx');
const Checkbox = require('../form/checkbox.jsx');
const Submit = require('../form/submit.jsx');
const Button = require('../form/button.jsx');
const Address = require('../orders/address.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Arhiveeritud aadressit ei kasutata tellimuse koostamisel
                aadressi soovitamiseks. Aadress oleku ja märkuste muutmiseks
                vajuta tabelis vastava rea "Arhiveeritud" või "Märkused" lahtris.
            </Help>
            <form method='GET' action='/addresses' className='vt-form'>
                <div className='row'>
                    <div className='col-xs-4'>
                        <TextInput
                            id='search'
                            name='search'
                            label='Tekst'
                            placeholder='Otsingu tekst'
                            size='sm'
                            defaultValue={props.paginator.searchValue('search')}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-4'>
                        <Checkbox
                            id='archived'
                            name='archived'
                            value='1'
                            label='Arhiveeritud'
                            defaultChecked={props.paginator.searchValue('archived') === '1'}/>
                    </div>                    
                </div>
                <FormGroup>
                    <Submit icon='search' label='Otsi'/>
                    <span> <Button href='/addresses/new' icon='edit' label='Uus'/></span>
                    <span> <Button href='/addresses' icon='refresh' label='Lähtesta'/></span>
                </FormGroup>
            </form>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-addresses-name-col'/>
                    <col className='vt-addresses-region-col'/>                    
                    <col className='vt-addresses-address-col'/>
                    <col className='vt-addresses-notes-col'/>
                    <col className='vt-addresses-marker-col'/>
                    <col className='vt-addresses-arch-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th><SortLink label='Klient' field='name' paginator={props.paginator}/></th>
                        <th><SortLink label='Regioon' field='region' paginator={props.paginator}/></th>                        
                        <th><SortLink label='Aadress' field='address' paginator={props.paginator}/></th>                        
                        <th>Märkused</th>
                        <th>Tähis</th>
                        <th>Arhiveeritud</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.map(address => {
                        return (
                            <tr
                                key={address.id}
                                data-address={address.id}
                                data-name={address.name}
                                data-notes={address.notes}
                                data-archived={address.archived}
                                data-region={address.region}
                                data-content={address.address}
                                data-marker={address.marker}>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{address.name}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{address.region}</div>
                                </td>                                
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>
                                        <Address address={address.address}/>
                                    </div></td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{address.notes}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{address.marker}</div>
                                </td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{address.archived ? 'jah' : 'ei'}</div>
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
