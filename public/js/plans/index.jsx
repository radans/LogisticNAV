const api = require('../common/api');
const order = require('./order.jsx');
const send = require('./send.jsx');

// Sets up order selection form.
order.init();

// Sets up send form.
send.init();

document.addEventListener('click', async (e) => {
    if (e.target.className === 'vt-plans-remove') {
        const row = e.target.parentNode.parentNode.parentNode.parentNode;
        if (confirm(`Kustuta plaan "${row.dataset.name}"?`)) {
            const url = `/api/plan/${encodeURIComponent(row.dataset.plan)}`;
            await api.remove(url);
            window.scheduleFlash('Plaan on kustutatud.');
            window.location.reload();
        }
    }
}, false);
