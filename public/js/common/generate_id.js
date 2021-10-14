// Helper to generate unique ids wrt to
// current execution context.

let id = 0;

module.exports = () => {
    return (id++).toString();
};
