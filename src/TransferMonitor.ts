import { EventEmitter } from 'node:events';

export type TransferStatus = {
  size: {
    current: number;
    total: number;
  };
  count: {
    current: number;
    total: number;
  };
};

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

  setMetadata(totalDataSize: number, totalObjectCount: number): void {
    this.totalDataSize = totalDataSize;
    this.totalObjectCount = totalObjectCount;
  }

  updateDataSize(size: number): void {
    this.transferredDataSize += size;
    this.emit('progress', this.getStatus());
  }

  updateObjectCount(count: number = 1): void {
    this.transferredObjectCount += count;
    this.emit('progress', this.getStatus());
  }

  getStatus(): TransferStatus {
    return {
      size: {
        current: this.transferredDataSize,
        total: this.totalDataSize,
      },
      count: {
        current: this.transferredObjectCount,
        total: this.totalObjectCount,
      },
    } as TransferStatus;
  }
}

export default TransferMonitor;
