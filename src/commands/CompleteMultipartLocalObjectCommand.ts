import {
  S3Client,
  CompleteMultipartUploadCommand,
  CompletedMultipartUpload,
  CompletedPart,
} from '@aws-sdk/client-s3';
import { UploadedPart } from './UploadLocalObjectPartCommand';
import { LocalObject } from '../sync-objects/LocalObject';

export type CompleteMultipartLocalObjectCommandInput = {
  localObject: LocalObject;
  bucket: string;
  uploadId: string;
  parts: UploadedPart[];
};

export class CompleteMultipartLocalObjectCommand {
  localObject: LocalObject;
  bucket: string;
  uploadId: string;
  parts: UploadedPart[];
  constructor(input: CompleteMultipartLocalObjectCommandInput) {
    this.localObject = input.localObject;
    this.bucket = input.bucket;
    this.uploadId = input.uploadId;
    this.parts = input.parts;
  }

  async send(client: S3Client): Promise<void> {
    const parts = [...this.parts]
      .sort((a, b) => a.partNumber - b.partNumber)
      .map(
        (part) =>
          ({
            ETag: part.eTag,
            PartNumber: part.partNumber,
          } as CompletedPart)
      );
    await client.send(
      new CompleteMultipartUploadCommand({
        Bucket: this.bucket,
        Key: this.localObject.id,
        UploadId: this.uploadId,
        MultipartUpload: { Parts: parts } as CompletedMultipartUpload,
      })
    );
  }
}
