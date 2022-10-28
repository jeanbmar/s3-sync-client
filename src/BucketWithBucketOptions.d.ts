import { CopyObjectCommandInput } from '@aws-sdk/client-s3';
import { S3SyncOptions } from './S3SyncOptions';
import { TransferMonitor } from './TransferMonitor';
import { Filter } from './Filter';
import { Relocation } from './Relocation';

export interface BucketWithBucketOptions extends S3SyncOptions {
  commandInput?: CopyObjectCommandInput,
  del?: boolean;
  dryRun?: boolean;
  sizeOnly?: boolean;
  maxConcurrentTransfers?: number;
  monitor?: TransferMonitor;
  relocations?: Relocation[];
  filters?: Filter[];
}
