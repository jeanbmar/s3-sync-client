const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectsCommand,
} = require('@aws-sdk/client-s3');

const DEFAULT_MAX_CONCURRENT_TRANSFERS = 10;

class S3SyncClient extends S3Client {
    async bucketWithLocal(localDir, bucketPrefix, options = {}) {
        const {
            del = false,
            dryRun = false,
            maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        } = options;
        const { bucket, prefix } = this.constructor.parseBucketPrefix(bucketPrefix);
        const [sourceObjects, targetObjects] = await Promise.all([
            this.listLocalObjects(localDir, { prefix }),
            this.listBucketObjects(bucket, { prefix }),
        ]);
        let pUpload;
        const uploads = this.constructor.getObjectsToTransfer(sourceObjects, targetObjects);
        if (!dryRun) {
            pUpload = this.uploadObjects(bucket, uploads, { maxConcurrentTransfers });
        }
        let pDelete;
        let deletions = [];
        if (del) {
            deletions = this.constructor.getObjectsToDelete(sourceObjects, targetObjects);
            if (!dryRun) {
                const keysToDelete = deletions.map(({ key }) => key);
                pDelete = this.deleteBucketObjects(bucket, keysToDelete);
            }
        }
        await Promise.all([pUpload, pDelete]);
        return { uploads, deletions };
    }

    async localWithBucket(bucketPrefix, localDir, options = {}) {
        const {
            del = false,
            dryRun = false,
            maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        } = options;
        const { bucket, prefix } = this.constructor.parseBucketPrefix(bucketPrefix);
        await fsp.mkdir(localDir, { recursive: true });
        const [sourceObjects, targetObjects] = await Promise.all([
            this.listBucketObjects(bucket, { prefix }),
            this.listLocalObjects(localDir),
        ]);
        let pDownload;
        const downloads = this.constructor.getObjectsToTransfer(sourceObjects, targetObjects);
        if (!dryRun) {
            pDownload = this.downloadObjects(localDir, bucket, downloads, { maxConcurrentTransfers });
        }
        let pDelete;
        let deletions = [];
        if (del) {
            deletions = this.constructor.getObjectsToDelete(sourceObjects, targetObjects);
            if (!dryRun) {
                const filesToDelete = deletions.map(({ path: filePath }) => filePath);
                // eslint-disable-next-line no-restricted-syntax
                pDelete = Promise.all(filesToDelete.map((filePath) => fsp.unlink(filePath)));
            }
        }
        await Promise.all([pDownload, pDelete]);
        return { downloads, deletions };
    }

    async emptyBucket(bucket) {
        const bucketObjects = await this.listBucketObjects(bucket);
        const keysToDelete = Array.from(bucketObjects.keys());
        await this.deleteBucketObjects(bucket, keysToDelete);
    }

    static parseBucketPrefix(bucketPrefix) {
        const [bucket, ...prefixTokens] = bucketPrefix.split('/');
        const prefix = prefixTokens.join('/');
        return { bucket, prefix };
    }

    static getObjectsToTransfer(sourceObjects, targetObjects) {
        const objectsToTransfer = [];
        sourceObjects.forEach((sourceObject) => {
            const targetObject = targetObjects.get(sourceObject.key);
            if (
                targetObject === undefined
                || sourceObject.size !== targetObject.size
                || sourceObject.lastModified > targetObject.lastModified
            ) {
                objectsToTransfer.push(sourceObject);
            }
        });
        return objectsToTransfer;
    }

    static getObjectsToDelete(sourceObjects, targetObjects) {
        const objectsToDelete = [];
        targetObjects.forEach((targetObject) => {
            if (!sourceObjects.has(targetObject.key)) {
                objectsToDelete.push(targetObject);
            }
        });
        return objectsToDelete;
    }

    async uploadObjects(bucket, objects, options = {}) {
        const {
            maxConcurrentTransfers = DEFAULT_MAX_CONCURRENT_TRANSFERS,
        } = options;
        let uploaded = 0;
        while (uploaded < objects.length) {
            const chunk = objects.slice(uploaded, uploaded + maxConcurrentTransfers);
            await Promise.all(chunk.map(async ({ key, path: objectPath }) => {
                const stream = fs.createReadStream(objectPath);
                const upload = new Promise((resolve) => stream.on('end', resolve));
                await this.send(new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: stream,
                }));
                return upload;
            }));
            uploaded += chunk.length;
        }
        return uploaded;
    }

    async downloadObjects(localDir, bucket, objects, options = {}) {
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

    async deleteBucketObjects(bucket, keys) {
        let deleted = 0;
        while (deleted < keys.length) {
            const chunk = keys.slice(deleted, deleted + 1000); // 1000 limit as specified in DeleteObjectsCommand spec
            await this.send(new DeleteObjectsCommand({
                Bucket: bucket,
                Delete: {
                    Objects: chunk.map((key) => ({ Key: key })),
                },
            }));
            deleted += chunk.length;
        }
        return deleted;
    }

    async listBucketObjects(bucket, options = {}) {
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

    async listLocalObjects(currentDir, options = {}, rootDir = currentDir, objects = new Map()) {
        const { prefix } = options;
        const childPaths = await fsp.readdir(currentDir);
        // eslint-disable-next-line no-restricted-syntax
        for (const childPath of childPaths) {
            const filePath = path.join(currentDir, childPath);
            const stats = await fsp.stat(filePath);
            if (stats.isDirectory()) {
                await this.listLocalObjects(filePath, options, rootDir, objects);
            } else {
                let key = path.relative(rootDir, filePath).split(path.sep).join(path.posix.sep);
                if (prefix !== undefined) {
                    key = path.posix.join(prefix, key);
                }
                objects.set(key, {
                    key,
                    lastModified: stats.mtimeMs,
                    size: stats.size,
                    path: filePath,
                });
            }
        }
        return objects;
    }
}

module.exports = S3SyncClient;
