module.exports = ({people}) => {
    if (people.length === 0) {
        return null;
    }
    return (
        <table className='table table-borderless'>
            <tbody>            
                {people.map(person =>
                    <tr key={person.id} style={{background: person.color}}>
                        <td>{person.name} ({person.count})</td>
                    </tr>)}
            </tbody>
        </table>
    );
};
