import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import {
  SyncCommand,
  SyncCommandOutput,
  SyncOptions,
} from './commands/SyncCommand';
import { ICommand } from './commands/Command';

export type S3SyncClientConfig = {
  client: S3Client;
} & S3ClientConfig;

export class S3SyncClient {
  private client: S3Client;

  constructor(options: S3SyncClientConfig) {
    this.client = options?.client ?? new S3Client(options);
    this.sync = this.sync.bind(this);
  }

  async sync(
    source: string,
    target: string,
    options?: SyncOptions
  ): Promise<SyncCommandOutput> {
    return new SyncCommand({
      source,
      target,
      ...options,
    }).execute(this.client);
  }

  async send(command: ICommand): Promise<any> {
    return command.execute(this.client);
  }
}

export default S3SyncClient;
