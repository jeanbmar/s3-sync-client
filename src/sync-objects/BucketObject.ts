import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { GetObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import SyncObject from './SyncObject';
import { merge } from '../utilities/command-input-helper';
import { toLocalPath } from '../utilities/path-helper';

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
      writeStream.on('error', reject);
      writeStream.on('finish', () => {
        fs.utimes(filePath, LastModified, LastModified, (err) => {
          if (err) reject(err);
          else resolve();
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

export default BucketObject;
