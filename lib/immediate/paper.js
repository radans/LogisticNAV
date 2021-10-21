// Layout-related absolute location constants.

exports.WIDTH = 841.89;
exports.HEIGHT = 595.28;
exports.MARGIN = 30;
exports.GUTTER = 10;
exports.TITLE_SIZE = 16.5;
exports.TEXT_SIZE = 11;
exports.NAME_TEXT_SIZE = 9;
exports.SIDE_HEIGHT = (exports.HEIGHT - 2 * exports.MARGIN -
    exports.TITLE_SIZE - 2 * exports.GUTTER) / 2;
exports.SIDE_INNER_WIDTH = 560;
exports.SIDE_INNER_HEIGHT = exports.SIDE_HEIGHT - exports.TEXT_SIZE - 5;

exports.draw = (doc, fn) => {
    doc.save();
    fn(doc);
    doc.restore();
};
