const template = require('./item.html');
const pixel = require('./helper/pixel');

const createViewModel = ({item, sheet}) => {
    return {
        item: item,
        sheet: sheet,
        binding: {
            style: {
                height: pixel.pixelValue(item.dimensions.height),
                width: pixel.pixelValue(item.dimensions.width),
                background: item.background
            },
            event: { click: item.action.click },
            css: {
                'kp-package-empty': item.empty,
                'kp-production': item.production,
                'kp-marked': ko.pureComputed(() => (item.marker() || '').length > 0),
                'kp-package-vertical': ko.pureComputed(() =>
                    item.dimensions.height() > item.dimensions.width())
            }
        }
    };
};

ko.components.register('kp-item', {
    viewModel: { createViewModel }, template
});
