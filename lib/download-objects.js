const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { DEFAULT_MAX_CONCURRENT_TRANSFERS } = require('./constants');

async function downloadObjects(localDir, bucket, objects, options = {}) {
    const {
        maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
    } = options;
    let downloaded = 0;
    while (downloaded < objects.length) {
        const chunk = objects.slice(downloaded, downloaded + maxConcurrentTransfers);
        await Promise.all(chunk.map(async ({ key }) => {
            const relativePath = key.split(path.posix.sep).join(path.sep);
            const filePath = path.join(localDir, relativePath);
            await fsp.mkdir(path.dirname(filePath), { recursive: true });
            const response = await this.send(new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }));
            const stream = response.Body.pipe(fs.createWriteStream(filePath));
            return new Promise((resolve) => stream.on('finish', resolve));
        }));
        downloaded += chunk.length;
    }
    return downloaded;
}

module.exports = downloadObjects;
