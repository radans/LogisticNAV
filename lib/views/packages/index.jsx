const Layout = require('../common/layout.jsx');
const Paginator = require('../common/paginator.jsx');
const SortLink = require('../common/sortlink.jsx');
const Search = require('./search.jsx');
const Help = require('../common/help.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <h3>Otsing</h3>
            <Help {...props}>
                Paki andmete muutmiseks vajuta tabelis vastaval real nime
                või "arhiveeritud" veeru lahtri peale.
            </Help>
            <Search {...props}/>
            <table className='table table-bordered table-striped'>
                <colgroup>
                    <col className='vt-packages-code-col'/>
                    <col className='vt-packages-name-col'/>
                    <col className='vt-packages-height-col'/>
                    <col className='vt-packages-length-col'/>
                    <col className='vt-packages-weight-col'/>
                    <col className='vt-packages-marker-col'/>
                    <col className='vt-packages-archived-col'/>
                    <col className='vt-packages-actions-col'/>
                </colgroup>
                <thead>
                    <tr>
                        <th><SortLink label='Kood' field='code' paginator={props.paginator}/></th>
                        <th><SortLink label='Nimi' field='name' paginator={props.paginator}/></th>
                        <th className='text-right'>Kõrgus</th>
                        <th className='text-right'>Pikkus</th>
                        <th className='text-right'>Kaal</th>
                        <th>Tähis</th>
                        <th>Arhiveeritud</th>
                        <th>Plaanid</th>                        
                    </tr>
                </thead>
                <tbody>
                    {props.list.map((pack, i) => {
                        return (
                            <tr
                                key={pack.code}
                                data-code={pack.code}
                                data-name={pack.name}
                                data-archived={pack.archived}>
                                <td>{pack.code}</td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{pack.name}</div>
                                </td>
                                <td className='text-right'>{pack.height}</td>
                                <td className='text-right'>{pack.width}</td>
                                <td className='text-right'>{pack.weight}</td>
                                <td>{pack.marker}</td>
                                <td className='vt-cell-editable'>
                                    <div className='vt-relative'>{pack.archived ? 'jah' : 'ei'}</div>
                                </td>
                                <td>
                                    <a href={`/plans?package_code=${encodeURIComponent(pack.code)}&author_id=0`}>Plaanid</a>                                    
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
