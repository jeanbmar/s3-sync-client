const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { GetObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');
const SyncObject = require('./sync-object');
const { merge } = require('../utilities/command-input-helper');
const { toLocalPath } = require('../utilities/path-helper');

class BucketObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.size = properties.size;
        this.lastModified = properties.lastModified;
    }

    async download(options = {}) {
        const {
            client,
            localDir,
            abortSignal,
            commandInput,
            monitor,
        } = options;
        const relativePath = toLocalPath(this.id);
        const filePath = path.join(localDir, relativePath);
        await fsp.mkdir(path.dirname(filePath), { recursive: true });
        const getObjectCommandInput = merge({
            Bucket: this.bucket,
            Key: this.key,
        }, commandInput);
        monitor?.emit('start', { filePath });
        const { Body: readStream, LastModified } = await client.send(
            new GetObjectCommand(getObjectCommandInput),
            { abortSignal },
        );
        const writeStream = readStream.pipe(fs.createWriteStream(filePath));
        if (monitor) {
            readStream.on('data', (data) => {
                monitor.emit('size', data.length);
            });
            writeStream.on('finish', () => {
                monitor.emit('object');
            });
        }
        return new Promise((resolve, reject) => {
            writeStream.on('error', (error) => {
                monitor?.emit('error', { filePath, error });
                reject(error);
            });
            writeStream.on('finish', () => {
                fs.utimes(filePath, LastModified, LastModified, (error) => {
                    if (error) {
                        monitor?.emit('error', { filePath, error });
                        reject(error);
                    } else {
                        monitor?.emit('done', { filePath });
                        resolve();
                    }
                });
            });
        });
    }

    // todo UploadPartCopyCommand

    async copy(options = {}) {
        const {
            client,
            targetBucket,
            abortSignal,
            commandInput,
            monitor,
        } = options;
        const targetKey = this.id;
        const copyObjectCommandInput = merge({
            Bucket: targetBucket,
            Key: targetKey,
            CopySource: encodeURI(`${this.bucket}/${this.key}`),
        }, commandInput);
        await client.send(
            new CopyObjectCommand(copyObjectCommandInput),
            { abortSignal },
        );
        if (monitor) {
            monitor.emit('size', this.size);
            monitor.emit('object');
        }
    }
}

module.exports = BucketObject;
