// defer is used to keep track of fn status no matter where resolve is called
const defer = (fn) => {
    let deferredResolve;
    const promise = new Promise((resolve, reject) => {
        deferredResolve = async () => {
            try {
                const result = await fn();
                resolve(result);
                return result;
            } catch (error) {
                reject(error);
                throw error;
            }
        };
    });
    return { promise, resolve: deferredResolve };
};

module.exports = defer;
