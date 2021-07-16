class CopyObjectCommand {
    constructor(properties = {}) {
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.sourceBucket = properties.sourceBucket;
        this.sourceKey = properties.sourceKey;
        this.size = properties.size;
    }

    static from(sourceBucketObject, targetBucket) {
        return new this({
            bucket: targetBucket,
            key: sourceBucketObject.id,
            size: sourceBucketObject.size,
            sourceBucket: sourceBucketObject.bucket,
            sourceKey: sourceBucketObject.key,
        });
    }
}

module.exports = CopyObjectCommand;
