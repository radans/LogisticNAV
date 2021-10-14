const Icon = require('./icon');

const itemClasses = (name, selected) => {
    const classes = ['vt-menu-item'];
    if (name === selected) {
        classes.push('active');
    }
    return classes.join(' ');
};

// Helper to display the application menu.

module.exports = (props) => {
    const { menu, collapsed } = props;
    const icon = collapsed ? 'toggle-right' : 'toggle-left';
    return (
        <ul className='nav nav-sidebar'>
            <li className={itemClasses('orders', menu)}><a href='/orders'>
                <Icon name='database' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Tellimused</span></a></li>
            <li className={itemClasses('plans', menu)}><a href='/plans'>
                <Icon name='photo' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Plaanid</span></a></li>
            <li className={itemClasses('calendar', menu)}><a href='/calendar/week'>
                <Icon name='calendar' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Kalender</span></a></li>
            <li className={itemClasses('companies', menu)}><a href='/companies'>
                <Icon name='truck' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Vedajad</span></a></li>
            <li className={itemClasses('addresses', menu)}><a href='/addresses'>
                <Icon name='location-arrow' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Aadressid</span></a></li>
            <li className={itemClasses('salespeople', menu)}><a href='/salespeople'>
                <Icon name='money' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Müügijuhid</span></a></li>
            <li className={itemClasses('packages', menu)}><a href='/packages'>
                <Icon name='th' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Pakid</span></a></li>
            <li className={itemClasses('statistics', menu)}><a href='/statistics'>
                <Icon name='bar-chart' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Statistika</span></a></li>
            {props.user.master_user &&
                <li className={itemClasses('users', menu)}><a href='/users'>
                    <Icon name='users' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Kasutajad</span></a></li>}
            <li className={itemClasses('settings', menu)}><a href='/settings'>
                <Icon name='cog' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Seaded</span></a></li>
            <li className='vt-menu-item'><a href='/logout'>
                <Icon name='sign-out' extraClass='vt-menu-icon' /> <span className='vt-menu-label'>Välju</span></a></li>
            <li className='vt-menu-item'><a href='#' id='menu-collapse'>
                <Icon name={icon} extraClass='vt-menu-icon' id='fold-icon' /> <span className='vt-menu-label'>Voldi</span></a></li>
        </ul>
    );
};
