const EventEmitter = require('events');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const TransferManager = require('./transfer-manager');
const {
    parseBucketPrefix,
    diff,
} = require('./util');
const CopyObjectCommand = require('./commands/copy-object-command');

async function bucketWithBucket(sourceBucketPrefix, targetBucketPrefix, options = {}) {
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
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
    sourceObjects.forEach((sourceObject) => sourceObject.applyRelocations(relocations));
    let pCopy;
    const { created, updated, deleted } = diff(sourceObjects, targetObjects);
    const copies = [...created, ...updated]
        .map((bucketObject) => CopyObjectCommand.from(bucketObject, targetBucket));
    if (!dryRun) {
        const transferManager = new TransferManager({
            client: this,
            maxConcurrentTransfers,
            monitor,
        });
        pCopy = transferManager.copy(copies);
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = deleted;
        if (!dryRun) {
            const keysToDelete = deletions.map(({ key }) => key);
            pDelete = this.deleteBucketObjects(targetBucket, keysToDelete);
        }
    }
    await Promise.all([pCopy, pDelete]);
    return { copies, deletions };
}

module.exports = bucketWithBucket;
