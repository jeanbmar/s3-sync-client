const TransferManager = require('./transfer-manager');

class DownloadManager extends TransferManager {
    constructor(options = {}) {
        super(options);
        const {
            localDir,
        } = options;
        this.localDir = localDir;
    }

    async done() {
        let transferredObjectCount = 0;
        const totalDataSize = this.objects.reduce((total, { size }) => total + size, 0);
        const totalObjectCount = this.objects.length;
        this.monitor.emit('metadata', totalDataSize, totalObjectCount);
        while (transferredObjectCount < totalObjectCount) {
            const chunk = this.objects.slice(
                transferredObjectCount,
                transferredObjectCount + this.maxConcurrentTransfers,
            );
            await Promise.all(chunk.map(async (bucketObject) => (
                bucketObject.download({
                    client: this.client,
                    localDir: this.localDir,
                    commandInput: this.commandInput,
                    monitor: this.monitor,
                    abortSignal: this.abortController.signal,
                })
            )));
            transferredObjectCount += chunk.length;
        }
    }
}

module.exports = DownloadManager;
