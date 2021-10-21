const api = require('../common/api');

exports.installSendHandler = () => {
    document.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('vt-send-button')) {
            e.preventDefault();
            e.stopPropagation();
            const row = target.parentNode.parentNode.parentNode;        
            let text = 'Saada tellimus vedajale?';
            if (row.dataset.sent > 0) {
                text = 'Tellimus on varem saadetud. Saada uuesti?';
            }
            if (confirm(text)) {
                try {
                    window.showLoader('Saadan e-posti...');
                    await api.save(`/api/order/send/${row.dataset.order}`, {});
                    window.scheduleFlash('Tellimus on vedajale saadetud.');
                    window.location.reload();
                } catch (err) {
                    window.showError('Viga tellimuse saatmisel. Palun proovi' +
                        ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
                } finally {
                    window.hideLoader();
                }
            }
        }
    });
};
