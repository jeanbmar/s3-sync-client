import TransferManager from './transfer-manager';
import asyncMap from '../utilities/async-map';

class DownloadManager extends TransferManager {
  constructor(options = {}) {
    super(options);
    const { localDir } = options;
    this.localDir = localDir;
  }

  async done() {
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

export default DownloadManager;
