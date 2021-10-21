const jsonScript = require('../common/json_script');

exports.init = () => {
    const pswpElement = document.querySelector('.pswp');
    if (!pswpElement) {
        throw new Error('No pswp element.');
    }
    const title = jsonScript.load('order-data').order_name;
    const slides = [];
    const items = document.querySelectorAll('.vt-order-photo-wrap');
    for (const item of items) {
        const link = item.querySelector('a');
        const img = link.querySelector('img');        
        slides.push({
            src: link.href,
            title: title,
            msrc: img.src,
            w: 2048,
            h: 1536
        });
        img.addEventListener('click', (e) => {
            const index = parseInt(item.dataset.index, 10);
            const gallery = new PhotoSwipe(pswpElement,
                PhotoSwipeUI_Default, slides, {
                    index,
                    history: false,
                    shareButtons: [
                        {
                            id: 'download',
                            label: 'Tõmba arvutisse',
                            url:'{{raw_image_url}}',
                            download: true
                        }
                    ]
                });
            gallery.init();
            e.preventDefault();
            e.stopPropagation();
        }, false);
    }
};
