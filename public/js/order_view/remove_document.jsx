const jsonScript = require('../common/json_script');
const api = require('../common/api');

exports.init = () => {
    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('vt-order-document-remove')) {
            e.preventDefault();
            e.stopPropagation();
            const documentId = target.dataset.document;
            const name = target.dataset.name;
            if (confirm(`Kustuta dokument ${name}?`)) {
                try {
                    await api.remove(`/api/order/document/${documentId}`);
                    window.scheduleFlash('Dokument on kustutatud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga dokumendi kustutamisel. Palun proovi' +
                        ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                }
            }
        }
    }, false);
};
