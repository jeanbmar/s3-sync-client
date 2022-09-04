const { S3Client } = require('@aws-sdk/client-s3');
const bucketWithBucket = require('./commands/bucket-with-bucket');
const bucketWithLocal = require('./commands/bucket-with-local');
const localWithBucket = require('./commands/local-with-bucket');
const sync = require('./commands/sync');
const deleteBucketObjects = require('./commands/delete-bucket-objects');
const listBucketObjects = require('./commands/list-bucket-objects');
const listLocalObjects = require('./commands/list-local-objects');
const TransferMonitor = require('./transfer-monitor');

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

module.exports = S3SyncClient;
