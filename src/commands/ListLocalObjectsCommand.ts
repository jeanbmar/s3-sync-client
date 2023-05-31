import { promises as fsp } from 'node:fs';
import * as path from 'node:path';
import { toPosixPath } from '../helpers/path';
import { LocalObject } from '../fs/LocalObject';

export type ListLocalObjectsCommandInput = {
  directory: string;
  followSymlinks: boolean;
};

export class ListLocalObjectsCommand {
  directory: string;
  followSymlinks: boolean;
  constructor(input: ListLocalObjectsCommandInput) {
    this.directory = input.directory;
    this.followSymlinks = input.followSymlinks;
  }

  async execute(): Promise<LocalObject[]> {
    return this.listObjectsRecursively(this.directory, this.followSymlinks);
  }

  private async listObjectsRecursively(
    currentDir,
    followSymlinks
  ): Promise<LocalObject[]> {
    let objects: LocalObject[] = [];
    const childPaths = await fsp.readdir(currentDir);
    // eslint-disable-next-line no-restricted-syntax
    for (const childPath of childPaths) {
      const filePath = path.join(currentDir, childPath);
      const stats = await fsp.lstat(filePath);
      if (stats.isSymbolicLink() && !followSymlinks) {
        // eslint-disable-next-line no-continue
        continue;
      } else if (stats.isSymbolicLink()) {
        await fsp.stat(filePath);
      }
      if (stats.isDirectory()) {
        objects = objects.concat(
          await this.listObjectsRecursively(filePath, followSymlinks)
        );
      } else {
        const id = toPosixPath(path.relative(this.directory, filePath));
        objects.push(
          new LocalObject({
            id,
            lastModified: stats.mtimeMs,
            size: stats.size,
            path: filePath,
          })
        );
      }
    }
    return objects;
  }
}
