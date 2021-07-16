class TransferStatus {
    constructor(commands) {
        this.currentCount = 0;
        this.totalCount = commands.length;
        this.currentSize = 0;
        this.totalSize = commands.reduce((total, { size }) => total + size, 0);
    }

    getProgress() {
        return {
            size: {
                current: this.currentSize,
                total: this.totalSize,
            },
            count: {
                current: this.currentCount,
                total: this.totalCount,
            },
        };
    }
}

module.exports = TransferStatus;
