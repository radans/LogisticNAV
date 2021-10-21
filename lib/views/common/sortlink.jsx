const Icon = require('./icon');

module.exports = ({field, paginator, label}) => {
    const active = paginator.order === field;
    const actualLabel = label || '';
    return (
        <a className={active ? 'vt-sort-active' : null}
            href={`?${paginator.sortLink(field)}`}>{actualLabel} <Icon name='sort'/></a>
    );
};
