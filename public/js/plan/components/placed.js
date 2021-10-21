const template = require('./placed.html');
const pixel = require('./helper/pixel');

const createViewModel = ({item, sheet}) => {
    const package = item.package();
    return {
        item: item,
        sheet: sheet,
        package: package,
        binding: {
            style: {
                left: pixel.pixelValue(item.left),
                top: pixel.pixelValue(item.top),
                height: pixel.pixelValue(package.dimensions.height),
                width: pixel.pixelValue(package.dimensions.width),
                background: package.background
            },
            event: { click: item.action.click },
            css: {
                'kp-production': package.production,
                'kp-marked': ko.pureComputed(() => (package.marker() || '').length > 0),
                'kp-virtual': ko.pureComputed(() => !item.main()),
                'kp-package-vertical': ko.pureComputed(() =>
                    package.dimensions.height() > package.dimensions.width())
            }
        }
    };
};

ko.components.register('kp-placed', {
    viewModel: { createViewModel }, template
});
