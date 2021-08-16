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
    diff(sourceObjects, targetObjects, sizeOnly = false) {
        const sourceObjectMap = new Map(
            sourceObjects.map((sourceObject) => [sourceObject.id, sourceObject]),
        );
        const targetObjectMap = new Map(
            targetObjects.map((targetObject) => [targetObject.id, targetObject]),
        );
        const created = [];
        const updated = [];
        sourceObjectMap.forEach((sourceObject) => {
            const targetObject = targetObjectMap.get(sourceObject.id);
            if (targetObject === undefined) {
                created.push(sourceObject);
            } else if (
                sourceObject.size !== targetObject.size
                || (!sizeOnly && sourceObject.lastModified > targetObject.lastModified)
            ) {
                updated.push(sourceObject);
            }
        });
        const deleted = [];
        targetObjectMap.forEach((targetObject) => {
            if (!sourceObjectMap.has(targetObject.id)) {
                deleted.push(targetObject);
            }
        });
        return { created, updated, deleted };
    },
};

module.exports = util;
