const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const BucketObject = require('../sync-objects/bucket-object');

async function listBucketObjects(bucket, options = {}) {
    const {
        prefix,
    } = options;
    const objects = [];
    let response;
    let nextContinuationToken;
    do {
        response = await this.client.send(new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: nextContinuationToken,
        }));
        nextContinuationToken = response.NextContinuationToken;
        if (response.Contents !== undefined) {
            response.Contents.forEach(({ Key, LastModified, Size }) => {
                if (!Key.endsWith('/')) {
                    objects.push(new BucketObject({
                        id: Key,
                        lastModified: LastModified.getTime(),
                        size: Size,
                        key: Key,
                        bucket,
                    }));
                }
            });
        }
    } while (response.IsTruncated);
    return objects;
}

module.exports = listBucketObjects;
