const Icon = require('../common/icon.jsx');

// Used by Bootstrap JavaScript components.

const dataProps = [
    'toggle',
    'target'
].map((prop) => 'data-' + prop);

const Button = module.exports = (props) => {
    const classes = ['btn', 'btn-default', 'hidden-print'];
    if (props.size) {
        classes.push(`btn-${props.size}`);
    }
    const href = props.href || '#';
    const dataAttr = {};
    for (const key of dataProps) {
        dataAttr[key] = props[key];
    }
    return (
        <a
            href={href}
            className={classes.join(' ')}
            {...dataAttr}
            id={props.id}
            onClick={props.onClick}>
            {props.icon && <Icon name={props.icon}/>} {props.label}</a>
    );
};
