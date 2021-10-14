// Dumps data as application/json script element.

module.exports = ({data, id}) => {
    const obj = { __html: JSON.stringify(data) };
    return (
        <script type='application/json' id={id} dangerouslySetInnerHTML={obj}></script>
    );
};
