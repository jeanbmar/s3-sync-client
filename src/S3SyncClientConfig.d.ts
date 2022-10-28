import { S3ClientConfig, S3Client } from '@aws-sdk/client-s3';

export interface S3SyncClientConfig extends S3ClientConfig {
  client: S3Client;
}
