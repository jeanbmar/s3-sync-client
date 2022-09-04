import fsp from 'node:fs/promises';
import path from 'node:path';
import { toPosixPath } from '../utilities/path-helper';
import LocalObject from '../sync-objects/LocalObject';

async function listLocalObjects(currentDir, rootDir = currentDir, objects = []) {
  const childPaths = await fsp.readdir(currentDir);
  // eslint-disable-next-line no-restricted-syntax
  for (const childPath of childPaths) {
    const filePath = path.join(currentDir, childPath);
    const stats = await fsp.stat(filePath);
    if (stats.isDirectory()) {
      await this.listLocalObjects(filePath, rootDir, objects);
    } else {
      const id = toPosixPath(path.relative(rootDir, filePath));
      objects.push(new LocalObject({
        id,
        lastModified: stats.mtimeMs,
        size: stats.size,
        path: filePath,
      }));
    }
  }
  return objects;
}

export default listLocalObjects;
