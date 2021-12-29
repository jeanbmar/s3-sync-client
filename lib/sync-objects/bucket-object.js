const EventEmitter = require('events');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { GetObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');
const SyncObject = require('./sync-object');
const CommandInput = require('../command-input');
const { toLocalPath } = require('../utilities/path-helper');

class BucketObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.bucket = properties.bucket;
        this.key = properties.key;
        this.size = properties.size;
        this.lastModified = properties.lastModified;
        this.versionId = null;
    }

    async download(options = {}) {
        const {
            client,
            localDir,
            abortSignal,
            commandInput = {},
            monitor = new EventEmitter(),
        } = options;
        const relativePath = toLocalPath(this.id);
        const filePath = path.join(localDir, relativePath);
        await fsp.mkdir(path.dirname(filePath), { recursive: true });
        const getObjectCommandInput = {
            Bucket: this.bucket,
            Key: this.key,
        };
        CommandInput.prototype.assign.call(getObjectCommandInput, commandInput);
        const { Body: readStream, VersionId } = await client.send(
            new GetObjectCommand(getObjectCommandInput),
            { abortSignal },
        );
        if (VersionId) this.versionId = VersionId;

        const writeStream = readStream.pipe(fs.createWriteStream(filePath));
        readStream.on('data', (data) => {
            monitor.emit('size', data.length);
        });
        writeStream.on('finish', () => {
            monitor.emit('object');
        });
        return new Promise((resolve, reject) => {
            writeStream.on('error', reject);
            writeStream.on('finish', resolve);
        });
    }

    async copy(options = {}) {
        const {
            client,
            targetBucket,
            abortSignal,
            commandInput = {},
            monitor = new EventEmitter(),
        } = options;
        const targetKey = this.id;
        const copyObjectCommandInput = {
            Bucket: targetBucket,
            Key: targetKey,
            CopySource: encodeURI(`${this.bucket}/${this.key}`),
        };
        CommandInput.prototype.assign.call(copyObjectCommandInput, commandInput);
        await client.send(
            new CopyObjectCommand(copyObjectCommandInput),
            { abortSignal },
        );
        monitor.emit('size', this.size);
        monitor.emit('object');
    }
}

module.exports = BucketObject;
