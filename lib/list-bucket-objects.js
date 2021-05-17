const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

async function listBucketObjects(bucket, options = {}) {
    const { prefix } = options;
    const objects = new Map();
    let response;
    let nextContinuationToken;
    do {
        response = await this.send(new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: nextContinuationToken,
        }));
        nextContinuationToken = response.NextContinuationToken;
        if (response.Contents !== undefined) {
            response.Contents.forEach(({ Key, LastModified, Size }) => {
                objects.set(Key, {
                    key: Key,
                    lastModified: LastModified.getTime(),
                    size: Size,
                });
            });
        }
    } while (response.IsTruncated);
    return objects;
}

module.exports = listBucketObjects;
