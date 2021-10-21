// Returns swap-pair.

exports.up = (i, length) => {
    if (i <= 0) {
        return [i, length - 1];
    } else if (i <= length - 1) {
        return [i, i - 1];
    } else {
        return [i, i];
    }
};

// Returns swap-pair.

exports.down = (i, length) => {
    if (i >= length - 1) {
        return [i, 0];
    } else if (i >= 0) {
        return [i, i + 1];
    } else {
        return [i, i];
    }
};

// Swaps properties at the given positions.
// Properties are set on fresh objects.

exports.swapProps = (array, i, j) => {
    const x = Object.assign({}, array[i]);
    const y = Object.assign({}, array[j]);
    array[i] = y;
    array[j] = x;
};
