import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { BucketWithBucketOptions } from './BucketWithBucketOptions';
import { BucketWithLocalOptions } from './BucketWithLocalOptions';
import { LocalWithBucketOptions } from './LocalWithBucketOptions';
import bucketWithBucket from './commands/bucketWithBucket';
import bucketWithLocal from './commands/bucketWithLocal';
import localWithBucket from './commands/localWithBucket';
import sync from './commands/sync';
import deleteBucketObjects from './commands/deleteBucketObjects';
import listBucketObjects from './commands/listBucketObjects';
import listLocalObjects from './commands/listLocalObjects';

export type S3SyncOptions = {}

export type S3SyncClientConfig = {
  client: S3Client;
} & S3ClientConfig;

export class S3SyncClient {
  private client: S3Client = null;

  constructor(options: S3SyncClientConfig) {
    this.client = options?.client ?? new S3Client(options);
    this.sync = this.sync.bind(this);
  }

  async sync(source: string, target: string, options: S3SyncOptions) {
    return sync.call(this, source, target, options);
  }

  async bucketWithBucket(sourceBucketPrefix: string, targetBucketPrefix: string, options: BucketWithBucketOptions) {
    return bucketWithBucket.call(this, sourceBucketPrefix, targetBucketPrefix, options);
  }

  async bucketWithLocal(localDir, bucketPrefix, options: BucketWithLocalOptions) {
    return bucketWithLocal.call(this, localDir, bucketPrefix, options);
  }

  async localWithBucket(bucketPrefix, localDir, options: LocalWithBucketOptions) {
    return localWithBucket.call(this, bucketPrefix, localDir, options);
  }

  async listBucketObjects(bucket, options) {
    return listBucketObjects.call(this, bucket, options);
  }

  async listLocalObjects(currentDir: string) {
    return listLocalObjects.call(this, currentDir);
  }

  async deleteBucketObjects(bucket: string, keys: string[]) {
    return deleteBucketObjects.call(this, bucket, keys);
  }
}

export default S3SyncClient;
