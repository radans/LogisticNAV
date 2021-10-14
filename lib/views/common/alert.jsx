// Helper to display alert message boxes.

module.exports = (props) => {
    const type = props.type || 'success';
    return (
        <div className={`alert alert-${type}`}>
            {props.children}
        </div>
    );
};
