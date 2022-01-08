const TransferManager = require('./transfer-manager');
const asyncMap = require('../utilities/async-map');

class UploadManager extends TransferManager {
    constructor(options = {}) {
        super(options);
        const { bucket } = options;
        this.bucket = bucket;
    }

    async done() {
        await asyncMap(this.objects, this.maxConcurrentTransfers, async (localObject) => (
            localObject.upload({
                client: this.client,
                bucket: this.bucket,
                commandInput: this.commandInput,
                monitor: this.monitor,
                abortSignal: this.abortController.signal,
            })
        ));
    }
}

module.exports = UploadManager;
