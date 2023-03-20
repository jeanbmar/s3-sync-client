import {
  S3Client,
  UploadPartCommand,
  UploadPartCommandInput,
} from '@aws-sdk/client-s3';
import fs from 'node:fs';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { mergeInput } from './Command';
import { LocalObject } from '../sync-objects/LocalObject';
import { TransferMonitor } from '../TransferMonitor';

export type UploadLocalObjectPartCommandInput = {
  localObject: LocalObject;
  startOffset: number;
  endOffset: number;
  partNumber: number;
  uploadId: string;
  bucket: string;
  abortSignal?: AbortSignal;
  monitor?: TransferMonitor;
  nativeCommandInput?: UploadPartCommandInput;
};

export type UploadedPart = {
  eTag: string;
  partNumber: number;
};

export class UploadLocalObjectPartCommand {
  localObject: LocalObject;
  startOffset: number;
  endOffset: number;
  partNumber: number;
  uploadId: string;
  bucket: string;
  abortSignal?: AbortSignal;
  monitor?: TransferMonitor;
  nativeCommandInput?: UploadPartCommandInput;
  constructor(input: UploadLocalObjectPartCommandInput) {
    this.localObject = input.localObject;
    this.startOffset = input.startOffset;
    this.endOffset = input.endOffset;
    this.partNumber = input.partNumber;
    this.uploadId = input.uploadId;
    this.bucket = input.bucket;
    this.abortSignal = input.abortSignal;
    this.monitor = input.monitor;
    this.nativeCommandInput = input.nativeCommandInput;
  }

  async send(client: S3Client): Promise<UploadedPart> {
    const stream = fs.createReadStream(this.localObject.path, {
      start: this.startOffset,
      end: this.endOffset,
    });
    const uploadPartCommandInput = mergeInput<UploadPartCommandInput>(
      {
        Bucket: this.bucket,
        Key: this.localObject.id,
        UploadId: this.uploadId,
        PartNumber: this.partNumber,
        Body: stream,
        ContentLength: this.endOffset - this.startOffset + 1,
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
    const [, result] = await Promise.all([
      new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('end', resolve);
      }),
      client.send(new UploadPartCommand(uploadPartCommandInput), {
        abortSignal: this.abortSignal,
      }),
    ]);
    return {
      eTag: result.ETag,
      partNumber: this.partNumber,
    } as UploadedPart;
  }
}
