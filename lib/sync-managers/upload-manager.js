const { DEFAULT_PART_SIZE } = require('../constants');
const TransferManager = require('./transfer-manager');
const asyncMap = require('../utilities/async-map');

class UploadManager extends TransferManager {
    constructor(options = {}) {
        super(options);
        const {
            bucket,
            partSize = DEFAULT_PART_SIZE,
        } = options;
        this.bucket = bucket;
        this.partSize = partSize;
    }

    // multipart operations are deferred to respect maxConcurrentTransfers
    async createDeferredMultipartUpload(object) {
        const deferredOps = [];
        const dCreateMultipartUpload = new Promise((resolve) => {
            deferredOps.push(async () => {
                resolve(await object.createMultipartUpload({
                    client: object.client,
                    bucket: object.bucket,
                    commandInput: object.commandInput,
                }));
            });
        });
        const dUploadParts = object.getPartOffsets()
            .map(({ start, end }, index) => (
                new Promise((resolve) => {
                    deferredOps.push(async () => {
                        const { uploadId } = await dCreateMultipartUpload;
                        resolve(await object.uploadPart({
                            client: this.client,
                            bucket: this.bucket,
                            commandInput: this.commandInput,
                            monitor: this.monitor,
                            abortSignal: this.abortController.signal,
                            start,
                            end,
                            uploadId,
                            partNumber: index + 1,
                        }));
                    });
                })
            ));
        deferredOps.push(async () => {
            const { uploadId } = await dCreateMultipartUpload;
            const uploadedParts = await Promise.all(dUploadParts);
            await object.completeMultipartUpload({
                client: this.client,
                bucket: this.bucket,
                uploadId,
                uploadedParts,
            });
        });
        return deferredOps;
    }

    async done() {
        const uploadOps = [];
        this.objects.forEach((object) => {
            if (object.size > this.partSize) {
                uploadOps.push(...this.createDeferredMultipartUpload(object));
            } else {
                uploadOps.push(async () => object.uploadObject({
                    client: this.client,
                    bucket: this.bucket,
                    commandInput: this.commandInput,
                    monitor: this.monitor,
                    abortSignal: this.abortController.signal,
                }));
            }
        });
        await asyncMap(
            uploadOps,
            this.maxConcurrentTransfers,
            async (uploadOp) => uploadOp(),
        );
    }
}

module.exports = UploadManager;
