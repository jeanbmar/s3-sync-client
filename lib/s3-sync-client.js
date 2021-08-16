const { S3Client } = require('@aws-sdk/client-s3');
const bucketWithBucket = require('./sync-commands/bucket-with-bucket');
const bucketWithLocal = require('./sync-commands/bucket-with-local');
const localWithBucket = require('./sync-commands/local-with-bucket');
const sync = require('./sync-commands/sync');
const deleteBucketObjects = require('./delete-bucket-objects');
const listBucketObjects = require('./list-bucket-objects');
const listLocalObjects = require('./list-local-objects');
const TransferMonitor = require('./transfer-monitor');
const util = require('./util');

class S3SyncClient extends S3Client {}
S3SyncClient.prototype.bucketWithBucket = bucketWithBucket;
S3SyncClient.prototype.bucketWithLocal = bucketWithLocal;
S3SyncClient.prototype.localWithBucket = localWithBucket;
S3SyncClient.prototype.sync = sync;
S3SyncClient.prototype.listBucketObjects = listBucketObjects;
S3SyncClient.prototype.listLocalObjects = listLocalObjects;
S3SyncClient.prototype.deleteBucketObjects = deleteBucketObjects;
S3SyncClient.TransferMonitor = TransferMonitor;
S3SyncClient.util = util;

module.exports = S3SyncClient;
