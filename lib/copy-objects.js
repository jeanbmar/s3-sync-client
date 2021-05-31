const { CopyObjectCommand } = require('@aws-sdk/client-s3');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');

async function copyObjects(targetBucket, sourceBucket, objects, options = {}) {
    const {
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
    } = options;
    let copied = 0;
    while (copied < objects.length) {
        const chunk = objects.slice(copied, copied + maxConcurrentTransfers);
        await Promise.all(chunk.map(async ({ id, key }) => (
            this.send(new CopyObjectCommand({
                Bucket: targetBucket,
                Key: id,
                CopySource: encodeURI(`${sourceBucket}/${key}`),
            }))
        )));
        copied += chunk.length;
    }
    return copied;
}

module.exports = copyObjects;
