module.exports = (props) => {
    return (
        <header className='login-header'>
            <img src={`/v-${props.version}/logo.svg`} width='198' height='150'/>
            <h1 className='vt-login-title'>LogisticNAV</h1>
        </header>
    );
};
