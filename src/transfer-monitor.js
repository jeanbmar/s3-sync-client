import EventEmitter from 'node:events';

class TransferMonitor extends EventEmitter {
  constructor() {
    super();
    this.on('metadata', this.setMetadata.bind(this));
    this.on('size', this.updateDataSize.bind(this));
    this.on('object', this.updateObjectCount.bind(this));
    this.transferredObjectCount = 0;
    this.totalObjectCount = 0;
    this.transferredDataSize = 0;
    this.totalDataSize = 0;
  }

  abort() {
    this.emit('abort');
  }

  setMetadata(totalDataSize, totalObjectCount) {
    this.totalDataSize = totalDataSize;
    this.totalObjectCount = totalObjectCount;
  }

  updateDataSize(size) {
    this.transferredDataSize += size;
    this.emit('progress', this.getStatus());
  }

  updateObjectCount(count = 1) {
    this.transferredObjectCount += count;
    this.emit('progress', this.getStatus());
  }

  getStatus() {
    return {
      size: {
        current: this.transferredDataSize,
        total: this.totalDataSize,
      },
      count: {
        current: this.transferredObjectCount,
        total: this.totalObjectCount,
      },
    };
  }
}

export default TransferMonitor;
