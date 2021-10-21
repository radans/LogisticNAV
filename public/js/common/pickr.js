// Helper to construct a flatpickr instance.

module.exports = (element, fn, clear = false) => {
    const options = {
        dateFormat: 'd.m.Y',
        locale: 'et',
        onChange: fn
    };
    if (clear) {
        options.onReady = (dateObj, dateStr, instance) => {
            const clear = document.createElement('div');
            clear.className = 'flatpickr-clear';
            clear.textContent = 'Tühjenda';
            clear.addEventListener('click', (e) => {
                instance.clear();
                instance.close();
            });
            instance.calendarContainer.appendChild(clear);
        };
    }
    return flatpickr(element, options);
};
