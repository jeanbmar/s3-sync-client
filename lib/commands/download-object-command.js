const path = require('path');
const { posixPathToLocalPath } = require('../util');

class DownloadObjectCommand {
    constructor(properties = {}) {
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.path = properties.path;
        this.size = properties.size;
    }

    static from(bucketObject, rootDir) {
        const relativePath = posixPathToLocalPath(bucketObject.id);
        const filePath = path.join(rootDir, relativePath);
        return new this({
            bucket: bucketObject.bucket,
            key: bucketObject.key,
            size: bucketObject.size,
            path: filePath,
        });
    }
}

module.exports = DownloadObjectCommand;
