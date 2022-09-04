module.exports = {
    parsePrefix(bucketPrefix) {
        const [bucket, ...prefixTokens] = bucketPrefix.split('/');
        const prefix = prefixTokens.join('/');
        return { bucket, prefix };
    },
};
