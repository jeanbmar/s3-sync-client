// this is not promise defer anti-pattern
const defer = (fn) => {
    let deferredResolve;
    const result = new Promise((resolve, reject) => {
        deferredResolve = async () => {
            try {
                resolve(await fn());
            } catch (error) {
                reject(error);
            }
        };
    });
    return { result, resolve: deferredResolve };
};

module.exports = defer;
