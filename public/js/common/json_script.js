// Loads JSON script from the given element.

exports.load = (id) => {
    const element = document.getElementById(id);
    if (element) {
        return JSON.parse(element.innerText);
    }
    return null;
};
