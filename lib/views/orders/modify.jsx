const Layout = require('../common/layout.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <JsonScript id='data-companies' data={props.companies}/>            
            <JsonScript id='data-loadings' data={props.loadings}/>
            <JsonScript id='data-form' data={props.order}/>
            <div id='order-form-root'>
                <div className='vt-loader'></div>
            </div>
        </Layout>
    );
};
