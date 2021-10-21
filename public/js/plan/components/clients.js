const template = require('./clients.html');

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-clients', {
    viewModel: { createViewModel }, template
});
