class UploadObjectCommand {
    constructor(properties = {}) {
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.path = properties.path;
        this.size = properties.size;
    }

    static from(localObject, bucket) {
        return new this({
            bucket,
            key: localObject.id,
            size: localObject.size,
            path: localObject.path,
        });
    }
}

module.exports = UploadObjectCommand;
