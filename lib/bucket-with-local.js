const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const Relocator = require('./relocator');
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
        relocations = [],
    } = options;
    const { bucket, prefix } = parseBucketPrefix(bucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listLocalObjects(localDir),
        this.listBucketObjects(bucket, { prefix }),
    ]);
    if (prefix !== '') {
        relocations.push(['', prefix]);
    }
    const relocatedObjects = Relocator.relocateMap(sourceObjects, relocations);
    let pUpload;
    const uploads = getObjectsToTransfer(relocatedObjects, targetObjects);
    if (!dryRun) {
        pUpload = this.uploadObjects(bucket, uploads, { maxConcurrentTransfers });
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = getObjectsToDelete(relocatedObjects, targetObjects);
        if (!dryRun) {
            const keysToDelete = deletions.map(({ key }) => key);
            pDelete = this.deleteBucketObjects(bucket, keysToDelete);
        }
    }
    await Promise.all([pUpload, pDelete]);
    return { uploads, deletions };
}

module.exports = bucketWithLocal;
