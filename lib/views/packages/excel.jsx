const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Uuendamisel kasutatava faili veerud peavad olema järjekorras:<br/>
                G - paki nimi;<br/>
                H - paki kood;<br/>
                L - paki pikkus (cm);<br/>
                N - paki kõrgus (cm).
            </Help>
            <JsonScript id='data-form' data={null}/>
            <div id='package-upload-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
