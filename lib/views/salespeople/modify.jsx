const Layout = require('../common/layout.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <JsonScript id='data-form' data={props.formData}/>
            <div id='salesperson-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
