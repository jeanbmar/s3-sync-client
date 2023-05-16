import {
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { BucketObject, BucketObjectOptions } from '../fs/BucketObject';

export type ListBucketObjectsCommandInput = {
  bucket: string;
  prefix?: string;
};

export class ListBucketObjectsCommand {
  bucket: string;
  prefix?: string;

  constructor(input: ListBucketObjectsCommandInput) {
    this.bucket = input.bucket;
    this.prefix = input.prefix;
  }

  async execute(client: S3Client): Promise<BucketObject[]> {
    const objects: BucketObject[] = [];
    let response: ListObjectsV2CommandOutput;
    let nextContinuationToken: string;
    do {
      response = await client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: this.prefix,
          ContinuationToken: nextContinuationToken,
        } as ListObjectsV2CommandInput)
      );
      nextContinuationToken = response.NextContinuationToken;
      if (response.Contents !== undefined) {
        response.Contents.forEach(({ Key, LastModified, Size }) => {
          if (!Key.endsWith('/')) {
            objects.push(
              new BucketObject({
                id: Key,
                lastModified: LastModified.getTime(),
                size: Size,
                key: Key,
                bucket: this.bucket,
              } as BucketObjectOptions)
            );
          }
        });
      }
    } while (response.IsTruncated);
    return objects;
  }
}
