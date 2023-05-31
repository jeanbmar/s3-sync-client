import { promises as fsp } from 'node:fs';
import { GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from './constants';
import { DownloadBucketObjectsCommand } from './DownloadBucketObjectsCommand';
import { SyncObject } from '../fs/SyncObject';
import { parsePrefix } from '../helpers/bucket';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
import { LocalObject } from '../fs/LocalObject';
import { ListBucketObjectsCommand } from './ListBucketObjectsCommand';
import { ListLocalObjectsCommand } from './ListLocalObjectsCommand';

export type SyncLocalWithBucketCommandInput = {
  bucketPrefix: string;
  localDir: string;
  dryRun?: boolean;
  del?: boolean;
  deleteExcluded?: boolean;
  sizeOnly?: boolean;
  followSymlinks?: boolean;
  relocations?: Relocation[];
  filters?: Filter[];
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<GetObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
};

export type SyncLocalWithBucketCommandOutput = {
  created: BucketObject[];
  updated: BucketObject[];
  deleted: LocalObject[];
};

export class SyncLocalWithBucketCommand {
  bucketPrefix: string;
  localDir: string;
  dryRun: boolean;
  del: boolean;
  deleteExcluded: boolean;
  sizeOnly: boolean;
  followSymlinks: boolean;
  relocations: Relocation[];
  filters: Filter[];
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<GetObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;

  constructor(input: SyncLocalWithBucketCommandInput) {
    this.bucketPrefix = input.bucketPrefix;
    this.localDir = input.localDir;
    this.dryRun = input.dryRun ?? false;
    this.del = input.del ?? false;
    this.deleteExcluded = input.deleteExcluded ?? false;
    this.sizeOnly = input.sizeOnly ?? false;
    this.followSymlinks = input.followSymlinks ?? true;
    this.relocations = input.relocations ?? [];
    this.filters = input.filters ?? [];
    this.abortSignal = input.abortSignal;
    this.commandInput = input.commandInput;
    this.monitor = input.monitor;
    this.maxConcurrentTransfers =
      input.maxConcurrentTransfers ?? DEFAULT_MAX_CONCURRENT_TRANSFERS;
  }

  async execute(client: S3Client): Promise<SyncLocalWithBucketCommandOutput> {
    const { bucket, prefix } = parsePrefix(this.bucketPrefix);
    await fsp.mkdir(this.localDir, { recursive: true });
    const [sourceObjects, targetObjects] = await Promise.all([
      new ListBucketObjectsCommand({ bucket, prefix }).execute(client),
      new ListLocalObjectsCommand({
        directory: this.localDir,
        followSymlinks: this.followSymlinks,
      }).execute(),
    ]);
    if (prefix !== '')
      this.relocations = [
        (currentPath) =>
          currentPath.startsWith(`${prefix}/`)
            ? currentPath.replace(`${prefix}/`, '')
            : currentPath,
        ...this.relocations,
      ];
    sourceObjects.forEach((sourceObject) => {
      sourceObject.applyFilters(this.filters);
      sourceObject.applyRelocations(this.relocations);
    });
    const diff = SyncObject.diff(sourceObjects, targetObjects, {
      sizeOnly: this.sizeOnly,
      deleteExcluded: this.deleteExcluded,
    });
    const commands = [];
    if (!this.dryRun) {
      commands.push(
        new DownloadBucketObjectsCommand({
          bucketObjects: [...diff.created, ...diff.updated] as BucketObject[],
          localDir: this.localDir,
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
          Promise.all(
            (diff.deleted as LocalObject[]).map((object) =>
              fsp.unlink(object.path)
            )
          )
        );
      }
    }
    await Promise.all(commands);
    return {
      created: diff.created,
      updated: diff.updated,
      deleted: this.del ? diff.deleted : [],
    } as SyncLocalWithBucketCommandOutput;
  }
}
