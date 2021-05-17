module.exports = {
    parseBucketPrefix(bucketPrefix) {
        const [bucket, ...prefixTokens] = bucketPrefix.split('/');
        const prefix = prefixTokens.join('/');
        return { bucket, prefix };
    },
    getObjectsToTransfer(sourceObjects, targetObjects) {
        const objectsToTransfer = [];
        sourceObjects.forEach((sourceObject) => {
            const targetObject = targetObjects.get(sourceObject.key);
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
            if (!sourceObjects.has(targetObject.key)) {
                objectsToDelete.push(targetObject);
            }
        });
        return objectsToDelete;
    },
};
