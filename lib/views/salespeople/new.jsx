const Layout = require('../common/layout.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <div id='salesperson-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
