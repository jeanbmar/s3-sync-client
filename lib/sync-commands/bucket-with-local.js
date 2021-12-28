const EventEmitter = require('events');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('../constants');
const UploadManager = require('../sync-managers/upload-manager');
const syncDiff = require('../utilities/sync-diff');
const { parsePrefix } = require('../utilities/bucket-helper');

async function bucketWithLocal(localDir, bucketPrefix, options = {}) {
    const {
        commandInput = {},
        del = false,
        dryRun = false,
        sizeOnly = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
        relocations = [],
    } = options;
    const { bucket, prefix } = parsePrefix(bucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listLocalObjects(localDir),
        this.listBucketObjects(bucket, { prefix }),
    ]);
    if (prefix !== '') {
        relocations.push(['', prefix]);
    }
    sourceObjects.forEach((sourceObject) => sourceObject.applyRelocations(relocations));
    let pUpload;
    const { created, updated, deleted } = syncDiff(sourceObjects, targetObjects, sizeOnly);
    const uploads = [...created, ...updated];
    if (!dryRun) {
        const transferManager = new UploadManager({
            client: this.client,
            objects: uploads,
            commandInput,
            maxConcurrentTransfers,
            monitor,
            bucket,
        });
        pUpload = transferManager.done();
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = deleted;
        if (!dryRun) {
            const keysToDelete = deletions.map(({ key }) => key);
            pDelete = this.deleteBucketObjects(bucket, keysToDelete);
        }
    }
    await Promise.all([pUpload, pDelete]);
    return { uploads, deletions };
}

module.exports = bucketWithLocal;
