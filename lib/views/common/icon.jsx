// Helper to display Font-Awesome icons.

module.exports = ({name, id, extraClass}) => {
    const classes = ['fa', `fa-${name}`];
    if (extraClass) {
        classes.push(extraClass);
    }
    return (
        <i className={classes.join(' ')} aria-hidden='true' id={id}></i>
    );
};
