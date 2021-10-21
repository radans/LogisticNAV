const Layout = require('../common/layout.jsx');
const PlanHelp = require('./plan_help.jsx');
const JsonScript = require('../common/json_script.jsx');

module.exports = (props) => {
    return (
        <Layout {...props}>
            <PlanHelp {...props}/>
            <JsonScript id='data-form' data={props.plan}/>
            <div className='hidden-print'>
                <kp-app></kp-app>
            </div>
            <div className='visible-print kp-print-message'>
                Kasuta printimiseks plaani PDF vaadet.
            </div>
        </Layout>
    );
};
