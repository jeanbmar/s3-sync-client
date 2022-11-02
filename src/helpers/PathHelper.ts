import * as path from 'node:path';

export class PathHelper {
  static toPosixPath(filePath: string): string {
    return filePath.split(path.sep).join(path.posix.sep);
  }

  static toLocalPath(filePath: string): string {
    return filePath.split(path.posix.sep).join(path.sep);
  }
}

export default PathHelper;
