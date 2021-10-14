const Layout = require('../common/layout_auth.jsx');
const Help = require('../common/help.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <Help {...props}>
                Sisesta parool ja kontrollväärtus. Parooli miinimumpikkus
                on 8 tähemärki.
            </Help>
            <div id='password-form-root' data-id={props.registrationId}>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
