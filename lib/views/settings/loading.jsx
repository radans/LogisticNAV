const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Laadimisjuhendid peavad olema PDF formaadis. Failide suurused
                võiks olla väiksemad kui 1MB, kuna juhendid saadetakse koos tellimuse
                PDF dokumendiga meili teel.
            </Help>
            <JsonScript id='data-form' data={props.settings}/>
            <div id='loading-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
