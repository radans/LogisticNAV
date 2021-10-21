const template = require('./settings.html');

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-settings', {
    viewModel: { createViewModel }, template
});
