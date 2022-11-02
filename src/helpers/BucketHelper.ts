import { ParsedBucket } from './ParsedBucket';

export class BucketHelper {
  static parsePrefix(bucketPrefix: string): ParsedBucket {
    const [bucket, ...prefixTokens] = bucketPrefix.split('/');
    const prefix = prefixTokens.join('/');
    return { bucket, prefix };
  }
}

export default BucketHelper;
