const path = require('path');

module.exports = {
    toLocalPath(filePath) {
        return filePath.split(path.posix.sep).join(path.sep);
    },
    toPosixPath(filePath) {
        return filePath.split(path.sep).join(path.posix.sep);
    },
};
