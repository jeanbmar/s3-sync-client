import {
  CreateMultipartUploadCommandInput,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { UploadLocalObjectsCommand } from './UploadLocalObjectsCommand';
import { DeleteBucketObjectsCommand } from './DeleteBucketObjectsCommand';
import { SyncObject } from '../fs/SyncObject';
import { parsePrefix } from '../helpers/bucket';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import {
  DEFAULT_MAX_CONCURRENT_TRANSFERS,
  DEFAULT_PART_SIZE,
} from './constants';
import { ListLocalObjectsCommand } from './ListLocalObjectsCommand';
import { ListBucketObjectsCommand } from './ListBucketObjectsCommand';
import { LocalObject } from '../fs/LocalObject';
import { BucketObject } from '../fs/BucketObject';

export type SyncBucketWithLocalCommandInput = {
  localDir: string;
  bucketPrefix: string;
  dryRun?: boolean;
  del?: boolean;
  sizeOnly?: boolean;
  relocations?: Relocation[];
  filters?: Filter[];
  abortSignal?: AbortSignal;
  commandInput?:
    | CommandInput<PutObjectCommandInput>
    | CommandInput<CreateMultipartUploadCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
  partSize?: number;
};

export type SyncBucketWithLocalCommandOutput = {
  created: LocalObject[];
  updated: LocalObject[];
  deleted: BucketObject[];
};

export class SyncBucketWithLocalCommand {
  localDir: string;
  bucketPrefix: string;
  dryRun: boolean;
  del: boolean;
  sizeOnly: boolean;
  relocations: Relocation[];
  filters: Filter[];
  abortSignal?: AbortSignal;
  commandInput?:
    | CommandInput<PutObjectCommandInput>
    | CommandInput<CreateMultipartUploadCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;
  partSize: number;

  constructor(input: SyncBucketWithLocalCommandInput) {
    this.localDir = input.localDir;
    this.bucketPrefix = input.bucketPrefix;
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
    this.partSize = input.partSize ?? DEFAULT_PART_SIZE;
  }

  async execute(client: S3Client): Promise<SyncBucketWithLocalCommandOutput> {
    const { bucket, prefix } = parsePrefix(this.bucketPrefix);
    const [sourceObjects, targetObjects] = await Promise.all([
      new ListLocalObjectsCommand({ directory: this.localDir }).execute(),
      new ListBucketObjectsCommand({ bucket, prefix }).execute(client),
    ]);
    if (prefix !== '')
      this.relocations = this.relocations.concat([['', prefix]]);
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
        new UploadLocalObjectsCommand({
          localObjects: [...diff.created, ...diff.updated] as LocalObject[],
          bucket,
          abortSignal: this.abortSignal,
          commandInput: this.commandInput,
          monitor: this.monitor,
          maxConcurrentTransfers: this.maxConcurrentTransfers,
          partSize: this.partSize,
        }).execute(client)
      );
    }
    if (this.del) {
      if (!this.dryRun) {
        commands.push(
          new DeleteBucketObjectsCommand({
            bucket,
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
    } as SyncBucketWithLocalCommandOutput;
  }
}
