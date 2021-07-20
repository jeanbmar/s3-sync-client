const { DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const TransferManager = require('./transfer-manager');

class BucketDeleteManager extends TransferManager {
    constructor(options = {}) {
        super(options);
        const {
            maxConcurrentTransfers = 1000, // max value from DeleteObjectsCommand spec
        } = options;
        this.bucket = maxConcurrentTransfers;
    }

    async done() {
        const totalDataSize = this.objects.reduce((total, { size }) => total + size, 0);
        const totalObjectCount = this.objects.length;
        this.monitor.emit('metadata', totalDataSize, totalObjectCount);
        const partitions = new Map();
        this.objects.forEach((bucketObject) => {
            const partitionedObjects = partitions.get(bucketObject.bucket);
            if (partitionedObjects === undefined) {
                partitions.set(bucketObject.bucket, [bucketObject]);
            } else {
                partitionedObjects.push(bucketObject);
            }
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const [bucket, bucketObjects] of partitions) {
            let partitionTransferredObjectCount = 0;
            const partitionTotalObjectCount = bucketObjects.length;
            while (partitionTransferredObjectCount < partitionTotalObjectCount) {
                const chunk = bucketObjects.slice(
                    partitionTransferredObjectCount,
                    partitionTransferredObjectCount + this.maxConcurrentTransfers,
                );
                await this.send(new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: {
                        Objects: chunk.map((bucketObject) => ({ Key: bucketObject.key })),
                    },
                }));
                this.monitor.emit('size', chunk.reduce((total, { size }) => total + size, 0));
                this.monitor.emit('object', chunk.length);
                partitionTransferredObjectCount += chunk.length;
            }
        }
    }
}

module.exports = BucketDeleteManager;
