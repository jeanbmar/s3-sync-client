import { S3Client } from '@aws-sdk/client-s3';

export type Relocation = [sourcePrefix: string, targetPrefix: string];

export type Filter = {
  exclude?: (key) => boolean;
  include?: (key) => boolean;
};

export type CommandInput<T> =
  | Partial<T>
  | ((properties: Partial<T>) => Partial<T>);

function isFunction<T>(
  properties: any
): properties is (properties: Partial<T>) => Partial<T> {
  return typeof properties === 'function';
}

export function mergeInput<T>(commandInput: T, properties: CommandInput<T>): T {
  return {
    ...commandInput,
    ...(isFunction(properties)
      ? (properties as (properties: Partial<T>) => Partial<T>)(commandInput)
      : properties),
  };
}

export interface ICommand {
  execute(client?: S3Client): any;
}
