module.exports = ({id, name}) => {
    return id ? <a href={`/companies/${id}`}>{name}</a> : '-';
};
