const Icon = require('../common/icon.jsx');

module.exports = ({order, version}) => {
    return (
        <div className='vt-order-photos'>
            {order.photos.map((photo, i) =>
                <div
                    key={photo.id}
                    className='vt-order-photo-wrap'
                    data-id={photo.id}
                    data-index={i}>
                    <a href={`/v-${version}/order/photo/${photo.id}/full.jpg`} target='_blank'>
                        <img
                            width='200'
                            height='150'
                            className='vt-order-photo'
                            src={`/v-${version}/order/photo/${photo.id}/th.jpg`}/></a>
                    <div className='vt-order-photo-remove'>
                        <a href='#'><Icon name='times'/></a>
                    </div>
                </div>)}
        </div>
    );    
};
