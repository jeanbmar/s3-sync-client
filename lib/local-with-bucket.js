const fsp = require('fs').promises;
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const Relocator = require('./relocator');
const {
    parseBucketPrefix,
    getObjectsToTransfer,
    getObjectsToDelete,
} = require('./util');

async function localWithBucket(bucketPrefix, localDir, options = {}) {
    const { bucket, prefix } = parseBucketPrefix(bucketPrefix);
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        flatten = false, // deprecated, use relocation instead
        relocations = flatten ? [[prefix, '']] : [],
    } = options;
    await fsp.mkdir(localDir, { recursive: true });
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listBucketObjects(bucket, { prefix }),
        this.listLocalObjects(localDir),
    ]);
    const relocatedObjects = Relocator.relocateMap(sourceObjects, relocations);
    let pDownload;
    const downloads = getObjectsToTransfer(relocatedObjects, targetObjects);
    if (!dryRun) {
        pDownload = this.downloadObjects(localDir, bucket, downloads, { maxConcurrentTransfers });
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = getObjectsToDelete(relocatedObjects, targetObjects);
        if (!dryRun) {
            const filesToDelete = deletions.map(({ path: filePath }) => filePath);
            pDelete = Promise.all(filesToDelete.map((filePath) => fsp.unlink(filePath)));
        }
    }
    await Promise.all([pDownload, pDelete]);
    return { downloads, deletions };
}

module.exports = localWithBucket;
