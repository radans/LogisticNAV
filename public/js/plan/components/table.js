const template = require('./table.html');

const createViewModel = ({sheet}) => {
    return {sheet};
};

ko.components.register('kp-table', {
    viewModel: { createViewModel }, template
});
