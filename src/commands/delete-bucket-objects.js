import { DeleteObjectsCommand } from '@aws-sdk/client-s3';

async function deleteBucketObjects(bucket, keys) {
  let deleted = 0;
  while (deleted < keys.length) {
    const chunk = keys.slice(deleted, deleted + 1000);
    await this.client.send(new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: chunk.map((key) => ({ Key: key })),
      },
    }));
    deleted += chunk.length;
  }
  return deleted;
}

export default deleteBucketObjects;
