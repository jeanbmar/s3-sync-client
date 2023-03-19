import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  Delete,
  ObjectIdentifier,
  S3Client,
} from '@aws-sdk/client-s3';

export type DeleteBucketObjectsCommandInput = {
  bucket: string;
  keys: string[];
};

export class DeleteBucketObjectsCommand {
  bucket: string;
  keys: string[];

  constructor(input: DeleteBucketObjectsCommandInput) {
    this.bucket = input.bucket;
    this.keys = input.keys;
  }

  async send(client: S3Client): Promise<number> {
    let deleted = 0;
    while (deleted < this.keys.length) {
      const chunk = this.keys.slice(deleted, deleted + 1000);
      await client.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: chunk.map((key) => ({ Key: key } as ObjectIdentifier)),
          } as Delete,
        } as DeleteObjectsCommandInput)
      );
      deleted += chunk.length;
    }
    return deleted;
  }
}

export default DeleteBucketObjectsCommand;
