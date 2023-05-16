import { SyncObject, SyncObjectOptions } from './SyncObject';

export type BucketObjectOptions = {
  bucket: string;
  key: string;
} & SyncObjectOptions;

export class BucketObject extends SyncObject {
  bucket: string;
  key: string;

  constructor(options: BucketObjectOptions) {
    super(options);
    this.bucket = options.bucket;
    this.key = options.key;
  }
}
