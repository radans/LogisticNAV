module.exports = (props) => {
    const classes = ['vt-header', 'hidden-print'];
    if (props.collapsed) {
        classes.push('vt-header-collapsed');
    }
    return (
        <header className={classes.join(' ')} id='layout-header'>
            <img className='vt-logo' src={`/v-${props.version}/logo.jpg`}
                            width='65' height='70'/>
            <h1>LogisticNAV</h1>
            {props.user && <div className='vt-header-user vt-text-green'>
                <strong>Sisse loginud: <a href='/settings/user'>{props.user.name}</a></strong></div>}
        </header>
    );
};
