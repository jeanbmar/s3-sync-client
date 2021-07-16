const path = require('path');

const util = {
    posixPathToLocalPath(filePath) {
        return filePath.split(path.posix.sep).join(path.sep);
    },
    localPathToPosixPath(filePath) {
        return filePath.split(path.sep).join(path.posix.sep);
    },
    parseBucketPrefix(bucketPrefix) {
        const [bucket, ...prefixTokens] = bucketPrefix.split('/');
        const prefix = prefixTokens.join('/');
        return { bucket, prefix };
    },
    diff(sourceObjects, targetObjects) {
        const created = [];
        const updated = [];
        sourceObjects.forEach((sourceObject) => {
            const targetObject = targetObjects.get(sourceObject.id);
            if (targetObject === undefined) {
                created.push(sourceObject);
            } else if (
                sourceObject.size !== targetObject.size
                || sourceObject.lastModified > targetObject.lastModified
            ) {
                updated.push(sourceObject);
            }
        });
        const deleted = [];
        targetObjects.forEach((targetObject) => {
            if (!sourceObjects.has(targetObject.id)) {
                deleted.push(targetObject);
            }
        });
        return { created, updated, deleted };
    },
};

module.exports = util;
