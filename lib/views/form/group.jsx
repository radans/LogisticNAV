module.exports = ({children, size, error}) => {
    const classes = ['form-group'];
    if (size) {
        classes.push(`form-group-${size}`);
    }
    if (error) {
        classes.push(`has-error`);
    }
    return (
        <div className={classes.join(' ')}>
            {children}
        </div>
    );
};
