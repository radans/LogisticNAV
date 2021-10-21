const api = require('./api');
const button = document.getElementById('menu-collapse');
const menu = document.getElementById('layout-menu');
const body = document.getElementById('layout-body');
const header = document.getElementById('layout-header');
if (button) {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        menu.classList.toggle('vt-menu-collapsed');
        body.classList.toggle('vt-body-expanded');
        header.classList.toggle('vt-header-collapsed');
        const collapsed = menu.classList.contains('vt-menu-collapsed');
        api.save('/api/auth/collapse', { collapsed }).catch((err) => console.log(err));
        const icon = document.getElementById('fold-icon');
        if (collapsed) {
            icon.className = 'fa fa-toggle-right vt-menu-icon';
        } else {
            icon.className = 'fa fa-toggle-left vt-menu-icon';
        }
    }, false);
}
// Schedules new flash message to be shows on
// page reload/refresh/redirect.
window.scheduleFlash = (message) => {
    sessionStorage.setItem('flash_message', message);
};
window.showFlash = (message, isError = false) => {
    const existingHolder = document.querySelector('.vt-flash-error');
    if (existingHolder) {
        existingHolder.innerText = message;
        return;
    }
    const messageHolder = document.createElement('div');
    messageHolder.className = 'vt-flash vt-flash-hidden' + (isError ? ' vt-flash-error' : '');
    messageHolder.innerText = message;
    document.body.appendChild(messageHolder);
    window.requestAnimationFrame(() => {
        messageHolder.classList.remove('vt-flash-hidden');
    });
    if (!isError) {
        setTimeout(() => {
            messageHolder.classList.add('vt-flash-hidden');
            setTimeout(() => {
                messageHolder.remove();
            }, 1000);
        }, 3000);
    }        
};
window.showError = (message) => {
    window.showFlash(message, true);
};
window.showSaveError = (message) => {
    window.showError('Viga andmete salvestamisel. Palun proovi' +
        ' tegevust uuesti teha või võta ühendust arvutispetsialistiga.');
};
// Displays the previously set flash message.
window.addEventListener('load', () => {
    const flashMessage = sessionStorage.getItem('flash_message');
    if (flashMessage) {
        sessionStorage.removeItem('flash_message');
        window.showFlash(flashMessage);            
    }
});
window.hideLoader = () => {
    const existing = document.querySelector('.vt-page-loader');
    if (existing) {
        existing.remove();
    }
};
window.showLoader = (message) => {
    window.hideLoader();
    const messageHolder = document.createElement('div');
    messageHolder.className = 'vt-page-loader-message';
    messageHolder.innerText = message;
    const loader = document.createElement('div');
    loader.className = 'vt-loader';
    const spinnerHolder = document.createElement('div');
    spinnerHolder.className = 'vt-page-loader-spinner';
    spinnerHolder.appendChild(loader);
    const loaderHolder = document.createElement('div');
    loaderHolder.className = 'vt-page-loader';
    loaderHolder.appendChild(spinnerHolder);
    loaderHolder.appendChild(messageHolder);
    document.body.appendChild(loaderHolder);
};
