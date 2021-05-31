const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const Relocator = require('./relocator');
const {
    parseBucketPrefix,
    getObjectsToTransfer,
    getObjectsToDelete,
} = require('./util');

async function bucketWithBucket(sourceBucketPrefix, targetBucketPrefix, options = {}) {
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        relocations = [],
    } = options;
    const { bucket: sourceBucket, prefix: sourcePrefix } = parseBucketPrefix(sourceBucketPrefix);
    const { bucket: targetBucket, prefix: targetPrefix } = parseBucketPrefix(targetBucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listBucketObjects(sourceBucket, { prefix: sourcePrefix }),
        this.listBucketObjects(targetBucket, { prefix: targetPrefix }),
    ]);
    if (targetPrefix !== '') {
        relocations.push(['', targetPrefix]);
    }
    const relocatedObjects = Relocator.relocateMap(sourceObjects, relocations);
    let pCopy;
    const copies = getObjectsToTransfer(relocatedObjects, targetObjects);
    if (!dryRun) {
        pCopy = this.copyObjects(targetBucket, sourceBucket, copies, { maxConcurrentTransfers });
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = getObjectsToDelete(relocatedObjects, targetObjects);
        if (!dryRun) {
            const keysToDelete = deletions.map(({ key }) => key);
            pDelete = this.deleteBucketObjects(targetBucket, keysToDelete);
        }
    }
    await Promise.all([pCopy, pDelete]);
    return { copies, deletions };
}

module.exports = bucketWithBucket;
