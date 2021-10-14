module.exports = (props) => {
    const ravenConfig = {
        __html: `Raven.config('https://9bdd9c2b5da84d7b944d73be16a8938f@sentry.io/165746').install();`
    };
    return (
        <footer>            
            <script src={`/v-${props.version}/js/libs/flatpickr.min.js`}></script>
            <script src={`/v-${props.version}/js/libs/flatpickr-et.js`}></script>
            <script src={`/v-${props.version}/js/common.bundle.js`}/>
            {props.production && <script src={`/v-${props.version}/js/react/react.min.js`}/>}
            {props.production && <script src={`/v-${props.version}/js/react/react-dom.min.js`}/>}
            {!props.production && <script src={`/v-${props.version}/js/react/react.js`}/>}
            {!props.production && <script src={`/v-${props.version}/js/react/react-dom.js`}/>}
            {typeof props.pageScript === 'string' &&
                <script src={`/v-${props.version}/js/${props.pageScript}`}></script>}
            {Array.isArray(props.pageScript) &&
                props.pageScript.map(script =>
                    <script key={script} src={`/v-${props.version}/js/${script}`}></script>)}
            <script src='https://cdn.ravenjs.com/3.15.0/raven.min.js'></script>
            <script dangerouslySetInnerHTML={ravenConfig}></script>
        </footer>
    );
};
