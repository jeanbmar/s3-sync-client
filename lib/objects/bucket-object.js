const SyncObject = require('./sync-object');

class BucketObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.size = properties.size;
        this.lastModified = properties.lastModified;
    }
}

module.exports = BucketObject;
