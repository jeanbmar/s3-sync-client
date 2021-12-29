const EventEmitter = require('events');
const fs = require('fs');
const fsp = require('fs').promises;
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const CommandInput = require('../command-input');
const SyncObject = require('./sync-object');

class LocalObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.size = properties.size;
        this.lastModified = properties.lastModified;
        this.path = properties.path;
        this.versionId = null;
    }

    async upload(options = {}) {
        const {
            client,
            bucket,
            abortSignal,
            commandInput = {},
            monitor = new EventEmitter(),
        } = options;
        const stream = fs.createReadStream(this.path);
        stream.on('data', (data) => {
            monitor.emit('size', data.length);
        });
        // attaching data event set stream status to flowing
        // we need to restore the status to paused
        stream.pause();
        stream.on('end', () => {
            monitor.emit('object');
        });
        const upload = new Promise((resolve, reject) => {
            stream.on('error', reject);
            stream.on('end', resolve);
        });
        const putObjectCommandInput = {
            Bucket: bucket,
            Key: this.id,
            Body: stream,
        };
        CommandInput.prototype.assign.call(putObjectCommandInput, commandInput);
        const s3Uploaded = await client.send(
            new PutObjectCommand(putObjectCommandInput),
            { abortSignal },
        );

        if (s3Uploaded.VersionId) {
            this.versionId = s3Uploaded.VersionId;
        }

        return upload;
    }

    async delete() {
        return fsp.unlink(this.path);
    }
}

module.exports = LocalObject;
