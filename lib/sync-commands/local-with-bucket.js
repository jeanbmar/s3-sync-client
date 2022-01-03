const EventEmitter = require('events');
const fs = require('fs-extra');
const fsp = require('fs').promises;
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('../constants');
const DownloadManager = require('../sync-managers/download-manager');
const syncDiff = require('../utilities/sync-diff');
const { parsePrefix } = require('../utilities/bucket-helper');

async function localWithBucket(bucketPrefix, localDir, options = {}) {
    const { bucket, prefix } = parsePrefix(bucketPrefix);
    const {
        commandInput = {},
        del = false,
        dryRun = false,
        sizeOnly = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor = new EventEmitter(),
        flatten = false, // deprecated, use relocation instead
        relocations = [],
        exclude = [],
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
    const { created, updated, deleted } = syncDiff(sourceObjects, targetObjects, sizeOnly, exclude);
    const downloads = [...created, ...updated];
    if (!dryRun) {
        const downloadManager = new DownloadManager({
            client: this,
            objects: downloads,
            commandInput,
            maxConcurrentTransfers,
            monitor,
            localDir,
        });
        pDownload = downloadManager.done();
    }
    let pDelete;
    let deletions = [];
    if (del) {
        deletions = deleted;
        if (!dryRun) {
            const filesToDelete = deletions.map(({ path: filePath }) => filePath);
            pDelete = Promise.all(filesToDelete.map((filePath) => fs.removeSync(filePath)));
        }
    }
    await Promise.all([pDownload, pDelete]);
    return { downloads, deletions };
}

module.exports = localWithBucket;
