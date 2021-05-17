const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const {
    parseBucketPrefix,
    getObjectsToTransfer,
    getObjectsToDelete,
} = require('./util');

async function bucketWithLocal(localDir, bucketPrefix, options = {}) {
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
    } = options;
    const { bucket, prefix } = parseBucketPrefix(bucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listLocalObjects(localDir, { prefix }),
        this.listBucketObjects(bucket, { prefix }),
    ]);
    let pUpload;
    const uploads = getObjectsToTransfer(sourceObjects, targetObjects);
    if (!dryRun) {
        pUpload = this.uploadObjects(bucket, uploads, { maxConcurrentTransfers });
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = getObjectsToDelete(sourceObjects, targetObjects);
        if (!dryRun) {
            const keysToDelete = deletions.map(({ key }) => key);
            pDelete = this.deleteBucketObjects(bucket, keysToDelete);
        }
    }
    await Promise.all([pUpload, pDelete]);
    return { uploads, deletions };
}

module.exports = bucketWithLocal;
