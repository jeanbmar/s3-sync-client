import { EventEmitter } from 'node:events';

export class TransferMonitor extends EventEmitter {
  private transferredObjectCount: number = 0;
  private totalObjectCount: number = 0;
  private transferredDataSize: number = 0;
  private totalDataSize: number = 0;

  constructor() {
    super();
    this.on('metadata', this.setMetadata.bind(this));
    this.on('size', this.updateDataSize.bind(this));
    this.on('object', this.updateObjectCount.bind(this));
  }

  abort() {
    this.emit('abort');
  }

  setMetadata(totalDataSize: number, totalObjectCount: number) {
    this.totalDataSize = totalDataSize;
    this.totalObjectCount = totalObjectCount;
  }

  updateDataSize(size: number) {
    this.transferredDataSize += size;
    this.emit('progress', this.getStatus());
  }

  updateObjectCount(count: number = 1) {
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
