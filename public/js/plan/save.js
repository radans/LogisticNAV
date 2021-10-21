const log = require('./log');

let lastSave = 0;
let saving = false;

const immediateSave = async (immediate) => {
    log.debug('Immediate save started.');
    try {
        saving = true;
        await window.model.sheet.save();
    } catch (e) {
        throw e;
    } finally {
        saving = false;
        lastSave = Date.now();
        log.debug('Immediate save finished.');
    }
};

const parentAnchor = (element) => {
    if (!element) {
        return null;
    }
    if (element.href) {
        return element;
    }
    return parentAnchor(element.parentNode);
};

exports.init = () => {
    log.debug('Initializing the save helper.');
    document.addEventListener('click', async (e) => {
        const anchor = parentAnchor(e.target);
        if (!anchor) {
            return;
        }
        if (anchor.href.match(/#[^#]*$/)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        await immediateSave();
        if (anchor.target && anchor.target.match(/^plan_/)) {
            window.open(anchor.href, anchor.target);
        } else {
            window.location = anchor.href;
        }        
    }, false);
    log.debug('Save helper initialized.');
};

const periodicSave = async () => {
    if (saving) {
        return;
    }
    log.debug('Periodic save started.');
    try {
        saving = true;
        await window.model.sheet.save();
    } finally {
        saving = false;
        lastSave = Date.now();
        log.debug('Periodic save finished.');
    }
};

const ITERATE_INTERVAL = 1000;

const iterateSave = async () => {
    try {
        await periodicSave();
    } finally {
        setTimeout(iterateSave, ITERATE_INTERVAL);
    }
};

setTimeout(iterateSave, ITERATE_INTERVAL);
