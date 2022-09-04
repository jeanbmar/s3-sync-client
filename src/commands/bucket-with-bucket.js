import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from '../constants';
import CopyManager from '../sync-managers/copy-manager';
import syncDiff from '../utilities/sync-diff';
import { parsePrefix } from '../utilities/bucket-helper';

async function bucketWithBucket(sourceBucketPrefix, targetBucketPrefix, options = {}) {
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
  const { bucket: sourceBucket, prefix: sourcePrefix } = parsePrefix(sourceBucketPrefix);
  const { bucket: targetBucket, prefix: targetPrefix } = parsePrefix(targetBucketPrefix);
  const [sourceObjects, targetObjects] = await Promise.all([
    this.listBucketObjects(sourceBucket, { prefix: sourcePrefix }),
    this.listBucketObjects(targetBucket, { prefix: targetPrefix }),
  ]);
  if (targetPrefix !== '') {
    relocations.push(['', targetPrefix]);
  }
  sourceObjects.forEach((sourceObject) => sourceObject.applyFilters(filters));
  const includedSourceObjects = sourceObjects.filter((sourceObject) => sourceObject.isIncluded());
  includedSourceObjects.forEach((sourceObject) => sourceObject.applyRelocations(relocations));
  let pCopy;
  const { created, updated, deleted } = syncDiff(includedSourceObjects, targetObjects, sizeOnly);
  const copies = [...created, ...updated];
  if (!dryRun) {
    const copyManager = new CopyManager({
      client: this.client,
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

export default bucketWithBucket;
