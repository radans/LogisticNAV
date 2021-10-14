const api = require('../common/api');
const users = require('./users.jsx');
const color = require('./color.jsx');

users.init();
color.init();

document.addEventListener('click', async (e) => {
    if (e.target.className === 'vt-salesperson-remove') {
        const row = e.target.parentNode.parentNode.parentNode.parentNode;
        const question = `Kustuta müügijuht "${row.dataset.name}"?` +
            ` Müügijuhiga seotud tellimused saavad "määramata" valiku.`;
        if (confirm(question)) {
            const url = `/api/salesperson/${encodeURIComponent(row.dataset.salesperson)}`;
            await api.remove(url);
            window.scheduleFlash('Müügijuht on kustutatud.');
            window.location.reload();
        }
    }
}, false);
