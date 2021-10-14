const Layout = require('./common/layout.jsx');
module.exports = (props) => {
    return (
        <Layout {...props}>
            <div className="row">
                <div className="col-md-12 col-lg-10">
                    <div className="alert alert-danger">
                        {props.message}
                    </div>
                </div>
            </div>    
        </Layout>
    );
};
