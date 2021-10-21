const template = require('./side.html');
const pixel = require('./helper/pixel');

const createViewModel = ({side, sheet}) => {
    return {
        side: side,
        sheet: sheet,
        binding: {
            style: {
                height: pixel.pixelValue(ko.pureComputed(() =>
                    window.model.sheet.sideHeight())),
                width: pixel.pixelValue(ko.pureComputed(() =>
                    window.model.sheet.sideWidth()))
            },
            css: {
                'kp-truck-side-error': ko.pureComputed(() => side().intersect()),
                'kp-truck-side-target': ko.pureComputed(() => side().target())
            },
            attr: {
                id: ko.pureComputed(() => 'side-' + side().index)
            }
        }
    };
};

ko.components.register('kp-side', {
    viewModel: { createViewModel }, template
});
