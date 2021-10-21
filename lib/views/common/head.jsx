module.exports = (props) => {
    const oldCheck = {
        __html: [
            'var asyncFunctions = (function() {',
                'try { new Function("async () => {}")(); } catch (err) { return false; }',
                'return true;',
            '})();',
            'if (!asyncFunctions) { window.location.href = "/old"; }',
        ].join(' ')
    };
    return (
        <head>
            <meta charSet='utf-8'/>
            <title>{props.title}</title>
            <script dangerouslySetInnerHTML={oldCheck}></script>
            <meta name='viewport' content='width=device-width, initial-scale=1'/>
            <link rel='stylesheet' href={`/v-${props.version}/css/font-awesome.min.css`}/>
            <link rel='stylesheet' href={`/v-${props.version}/css/bootstrap.min.css`}/>
            <link rel='stylesheet' href={`/v-${props.version}/css/flatpickr.min.css`}/>
            <link rel='stylesheet' href={`/v-${props.version}/css/style.css`}/>
            {typeof props.pageStyle === 'string' &&
                <link rel='stylesheet' href={`/v-${props.version}/css/${props.pageStyle}`}/>}
            {Array.isArray(props.pageStyle) &&
                props.pageStyle.map(style =>
                    <link key={style} rel='stylesheet' href={`/v-${props.version}/css/${style}`}/>)
            }
        </head>
    );
};
