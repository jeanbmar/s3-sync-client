import fs from 'node:fs';
import fsp from 'node:fs/promises';
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { merge } from '../utilities/command-input-helper';
import SyncObject from './SyncObject';

class LocalObject extends SyncObject {
  constructor(properties = {}) {
    super(properties);
    this.size = properties.size;
    this.lastModified = properties.lastModified;
    this.path = properties.path;
  }

  static async decorateUploadStream(options = {}) {
    const { stream, monitor } = options;
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
    return new Promise((resolve, reject) => {
      stream.on('error', reject);
      stream.on('end', resolve);
    });
  }

  async uploadObject(options = {}) {
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
      ContentLength: this.size,
    }, commandInput);
    const { Body: stream } = putObjectCommandInput;
    const upload = LocalObject.decorateUploadStream({ stream, monitor });
    await client.send(
      new PutObjectCommand(putObjectCommandInput),
      { abortSignal },
    );
    return upload;
  }

  getPartOffsets(partSize) {
    const parts = [];
    for (let i = 0; i < this.size; i += partSize) {
      parts.push({
        start: i,
        end: Math.min(i + partSize - 1, this.size - 1),
      });
    }
    return parts;
  }

  async createMultipartUpload(options = {}) {
    const {
      client,
      bucket,
      commandInput,
    } = options;
    const uploadCommandInput = merge({
      Bucket: bucket,
      Key: this.id,
    }, { ...commandInput, Body: undefined });
    const { UploadId: uploadId } = await client.send(new CreateMultipartUploadCommand(uploadCommandInput));
    return { uploadId };
  }

  async uploadPart(options = {}) {
    const {
      client,
      bucket,
      abortSignal,
      commandInput,
      monitor,
      start,
      end,
      uploadId,
      partNumber,
    } = options;
    const uploadPartCommandInput = merge({
      Bucket: bucket,
      Key: this.id,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: fs.createReadStream(this.path, { start, end }),
      ContentLength: end - start + 1,
    }, commandInput);
    const { Body: stream } = uploadPartCommandInput;
    const upload = LocalObject.decorateUploadStream({ stream, monitor });
    const { ETag: eTag } = await client.send(
      new UploadPartCommand(uploadPartCommandInput),
      { abortSignal },
    );
    await upload;
    return { eTag, partNumber };
  }

  async completeMultipartUpload(options = {}) {
    const {
      client,
      bucket,
      uploadId,
      uploadedParts,
    } = options;
    uploadedParts.sort((a, b) => a.partNumber - b.partNumber);
    return client.send(new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: this.id,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: uploadedParts.map((part) => ({
          ETag: part.eTag,
          PartNumber: part.partNumber,
        })),
      },
    }));
  }

  async delete() {
    return fsp.unlink(this.path);
  }
}

export default LocalObject;
