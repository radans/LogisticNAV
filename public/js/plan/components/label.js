const template = require('./label.html');

const createViewModel = ({item, placed}) => {
    return {
        binding: {
            text: placed ? item.code : item.packageInfo,
            style: { background: item.color }           
        }
    };
};

ko.components.register('kp-label', {
    viewModel: { createViewModel }, template
});
