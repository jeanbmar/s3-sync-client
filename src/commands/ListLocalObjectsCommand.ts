import { promises as fsp } from 'node:fs';
import * as path from 'node:path';
import { toPosixPath } from '../helpers/path';
import { LocalObject } from '../fs/LocalObject';

export type ListLocalObjectsCommandInput = {
  directory: string;
  followSymlinks?: boolean;
  noFollowSymlinks?: boolean;
};

export class ListLocalObjectsCommand {
  directory: string;
  followSymlinks: boolean;
  constructor(input: ListLocalObjectsCommandInput) {
    this.directory = input.directory;
    const noFollowSymlinks = input.noFollowSymlinks ?? false;
    this.followSymlinks = input.followSymlinks ?? !noFollowSymlinks;
  }

  async execute(): Promise<LocalObject[]> {
    return this.listObjectsRecursively(this.directory);
  }

  private async listObjectsRecursively(currentDir): Promise<LocalObject[]> {
    let objects: LocalObject[] = [];
    const childPaths = await fsp.readdir(currentDir);
    // eslint-disable-next-line no-restricted-syntax
    for (const childPath of childPaths) {
      const filePath = path.join(currentDir, childPath);
      let stats = await fsp.lstat(filePath);
      if (stats.isSymbolicLink() && this.followSymlinks) {
        stats = await fsp.stat(filePath);
      }
      if (stats.isDirectory()) {
        objects = objects.concat(await this.listObjectsRecursively(filePath));
      } else if (stats.isFile()) {
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
