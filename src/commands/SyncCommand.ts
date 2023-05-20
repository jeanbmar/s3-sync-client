import { S3Client } from '@aws-sdk/client-s3';
import {
  SyncBucketWithBucketCommand,
  SyncBucketWithBucketCommandInput,
  SyncBucketWithBucketCommandOutput,
} from './SyncBucketWithBucketCommand';
import {
  SyncBucketWithLocalCommand,
  SyncBucketWithLocalCommandInput,
  SyncBucketWithLocalCommandOutput,
} from './SyncBucketWithLocalCommand';
import {
  SyncLocalWithBucketCommand,
  SyncLocalWithBucketCommandInput,
  SyncLocalWithBucketCommandOutput,
} from './SyncLocalWithBucketCommand';

export type SyncBucketWithBucketOptions = Omit<
  SyncBucketWithBucketCommandInput,
  'sourceBucketPrefix' | 'targetBucketPrefix'
>;

export type SyncBucketWithLocalOptions = Omit<
  SyncBucketWithLocalCommandInput,
  'localDir' | 'bucketPrefix'
>;

export type SyncLocalWithBucketOptions = Omit<
  SyncLocalWithBucketCommandInput,
  'bucketPrefix' | 'localDir'
>;
export type SyncOptions =
  | SyncBucketWithBucketOptions
  | SyncBucketWithLocalOptions
  | SyncLocalWithBucketOptions;

export type SyncCommandInput = {
  source: string;
  target: string;
} & SyncOptions;

export type SyncCommandOutput =
  | SyncBucketWithBucketCommandOutput
  | SyncBucketWithLocalCommandOutput
  | SyncLocalWithBucketCommandOutput;

export class SyncCommand {
  source: string;
  target: string;
  options: SyncOptions;

  constructor(input: SyncCommandInput) {
    const { source, target, ...options } = input;
    this.source = source;
    this.target = target;
    this.options = options;
  }

  async execute(client: S3Client): Promise<SyncCommandOutput> {
    const sourceIsBucket = this.source.startsWith('s3://');
    const targetIsBucket = this.target.startsWith('s3://');
    if (!sourceIsBucket && !targetIsBucket) {
      throw new Error(
        'localDir to localDir sync is not supported, make sure to use s3:// prefix for buckets'
      );
    }
    if (sourceIsBucket && targetIsBucket) {
      return new SyncBucketWithBucketCommand({
        sourceBucketPrefix: this.source.substring(5),
        targetBucketPrefix: this.target.substring(5),
        ...this.options,
      } as SyncBucketWithBucketCommandInput).execute(client);
    }
    if (sourceIsBucket && !targetIsBucket) {
      return new SyncLocalWithBucketCommand({
        bucketPrefix: this.source.substring(5),
        localDir: this.target,
        ...this.options,
      } as SyncLocalWithBucketCommandInput).execute(client);
    }
    return new SyncBucketWithLocalCommand({
      localDir: this.source,
      bucketPrefix: this.target.substring(5),
      ...this.options,
    } as SyncBucketWithLocalCommandInput).execute(client);
  }
}
