const Layout = require('../common/layout.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <div id='address-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
