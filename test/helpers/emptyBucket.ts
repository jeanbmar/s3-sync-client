import {
  ListBucketObjectsCommand,
  DeleteBucketObjectsCommand,
} from '../../src';

async function emptyBucket(client, bucket) {
  const bucketObjects = await new ListBucketObjectsCommand({
    bucket,
  }).execute(client);
  await new DeleteBucketObjectsCommand({
    bucket,
    keys: bucketObjects.map((object) => object.key),
  }).execute(client);
}

export default emptyBucket;
