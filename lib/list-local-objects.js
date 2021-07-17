const fsp = require('fs').promises;
const path = require('path');
const { localPathToPosixPath } = require('./util');
const LocalObject = require('./sync-objects/local-object');

async function listLocalObjects(currentDir, rootDir = currentDir, objects = new Map()) {
    const childPaths = await fsp.readdir(currentDir);
    // eslint-disable-next-line no-restricted-syntax
    for (const childPath of childPaths) {
        const filePath = path.join(currentDir, childPath);
        const stats = await fsp.stat(filePath);
        if (stats.isDirectory()) {
            await this.listLocalObjects(filePath, rootDir, objects);
        } else {
            const id = localPathToPosixPath(path.relative(rootDir, filePath));
            objects.set(id, new LocalObject({
                id,
                lastModified: stats.mtimeMs,
                size: stats.size,
                path: filePath,
            }));
        }
    }
    return objects;
}

module.exports = listLocalObjects;
