import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { S3SyncOptions } from './S3SyncOptions';
import { TransferMonitor } from './TransferMonitor';
import { Filter } from './Filter';
import { Relocation } from './Relocation';

export interface BucketWithLocalOptions extends S3SyncOptions {
  commandInput?: PutObjectCommandInput,
  del?: boolean;
  dryRun?: boolean;
  sizeOnly?: boolean;
  maxConcurrentTransfers?: number;
  monitor?: TransferMonitor;
  partSize: number;
  relocations?: Relocation[];
  filters?: Filter[];
}
