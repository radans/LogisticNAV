const jsonScript = require('../common/json_script');
const api = require('../common/api');

// Helper to send the order mail.

exports.init = () => {
    const sendButton = document.getElementById('send-button');
    if (!sendButton) {
        return;
    }
    sendButton.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = jsonScript.load('order-data');
        let text = 'Saada tellimus vedajale?';
        if (data.sent_date !== null) {
            text = 'Tellimus on varem saadetud. Saada uuesti?';
        }
        if (confirm(text)) {
            try {
                window.showLoader('Saadan e-posti...');
                await api.save(`/api/order/send/${data.id}`, {});
                window.scheduleFlash('Tellimus on vedajale saadetud.');
                window.location.reload();
            } catch (err) {
                window.showError('Viga tellimuse saatmisel. Palun proovi' +
                    ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
            } finally {
                window.hideLoader();
            }
        }
    }, false);
};
