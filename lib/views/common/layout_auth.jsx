const Head = require('./head.jsx');
const Header = require('./header_auth.jsx');
const Footer = require('./footer.jsx');
const NoScript = require('./noscript.jsx');

module.exports = (props) => {
    return (
        <html>
            <Head {...props}/>
            <body>                
                <main className='container vt-login-main'>
                    <Header {...props}/>
                    <h2>{props.heading}</h2>
                    <NoScript/>
                    <div className='vt-login-children'>
                        {props.children}
                    </div>
                </main>
                <Footer {...props}/>
            </body>
        </html>
    );
};
