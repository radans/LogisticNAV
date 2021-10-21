const inlineForm = require('../common/inline_form.jsx');
const jsonScript = require('../common/json_script');
const api = require('../common/api');

exports.init = () => {
    document.addEventListener('click', async (e) => {
        const target = e.target;
        const button = inlineForm.findAncestor(target, 'vt-order-photo-remove');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Kustuta pilt?')) {
                const wrapper = button.parentNode;
                const data = jsonScript.load('order-data');
                const id = wrapper.dataset.id;
                try {
                    await api.remove(`/api/order/photo/${id}`);
                    window.scheduleFlash('Pilt on kustutatud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga pildi kustutamisel. Palun proovi' +
                        ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                }
            }
        }
    }, false);
};
