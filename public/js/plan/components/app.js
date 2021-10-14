const model = require('../model');
const template = require('./app.html');
const save = require('../save');

const createViewModel = () => {
    const instance = model.create();
    window.model = instance;
    const formScript = document.getElementById('data-form');
    const orderScript = document.getElementById('data-order');
    const data = formScript ? JSON.parse(formScript.innerText) : null;
    const order = orderScript ? JSON.parse(orderScript.innerText) : null;
    instance.initialize(data, order);
    return instance;
};

ko.components.register('kp-app', {
    viewModel: { createViewModel }, template
});

window.addEventListener('mousemove', (e) => {
    if (window.model) {
        window.model.action.mouseMove(e);
    }
}, false);

save.init();
