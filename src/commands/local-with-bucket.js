import fsp from 'node:fs/promises';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from '../constants';
import DownloadManager from '../sync-managers/download-manager';
import syncDiff from '../utilities/sync-diff';
import { parsePrefix } from '../utilities/bucket-helper';

async function localWithBucket(bucketPrefix, localDir, options = {}) {
  const { bucket, prefix } = parsePrefix(bucketPrefix);
  const {
    commandInput,
    del = false,
    dryRun = false,
    sizeOnly = false,
    maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
    monitor,
    relocations = [],
    filters = [],
  } = options;
  await fsp.mkdir(localDir, { recursive: true });
  const [sourceObjects, targetObjects] = await Promise.all([
    this.listBucketObjects(bucket, { prefix }),
    this.listLocalObjects(localDir),
  ]);
  sourceObjects.forEach((sourceObject) => sourceObject.applyFilters(filters));
  const includedSourceObjects = sourceObjects.filter((sourceObject) => sourceObject.isIncluded());
  includedSourceObjects.forEach((sourceObject) => {
    sourceObject.applyRelocations(relocations);
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

export default localWithBucket;
