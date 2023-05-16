import { GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { asyncMap } from '../helpers/async';
import { BucketObject } from '../fs/BucketObject';
import { TransferMonitor } from '../TransferMonitor';
import { DEFAULT_MAX_CONCURRENT_TRANSFERS } from './constants';
import {
  DownloadBucketObjectCommand,
  DownloadBucketObjectCommandInput,
} from './DownloadBucketObjectCommand';

export type DownloadBucketObjectsCommandInput = {
  bucketObjects: BucketObject[];
  localDir: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: GetObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers?: number;
};

export class DownloadBucketObjectsCommand {
  bucketObjects: BucketObject[];
  localDir: string;
  abortSignal?: AbortSignal;
  nativeCommandInput?: GetObjectCommandInput;
  monitor?: TransferMonitor;
  maxConcurrentTransfers: number;
  constructor(input: DownloadBucketObjectsCommandInput) {
    this.bucketObjects = input.bucketObjects;
    this.localDir = input.localDir;
    this.abortSignal = input.abortSignal;
    this.nativeCommandInput = input.nativeCommandInput;
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
        const command = new DownloadBucketObjectCommand({
          bucketObject,
          localDir: this.localDir,
          abortSignal: this.abortSignal,
          nativeCommandInput: this.nativeCommandInput,
          monitor: this.monitor,
        } as DownloadBucketObjectCommandInput);
        await command.execute(client);
      }
    );
  }
}
