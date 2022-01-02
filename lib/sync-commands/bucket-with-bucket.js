const EventEmitter = require('events');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('../constants');
const CopyManager = require('../sync-managers/copy-manager');
const syncDiff = require('../utilities/sync-diff');
const { parsePrefix } = require('../utilities/bucket-helper');

async function bucketWithBucket(sourceBucketPrefix, targetBucketPrefix, options = {}) {
    const {
        commandInput = {},
        del = false,
        dryRun = false,
        sizeOnly = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
        relocations = [],
        exclude = [],
    } = options;
    const { bucket: sourceBucket, prefix: sourcePrefix } = parsePrefix(sourceBucketPrefix);
    const { bucket: targetBucket, prefix: targetPrefix } = parsePrefix(targetBucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listBucketObjects(sourceBucket, { prefix: sourcePrefix }),
        this.listBucketObjects(targetBucket, { prefix: targetPrefix }),
    ]);
    if (targetPrefix !== '') {
        relocations.push(['', targetPrefix]);
    }
    sourceObjects.forEach((sourceObject) => sourceObject.applyRelocations(relocations));
    let pCopy;
    const { created, updated, deleted } = syncDiff(sourceObjects, targetObjects, sizeOnly, exclude);
    const copies = [...created, ...updated];
    if (!dryRun) {
        const copyManager = new CopyManager({
            client: this,
            objects: copies,
            commandInput,
            maxConcurrentTransfers,
            monitor,
            targetBucket,
        });
        pCopy = copyManager.done();
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
