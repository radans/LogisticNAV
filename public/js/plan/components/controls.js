const template = require('./controls.html');

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-controls', {
    viewModel: { createViewModel }, template
});
