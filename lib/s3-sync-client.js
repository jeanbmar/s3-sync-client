const { S3Client } = require('@aws-sdk/client-s3');
const bucketWithBucket = require('./bucket-with-bucket');
const bucketWithLocal = require('./bucket-with-local');
const localWithBucket = require('./local-with-bucket');
const emptyBucket = require('./empty-bucket');
const copyObjects = require('./copy-objects');
const uploadObjects = require('./upload-objects');
const downloadObjects = require('./download-objects');
const deleteBucketObjects = require('./delete-bucket-objects');
const listBucketObjects = require('./list-bucket-objects');
const listLocalObjects = require('./list-local-objects');
const Relocator = require('./relocator');
const util = require('./util');

class S3SyncClient extends S3Client {}
S3SyncClient.prototype.bucketWithBucket = bucketWithBucket;
S3SyncClient.prototype.bucketWithLocal = bucketWithLocal;
S3SyncClient.prototype.localWithBucket = localWithBucket;
S3SyncClient.prototype.emptyBucket = emptyBucket;
S3SyncClient.prototype.copyObjects = copyObjects;
S3SyncClient.prototype.uploadObjects = uploadObjects;
S3SyncClient.prototype.downloadObjects = downloadObjects;
S3SyncClient.prototype.deleteBucketObjects = deleteBucketObjects;
S3SyncClient.prototype.listBucketObjects = listBucketObjects;
S3SyncClient.prototype.listLocalObjects = listLocalObjects;
S3SyncClient.Relocator = Relocator;
S3SyncClient.util = util;

module.exports = S3SyncClient;
