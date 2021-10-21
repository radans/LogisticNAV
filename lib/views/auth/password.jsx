const Layout = require('../common/layout_auth.jsx');
const Help = require('../common/help.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Parooli vahetuseks sisesta e-posti aadress. Parooli
                genereerimise lehe link saadetakse sellele aadressile.
            </Help>
            <div id='password-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
