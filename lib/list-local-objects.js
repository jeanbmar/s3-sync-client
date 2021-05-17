const fsp = require('fs').promises;
const path = require('path');
const { localPathToPosixPath } = require('./util');

async function listLocalObjects(currentDir, options = {}, rootDir = currentDir, objects = new Map()) {
    const { prefix } = options;
    const childPaths = await fsp.readdir(currentDir);
    // eslint-disable-next-line no-restricted-syntax
    for (const childPath of childPaths) {
        const filePath = path.join(currentDir, childPath);
        const stats = await fsp.stat(filePath);
        if (stats.isDirectory()) {
            await this.listLocalObjects(filePath, options, rootDir, objects);
        } else {
            let id = localPathToPosixPath(path.relative(rootDir, filePath));
            if (prefix !== undefined) {
                id = path.posix.join(prefix, id);
            }
            objects.set(id, {
                id,
                lastModified: stats.mtimeMs,
                size: stats.size,
                path: filePath,
            });
        }
    }
    return objects;
}

module.exports = listLocalObjects;
