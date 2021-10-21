const Layout = require('../common/layout_auth.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <div id='login-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
