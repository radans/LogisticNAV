module.exports = class Numbers extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {        
        const { orders } = this.props;
        const count = orders.reduce((prev, cur) => prev + (cur.price === 0 ? 0 : (cur.full_load ? 1 : 0.5)), 0);
        const totalPrice = orders.reduce((prev, cur) => prev + cur.price, 0);
        const averagePrice = totalPrice / count;
        const maxPrice = orders.reduce((prev, cur) => Math.max(prev, cur.price), 0);
        const minPrice = orders.reduce((prev, cur) => Math.min(prev, cur.price), Number.MAX_VALUE);
        return (
            <table className='table table-bordered table-striped'>
                <tbody>
                    <tr>
                        <th>Laadimiste kogus</th><td>{count.toFixed(1)}</td>
                    </tr>
                    <tr>
                        <th>Summa kokku</th><td>{totalPrice.toFixed(0)}</td>
                    </tr>
                    <tr>
                        <th>Keskmine hind</th><td>{averagePrice.toFixed(0)}</td>
                    </tr>
                    <tr>
                        <th>Maksimaalne hind</th><td>{maxPrice.toFixed(0)}</td>
                    </tr>
                    <tr>
                        <th>Minimaalne hind</th><td>{minPrice.toFixed(0)}</td>
                    </tr>
                    <tr>
                        <th>Hinnavahe</th><td>{(maxPrice - minPrice).toFixed(0)}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
};
