const TransferManager = require('./transfer-manager');
const asyncMap = require('../utilities/async-map');

class DownloadManager extends TransferManager {
    constructor(options = {}) {
        super(options);
        const { localDir } = options;
        this.localDir = localDir;
    }

    async done() {
        const totalDataSize = this.objects.reduce((total, { size }) => total + size, 0);
        this.monitor.emit('metadata', totalDataSize, this.objects.length);
        await asyncMap(this.objects, this.maxConcurrentTransfers, async (bucketObject) => (
            bucketObject.download({
                client: this.client,
                localDir: this.localDir,
                commandInput: this.commandInput,
                monitor: this.monitor,
                abortSignal: this.abortController.signal,
            })
        ));
    }
}

module.exports = DownloadManager;
