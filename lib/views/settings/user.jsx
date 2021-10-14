const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Kasutaja andmed. Nime ja telefoninumbrit kuvatakse tellimuse dokumendil.
                Linnuke kastis "Kuva abiteateid" korral kuvatakse süsteemi osades teateid
                (nagu see teade siin), mis lihtsustavad uue kasutaja tööd.
            </Help>
            <JsonScript id='data-form' data={props.formData}/>
            <div id='user-settings-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
