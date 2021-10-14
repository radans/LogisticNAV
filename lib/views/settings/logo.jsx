const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Logo faili kasutatakse tellimuse PDF vormil.
                Logo faili soovitatav suurus pikslites on 792x240. Logo skaleeritakse
                automaatselt.
            </Help>
            <JsonScript id='data-form' data={props.settings}/>
            <div id='logo-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
