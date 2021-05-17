const fs = require('fs');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');

async function uploadObjects(bucket, objects, options = {}) {
    const {
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
    } = options;
    let uploaded = 0;
    while (uploaded < objects.length) {
        const chunk = objects.slice(uploaded, uploaded + maxConcurrentTransfers);
        await Promise.all(chunk.map(async ({ id, path: objectPath }) => {
            const stream = fs.createReadStream(objectPath);
            const upload = new Promise((resolve) => stream.on('end', resolve));
            await this.send(new PutObjectCommand({
                Bucket: bucket,
                Key: id,
                Body: stream,
            }));
            return upload;
        }));
        uploaded += chunk.length;
    }
    return uploaded;
}

module.exports = uploadObjects;
