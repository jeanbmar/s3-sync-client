import {
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { CommandInput, mergeInput } from './Command';
import { LocalObject } from '../fs/LocalObject';

export type CreateMultipartLocalObjectUploadCommandInput = {
  localObject: LocalObject;
  bucket: string;
  commandInput?: CommandInput<CreateMultipartUploadCommandInput>;
};

export class CreateMultipartLocalObjectUploadCommand {
  localObject: LocalObject;
  bucket: string;
  commandInput?: CommandInput<CreateMultipartUploadCommandInput>;
  constructor(input: CreateMultipartLocalObjectUploadCommandInput) {
    this.localObject = input.localObject;
    this.bucket = input.bucket;
    this.commandInput = input.commandInput;
  }

  async execute(client: S3Client): Promise<string> {
    const uploadCommandInput = mergeInput<CreateMultipartUploadCommandInput>(
      {
        Bucket: this.bucket,
        Key: this.localObject.id,
      },
      this.commandInput
    );
    const result = await client.send(
      new CreateMultipartUploadCommand(uploadCommandInput)
    );
    return result.UploadId;
  }
}
