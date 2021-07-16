const EventEmitter = require('events');
const fsp = require('fs').promises;
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');
const TransferManager = require('./transfer-manager');
const {
    parseBucketPrefix,
    diff,
} = require('./util');
const DownloadObjectCommand = require('./commands/download-object-command');

async function localWithBucket(bucketPrefix, localDir, options = {}) {
    const { bucket, prefix } = parseBucketPrefix(bucketPrefix);
    const {
        del = false,
        dryRun = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
        flatten = false, // deprecated, use relocation instead
        relocations = [],
    } = options;
    await fsp.mkdir(localDir, { recursive: true });
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listBucketObjects(bucket, { prefix }),
        this.listLocalObjects(localDir),
    ]);
    if (flatten && relocations.length > 0) {
        throw new Error('flatten and relocations options cannot be used together');
    }
    sourceObjects.forEach((sourceObject) => {
        if (flatten) {
            sourceObject.flatten();
        } else {
            sourceObject.applyRelocations(relocations);
        }
    });
    let pDownload;
    const { created, updated, deleted } = diff(sourceObjects, targetObjects);
    const downloads = [...created, ...updated]
        .map((bucketObject) => DownloadObjectCommand.from(bucketObject, localDir));
    if (!dryRun) {
        const transferManager = new TransferManager({
            client: this,
            maxConcurrentTransfers,
            monitor,
        });
        pDownload = transferManager.download(downloads);
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = deleted;
        if (!dryRun) {
            const filesToDelete = deletions.map(({ path: filePath }) => filePath);
            pDelete = Promise.all(filesToDelete.map((filePath) => fsp.unlink(filePath)));
        }
    }
    await Promise.all([pDownload, pDelete]);
    return { downloads, deletions };
}

module.exports = localWithBucket;
