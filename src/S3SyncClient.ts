import { S3Client } from '@aws-sdk/client-s3';
import bucketWithBucket from './commands/bucket-with-bucket';
import bucketWithLocal from './commands/bucket-with-local';
import localWithBucket from './commands/local-with-bucket';
import sync from './commands/sync';
import deleteBucketObjects from './commands/delete-bucket-objects';
import listBucketObjects from './commands/list-bucket-objects';
import listLocalObjects from './commands/list-local-objects';
import TransferMonitor from './transfer-monitor';

class S3SyncClient {
  constructor(options = {}) {
    const { client = new S3Client(options) } = options;
    this.client = client;
    this.sync = this.sync.bind(this);
  }
}
S3SyncClient.prototype.bucketWithBucket = bucketWithBucket;
S3SyncClient.prototype.bucketWithLocal = bucketWithLocal;
S3SyncClient.prototype.localWithBucket = localWithBucket;
S3SyncClient.prototype.sync = sync;
S3SyncClient.prototype.listBucketObjects = listBucketObjects;
S3SyncClient.prototype.listLocalObjects = listLocalObjects;
S3SyncClient.prototype.deleteBucketObjects = deleteBucketObjects;
S3SyncClient.TransferMonitor = TransferMonitor;

export default S3SyncClient;
