const SyncObject = require('./sync-object');

class LocalObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.size = properties.size;
        this.lastModified = properties.lastModified;
        this.path = properties.path;
    }
}

module.exports = LocalObject;
