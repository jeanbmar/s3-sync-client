const fsp = require('fs').promises;
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('../constants');
const DownloadManager = require('../sync-managers/download-manager');
const syncDiff = require('../utilities/sync-diff');
const { parsePrefix } = require('../utilities/bucket-helper');

async function localWithBucket(bucketPrefix, localDir, options = {}) {
    const { bucket, prefix } = parsePrefix(bucketPrefix);
    const {
        commandInput,
        del = false,
        dryRun = false,
        sizeOnly = false,
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        monitor,
        flatten = false, // deprecated, use relocation instead
        relocations = [],
        filters = [],
    } = options;
    await fsp.mkdir(localDir, { recursive: true });
    const [sourceObjects, targetObjects] = await Promise.all([
        this.listBucketObjects(bucket, { prefix }),
        this.listLocalObjects(localDir),
    ]);
    if (flatten && relocations.length > 0) {
        throw new Error('flatten and relocations options cannot be used together');
    }
    sourceObjects.forEach((sourceObject) => sourceObject.applyFilters(filters));
    const includedSourceObjects = sourceObjects.filter((sourceObject) => sourceObject.isIncluded());
    includedSourceObjects.forEach((sourceObject) => {
        if (flatten) {
            sourceObject.flatten();
        } else {
            sourceObject.applyRelocations(relocations);
        }
    });
    let pDownload;
    const { created, updated, deleted } = syncDiff(includedSourceObjects, targetObjects, sizeOnly);
    const downloads = [...created, ...updated];
    if (!dryRun) {
        const downloadManager = new DownloadManager({
            client: this.client,
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
            pDelete = Promise.all(filesToDelete.map((filePath) => fsp.unlink(filePath)));
        }
    }
    await Promise.all([pDownload, pDelete]);
    return { downloads, deletions };
}

module.exports = localWithBucket;
