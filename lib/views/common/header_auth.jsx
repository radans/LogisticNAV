module.exports = (props) => {
    return (
        <header className='login-header'>
            <img src={`/v-${props.version}/logo.jpg`} width='150' height='135'/>
            <h1 className='vt-login-title'>Astel EST</h1>
        </header>
    );
};
