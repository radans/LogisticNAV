const template = require('./movable.html');
const pixel = require('./helper/pixel');

const createViewModel = ({movable, click}) => {
    return {
        binding: {
            visible: movable.visible,
            style: {
                top: pixel.pixelValue(movable.top),
                left: pixel.pixelValue(movable.left),
                width: pixel.pixelValue(movable.width),
                height: pixel.pixelValue(movable.height)
            },
            click: click
        }
    };
};

ko.components.register('kp-movable', {
    viewModel: { createViewModel }, template
});
