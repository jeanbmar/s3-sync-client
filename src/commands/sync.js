async function sync(source, target, options) {
  const sourceIsBucket = source.startsWith('s3://');
  const targetIsBucket = target.startsWith('s3://');
  if (!sourceIsBucket && !targetIsBucket) {
    throw new Error('localDir to localDir sync is not supported, make sure to use s3:// prefix for buckets');
  }
  if (sourceIsBucket && targetIsBucket) {
    return this.bucketWithBucket(source.substring(5), target.substring(5), options);
  }
  if (sourceIsBucket && !targetIsBucket) {
    return this.localWithBucket(source.substring(5), target, options);
  }
  return this.bucketWithLocal(source, target.substring(5), options);
}

export default sync;
