import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { asyncMap } from '../helpers/async';
import { BucketObject } from '../sync-objects/BucketObject';
import { TransferMonitor } from '../TransferMonitor';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from '../constants';
import {
  CopyBucketObjectCommand,
  CopyBucketObjectCommandInput,
} from './CopyBucketObjectCommand';

export type CopyBucketObjectsCommandInput = {
  bucketObjects: BucketObject[];
  targetBucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: CopyObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
};

export class CopyBucketObjectsCommand {
  bucketObjects: BucketObject[];
  targetBucket: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: CopyObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;
  constructor(input: CopyBucketObjectsCommandInput) {
    this.bucketObjects = input.bucketObjects;
    this.targetBucket = input.targetBucket;
    this.abortSignal = input.abortSignal;
    this.monitor = input.monitor;
    this.maxConcurrentTransfers =
      input.maxConcurrentTransfers ?? DEFAULT_MAX_CONCURRENT_TRANSFERS;
  }

  async send(client: S3Client): Promise<void> {
    if (this.monitor) {
      const totalDataSize = this.bucketObjects.reduce(
        (total, bucketObject) => total + bucketObject.size,
        0
      );
      this.monitor.emit('metadata', totalDataSize, this.bucketObjects.length);
    }
    await asyncMap(
      this.bucketObjects,
      this.maxConcurrentTransfers,
      async (bucketObject) => {
        const command = new CopyBucketObjectCommand({
          bucketObject,
          targetBucket: this.targetBucket,
          abortSignal: this.abortSignal,
          nativeCommandInput: this.nativeCommandInput,
          monitor: this.monitor,
        } as CopyBucketObjectCommandInput);
        await command.send(client);
      }
    );
  }
}
