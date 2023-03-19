import { promises as fsp } from 'node:fs';
import * as path from 'node:path';
import { toPosixPath } from '../helpers/path';
import { LocalObject } from '../sync-objects/LocalObject';

export type ListLocalObjectsCommandInput = {
  directory: string;
};

export class ListLocalObjectsCommand {
  directory: string;
  constructor(input: ListLocalObjectsCommandInput) {
    this.directory = input.directory;
  }

  async send(): Promise<LocalObject[]> {
    return this.listObjectsRecursively(this.directory);
  }

  private async listObjectsRecursively(currentDir): Promise<LocalObject[]> {
    let objects: LocalObject[] = [];
    const childPaths = await fsp.readdir(currentDir);
    // eslint-disable-next-line no-restricted-syntax
    for (const childPath of childPaths) {
      const filePath = path.join(currentDir, childPath);
      const stats = await fsp.stat(filePath);
      if (stats.isDirectory()) {
        objects = objects.concat(await this.listObjectsRecursively(filePath));
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
