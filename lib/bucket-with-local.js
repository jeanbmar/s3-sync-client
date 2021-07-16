const EventEmitter = require('events');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const TransferManager = require('./transfer-manager');
const {
    parseBucketPrefix,
    diff,
} = require('./util');
const UploadObjectCommand = require('./commands/upload-object-command');

async function bucketWithLocal(localDir, bucketPrefix, options = {}, s3Options = {}) {
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
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
    sourceObjects.forEach((sourceObject) => sourceObject.applyRelocations(relocations));
    let pUpload;
    const { created, updated, deleted } = diff(sourceObjects, targetObjects);
    const uploads = [...created, ...updated]
        .map((localObject) => UploadObjectCommand.from(localObject, bucket));
    if (!dryRun) {
        const transferManager = new TransferManager({
            client: this,
            maxConcurrentTransfers,
            monitor,
        });
        pUpload = transferManager.upload(uploads, s3Options);
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
