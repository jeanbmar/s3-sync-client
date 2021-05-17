const path = require('path');

module.exports = {
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
    getObjectsToTransfer(sourceObjects, targetObjects) {
        const objectsToTransfer = [];
        sourceObjects.forEach((sourceObject) => {
            const targetObject = targetObjects.get(sourceObject.id);
            if (
                targetObject === undefined
                || sourceObject.size !== targetObject.size
                || sourceObject.lastModified > targetObject.lastModified
            ) {
                objectsToTransfer.push(sourceObject);
            }
        });
        return objectsToTransfer;
    },
    getObjectsToDelete(sourceObjects, targetObjects) {
        const objectsToDelete = [];
        targetObjects.forEach((targetObject) => {
            if (!sourceObjects.has(targetObject.id)) {
                objectsToDelete.push(targetObject);
            }
        });
        return objectsToDelete;
    },
};
