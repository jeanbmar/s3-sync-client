const fs = require('fs');
const fsp = require('fs').promises;
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { merge } = require('../utilities/command-input-helper');
const SyncObject = require('./sync-object');

class LocalObject extends SyncObject {
    constructor(properties = {}) {
        super(properties);
        this.size = properties.size;
        this.lastModified = properties.lastModified;
        this.path = properties.path;
    }

    // todo lib-storage
    // abort: https://github.com/aws/aws-sdk-js-v3/blob/84f98d4dbfbaea58e9668ed41591707857af89b2/lib/lib-storage/src/Upload.ts#L89
    // progress
    // specific options

    async upload(options = {}) {
        const {
            client,
            bucket,
            abortSignal,
            commandInput,
            monitor,
        } = options;
        const putObjectCommandInput = merge({
            Bucket: bucket,
            Key: this.id,
            Body: fs.createReadStream(this.path),
        }, commandInput);
        const { Body: stream } = putObjectCommandInput;
        if (monitor) {
            stream.on('data', (data) => {
                monitor.emit('size', data.length);
            });
            // attaching data event set stream status to flowing
            // we need to restore the status to paused
            stream.pause();
            stream.on('end', () => {
                monitor.emit('object');
            });
        }
        const upload = new Promise((resolve, reject) => {
            stream.on('error', reject);
            stream.on('end', resolve);
        });
        await client.send(
            new PutObjectCommand(putObjectCommandInput),
            { abortSignal },
        );
        return upload;
    }

    async delete() {
        return fsp.unlink(this.path);
    }
}

module.exports = LocalObject;
