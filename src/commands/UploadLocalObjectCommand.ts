import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import fs from 'node:fs';
import { TransferMonitor } from '../TransferMonitor';
import { LocalObject } from '../sync-objects/LocalObject';
import { mergeInput } from './Command';

export type UploadLocalObjectCommandInput = {
  localObject: LocalObject;
  bucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: PutObjectCommandInput;
  monitor?: TransferMonitor;
};

export class UploadLocalObjectCommand {
  localObject: LocalObject;
  bucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: PutObjectCommandInput;
  monitor?: TransferMonitor;

  constructor(input: UploadLocalObjectCommandInput) {
    this.localObject = input.localObject;
    this.bucket = input.bucket;
    this.abortSignal = input.abortSignal;
    this.nativeCommandInput = input.nativeCommandInput;
    this.monitor = input.monitor;
  }
  async send(client: S3Client): Promise<void> {
    const stream = fs.createReadStream(this.localObject.path);
    const putObjectCommandInput = mergeInput<PutObjectCommandInput>(
      {
        Bucket: this.bucket,
        Key: this.localObject.id,
        Body: stream,
        ContentLength: this.localObject.size,
      },
      this.nativeCommandInput
    );
    if (this.monitor) {
      stream.on('data', (data) => {
        this.monitor.emit('size', data.length);
      });
      stream.pause(); // prevent flowing
      stream.on('end', () => {
        this.monitor.emit('object');
      });
    }
    await Promise.all([
      new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('end', resolve);
      }),
      client.send(new PutObjectCommand(putObjectCommandInput), {
        abortSignal: this.abortSignal,
      }),
    ]);
  }
}
