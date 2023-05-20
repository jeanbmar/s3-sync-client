export type ParsedBucket = {
  bucket: string;
  prefix?: string;
};

export function parsePrefix(bucketPrefix: string): ParsedBucket {
  const [bucket, ...prefixTokens] = bucketPrefix.split('/');
  const prefix = prefixTokens.join('/');
  return { bucket, prefix };
}
