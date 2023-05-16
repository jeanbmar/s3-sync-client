import path from 'node:path';
import { promises as fsp } from 'fs';
import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';
import fs from 'node:fs';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { mergeInput } from './Command';
import { toLocalPath } from '../helpers/path';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';

export type DownloadBucketObjectCommandInput = {
  bucketObject: BucketObject;
  localDir: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: GetObjectCommandInput;
  monitor?: TransferMonitor;
};

export class DownloadBucketObjectCommand {
  bucketObject: BucketObject;
  localDir: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: GetObjectCommandInput;
  monitor?: TransferMonitor;

  constructor(input: DownloadBucketObjectCommandInput) {
    this.bucketObject = input.bucketObject;
    this.localDir = input.localDir;
    this.abortSignal = input.abortSignal;
    this.nativeCommandInput = input.nativeCommandInput;
    this.monitor = input.monitor;
  }

  async execute(client: S3Client): Promise<void> {
    const relativePath = toLocalPath(this.bucketObject.id);
    const filePath = path.join(this.localDir, relativePath);
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const getObjectCommandInput = mergeInput<GetObjectCommandInput>(
      {
        Bucket: this.bucketObject.bucket,
        Key: this.bucketObject.key,
      },
      this.nativeCommandInput
    );
    const response: GetObjectCommandOutput = await client.send(
      new GetObjectCommand(getObjectCommandInput),
      { abortSignal: this.abortSignal }
    );
    const readStream = response.Body as Readable;
    const { LastModified } = response;
    const writeStream = readStream.pipe(fs.createWriteStream(filePath));
    if (this.monitor) {
      readStream.on('data', (data) => {
        this.monitor.emit('size', data.length);
      });
      writeStream.on('finish', () => {
        this.monitor.emit('object');
      });
    }
    await new Promise<void>((resolve, reject) => {
      writeStream.on('error', reject);
      writeStream.on('finish', () => {
        fs.utimes(filePath, LastModified, LastModified, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }
}
