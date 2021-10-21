const Layout = require('../common/layout_auth.jsx');
const Help = require('../common/help.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Sisesta nimi ja telefon. Neid saab hiljem muuta.
            </Help>
            <div id='register-form-root' data-id={props.registrationId}>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
