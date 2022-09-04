async function emptyBucket(client, bucket) {
    const bucketObjects = await client.listBucketObjects(bucket);
    const keysToDelete = Array.from(bucketObjects.values()).map(({ key }) => key);
    await client.deleteBucketObjects(bucket, keysToDelete);
}

export default emptyBucket;
