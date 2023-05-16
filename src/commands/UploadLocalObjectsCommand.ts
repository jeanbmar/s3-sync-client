import { PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { asyncMap } from '../helpers/async';
import { LocalObject } from '../fs/LocalObject';
import { TransferMonitor } from '../TransferMonitor';
import {
  DEFAULT_MAX_CONCURRENT_TRANSFERS,
  DEFAULT_PART_SIZE,
} from './constants';
import { UploadLocalObjectCommand } from './UploadLocalObjectCommand';
import { CreateMultipartLocalObjectUploadCommand } from './CreateMultipartLocalObjectUploadCommand';
import {
  UploadedPart,
  UploadLocalObjectPartCommand,
} from './UploadLocalObjectPartCommand';
import { CompleteMultipartLocalObjectCommand } from './CompleteMultipartLocalObjectCommand';

export type UploadLocalObjectsCommandInput = {
  localObjects: LocalObject[];
  bucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: PutObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
  partSize?: number;
};

// todo manage upload part input

export class UploadLocalObjectsCommand {
  localObjects: LocalObject[];
  bucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: PutObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;
  partSize: number;

  constructor(input: UploadLocalObjectsCommandInput) {
    this.localObjects = input.localObjects;
    this.bucket = input.bucket;
    this.abortSignal = input.abortSignal;
    this.nativeCommandInput = input.nativeCommandInput;
    this.monitor = input.monitor;
    this.maxConcurrentTransfers =
      input.maxConcurrentTransfers ?? DEFAULT_MAX_CONCURRENT_TRANSFERS;
    this.partSize = input.partSize ?? DEFAULT_PART_SIZE;
  }

  async execute(client: S3Client): Promise<void> {
    if (this.monitor) {
      const totalDataSize = this.localObjects.reduce(
        (total, localObject) => total + localObject.size,
        0
      );
      this.monitor.emit('metadata', totalDataSize, this.localObjects.length);
    }
    const uploadOps = [];
    this.localObjects.forEach((localObject) => {
      if (localObject.size > this.partSize) {
        uploadOps.push(...this.deferMultipartUpload(client, localObject));
      } else {
        uploadOps.push(this.deferDirectUpload(client, localObject));
      }
    });
    await asyncMap(uploadOps, this.maxConcurrentTransfers, async (uploadOp) =>
      uploadOp()
    );
  }

  deferDirectUpload(client: S3Client, localObject: LocalObject): Function {
    return async () => {
      const command = new UploadLocalObjectCommand({
        localObject,
        bucket: this.bucket,
        abortSignal: this.abortSignal,
        nativeCommandInput: this.nativeCommandInput,
        monitor: this.monitor,
      });
      await command.execute(client);
    };
  }

  // the complex wrapping happening in this method enables parallel processing of commands that depend on each others
  deferMultipartUpload(client: S3Client, localObject: LocalObject): Function[] {
    const deferredCommands = [];

    const createMultipartUploadCommand: Promise<string> = new Promise(
      (resolve) => {
        deferredCommands.push(async () => {
          const command = new CreateMultipartLocalObjectUploadCommand({
            localObject,
            bucket: this.bucket,
            nativeCommandInput: this.nativeCommandInput,
          });
          resolve(command.execute(client));
        });
      }
    );

    const partOffsets = [];
    for (let i = 0; i < localObject.size; i += this.partSize) {
      partOffsets.push({
        start: i,
        end: Math.min(i + this.partSize - 1, localObject.size - 1),
      });
    }

    const uploadPartCommands: Promise<UploadedPart[]> =
      Promise.all<UploadedPart>(
        partOffsets.map(
          (partOffset, index) =>
            new Promise((resolve) => {
              deferredCommands.push(async () => {
                const command = new UploadLocalObjectPartCommand({
                  localObject,
                  startOffset: partOffset.start,
                  endOffset: partOffset.end,
                  partNumber: index + 1,
                  uploadId: await createMultipartUploadCommand,
                  bucket: this.bucket,
                  abortSignal: this.abortSignal,
                  monitor: this.monitor,
                });
                resolve(command.execute(client));
              });
            })
        )
      );

    deferredCommands.push(async () => {
      const command = new CompleteMultipartLocalObjectCommand({
        localObject,
        bucket: this.bucket,
        uploadId: await createMultipartUploadCommand,
        parts: await uploadPartCommands,
      });
      await command.execute(client);
    });

    return deferredCommands;
  }
}
