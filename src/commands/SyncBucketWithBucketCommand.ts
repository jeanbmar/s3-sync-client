import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from './constants';
import { SyncObject } from '../fs/SyncObject';
import { parsePrefix } from '../helpers/bucket';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
import { CopyBucketObjectsCommand } from './CopyBucketObjectsCommand';
import { ListBucketObjectsCommand } from './ListBucketObjectsCommand';
import { DeleteBucketObjectsCommand } from './DeleteBucketObjectsCommand';

export type SyncBucketWithBucketCommandInput = {
  sourceBucketPrefix: string;
  targetBucketPrefix: string;
  dryRun?: boolean;
  del?: boolean;
  sizeOnly?: boolean;
  relocations?: Relocation[];
  filters?: Filter[];
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<CopyObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
};

export type SyncBucketWithBucketCommandOutput = {
  created: BucketObject[];
  updated: BucketObject[];
  deleted: BucketObject[];
};

export class SyncBucketWithBucketCommand {
  sourceBucketPrefix: string;
  targetBucketPrefix: string;
  dryRun: boolean;
  del: boolean;
  sizeOnly: boolean;
  relocations: Relocation[];
  filters: Filter[];
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<CopyObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;

  constructor(input: SyncBucketWithBucketCommandInput) {
    this.sourceBucketPrefix = input.sourceBucketPrefix;
    this.targetBucketPrefix = input.targetBucketPrefix;
    this.dryRun = input.dryRun ?? false;
    this.del = input.del ?? false;
    this.sizeOnly = input.sizeOnly ?? false;
    this.relocations = input.relocations ?? [];
    this.filters = input.filters ?? [];
    this.abortSignal = input.abortSignal;
    this.commandInput = input.commandInput;
    this.monitor = input.monitor;
    this.maxConcurrentTransfers =
      input.maxConcurrentTransfers ?? DEFAULT_MAX_CONCURRENT_TRANSFERS;
  }

  async execute(client: S3Client): Promise<SyncBucketWithBucketCommandOutput> {
    const { bucket: sourceBucket, prefix: sourcePrefix } = parsePrefix(
      this.sourceBucketPrefix
    );
    const { bucket: targetBucket, prefix: targetPrefix } = parsePrefix(
      this.targetBucketPrefix
    );
    const [sourceObjects, targetObjects] = await Promise.all([
      new ListBucketObjectsCommand({
        bucket: sourceBucket,
        prefix: sourcePrefix,
      }).execute(client),
      new ListBucketObjectsCommand({
        bucket: targetBucket,
        prefix: targetPrefix,
      }).execute(client),
    ]);
    if (targetPrefix !== '')
      this.relocations = this.relocations.concat([['', targetPrefix]]);
    sourceObjects.forEach((sourceObject) =>
      sourceObject.applyFilters(this.filters)
    );
    const includedSourceObjects = sourceObjects.filter(
      (sourceObject) => sourceObject.isIncluded
    );
    includedSourceObjects.forEach((sourceObject) =>
      sourceObject.applyRelocations(this.relocations)
    );
    const diff = SyncObject.diff(
      includedSourceObjects,
      targetObjects,
      this.sizeOnly
    );
    const commands = [];
    if (!this.dryRun) {
      commands.push(
        new CopyBucketObjectsCommand({
          bucketObjects: [...diff.created, ...diff.updated] as BucketObject[],
          targetBucket,
          abortSignal: this.abortSignal,
          commandInput: this.commandInput,
          monitor: this.monitor,
          maxConcurrentTransfers: this.maxConcurrentTransfers,
        }).execute(client)
      );
    }
    if (this.del) {
      if (!this.dryRun) {
        commands.push(
          new DeleteBucketObjectsCommand({
            bucket: targetBucket,
            keys: (diff.deleted as BucketObject[]).map((object) => object.key),
          }).execute(client)
        );
      }
    }
    await Promise.all(commands);
    return {
      created: diff.created,
      updated: diff.updated,
      deleted: this.del ? diff.deleted : [],
    } as SyncBucketWithBucketCommandOutput;
  }
}
