const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Põhiandmeid kasutatakse saadetava tellimuse PDF vormil.
            </Help>
            <JsonScript id='data-form' data={props.settings}/>
            <div id='main-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
