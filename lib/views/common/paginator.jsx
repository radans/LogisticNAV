const Link = ({type, page, query, current}) => {
    let label = page + 1;
    let selectedClass = 'active';
    if (type === 'prev') {
        label = '«';
        selectedClass = 'disabled';        
    } else if (type === 'next') {
        label = '»';
        selectedClass = 'disabled';
    }
    const className = current ? selectedClass : null;
    return (
        <li className={className}>
            {!current && <a href={`?${query}`}>{label}</a>}
            {current && <span>{label}</span>}
        </li>
    );
};

module.exports = (props) => {
    const paginator = props.paginator;
    return (
        <ul className='pagination hidden-print'>
            {paginator.links.map((link) => <Link key={`${link.type}-${link.page}`} {...link}/>)}
        </ul>
    );
};
