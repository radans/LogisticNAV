const Head = require('./head.jsx');
const Menu = require('./menu.jsx');
const Header = require('./header.jsx');
const Footer = require('./footer.jsx');
const NoScript = require('./noscript.jsx');

module.exports = (props) => {
    const menuClasses = ['vt-menu', 'hidden-print'];
    const bodyClasses = ['vt-body'];
    if (props.collapsed) {
        menuClasses.push('vt-menu-collapsed');
        bodyClasses.push('vt-body-expanded');
    }
    const user = props.user;
    let userWarning = false;
    if (user) {
        userWarning = userWarning || user.name === null || user.name.trim() === '';
        userWarning = userWarning || user.phone === null || user.phone.trim() === '';
        userWarning = userWarning || user.order_email === null || user.order_email.trim() === '';
    }
    return (
        <html>
            <Head {...props}/>
            <body>
                <Header {...props}/>
                <main className='vt-layout'>
                    <div className={menuClasses.join(' ')} id='layout-menu'>
                        <Menu {...props}/>
                    </div>
                    <div className={bodyClasses.join(' ')} id='layout-body'>
                        {!props.production &&
                            <div className='alert alert-warning'>
                                Süsteem töötab arendusrežiimis.
                            </div>
                        }
                        {userWarning &&
                            <div className='alert alert-warning'>
                                Kasutaja nimi, telefon või tellimuse e-post on määramata. Selle tulemusena
                                ei pruugi programm alati sobivalt töötada. Kasutaja seadistusi saab
                                määrata <a href='/settings/user'>Kasutaja seadistustest</a>.
                            </div>
                        }
                        {props.unsetSettings &&
                            <div className='alert alert-warning'>
                                Mõni üldistest seadistustes on määramata. Süsteemi üldisi seadistusi saab
                                määrata <a href='/settings'>Seadistustest</a>.
                            </div>
                        }
                        <h2 id='page-title'>{props.heading}</h2>
                        <NoScript/>
                        {props.children}
                    </div>
                </main>
                <Footer {...props}/>
            </body>
        </html>
    );
};
