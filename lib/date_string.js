// 1993-06-30 to 30.06.1993.

exports.toEstonian = (string) => {
    const match = string.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
    if (!match) {
        throw new Error('Invalid date.');
    }
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);    
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
};

// 30.06.1993 to 1993-06-30.

exports.fromEstonian = (string) => {
    const match = string.match(/^(\d\d)\.(\d\d)\.(\d\d\d\d)$/);
    if (!match) {
        throw new Error('Invalid date.');
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};
