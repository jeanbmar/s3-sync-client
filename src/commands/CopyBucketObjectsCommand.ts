import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { asyncMap } from '../helpers/async';
import { BucketObject } from '../fs/BucketObject';
import { TransferMonitor } from '../TransferMonitor';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from './constants';
import {
  CopyBucketObjectCommand,
  CopyBucketObjectCommandInput,
} from './CopyBucketObjectCommand';
import { CommandInput } from './Command';

export type CopyBucketObjectsCommandInput = {
  bucketObjects: BucketObject[];
  targetBucket: string;
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<CopyObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
};

export class CopyBucketObjectsCommand {
  bucketObjects: BucketObject[];
  targetBucket: string;
  abortSignal?: AbortSignal;
  commandInput?: CommandInput<CopyObjectCommandInput>;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;

  constructor(input: CopyBucketObjectsCommandInput) {
    this.bucketObjects = input.bucketObjects;
    this.targetBucket = input.targetBucket;
    this.abortSignal = input.abortSignal;
    this.commandInput = input.commandInput;
    this.monitor = input.monitor;
    this.maxConcurrentTransfers =
      input.maxConcurrentTransfers ?? DEFAULT_MAX_CONCURRENT_TRANSFERS;
  }

  async execute(client: S3Client): Promise<void> {
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
          commandInput: this.commandInput,
          monitor: this.monitor,
        } as CopyBucketObjectCommandInput);
        await command.execute(client);
      }
    );
  }
}
