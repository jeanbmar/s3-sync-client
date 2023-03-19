import path from 'node:path';

export function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join(path.posix.sep);
}

export function toLocalPath(filePath: string): string {
  return filePath.split(path.posix.sep).join(path.sep);
}
