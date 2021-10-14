const Layout = require('../common/layout.jsx');
const Help = require('../common/help.jsx');
const Buttons = require('../common/buttons.jsx');
const Button = require('../form/button.jsx');
const TextInput = require('../form/text.jsx');
const Submit = require('../form/submit.jsx');
const FormGroup = require('../form/group.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <JsonScript id='data-companies' data={props.companies}/>
            <JsonScript id='data-countries' data={props.countries}/>
            <JsonScript id='data-regions' data={props.regions}/>
            <JsonScript id='data-salespeople' data={props.salespeople}/>
            <div id='statistics-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
