import TransferManager from './transfer-manager';
import asyncMap from '../utilities/async-map';

class CopyManager extends TransferManager {
  constructor(options = {}) {
    super(options);
    const { targetBucket } = options;
    this.targetBucket = targetBucket;
  }

  async done() {
    await asyncMap(this.objects, this.maxConcurrentTransfers, async (bucketObject) => (
      bucketObject.copy({
        client: this.client,
        targetBucket: this.targetBucket,
        commandInput: this.commandInput,
        monitor: this.monitor,
        abortSignal: this.abortController.signal,
      })
    ));
  }
}

export default CopyManager;
