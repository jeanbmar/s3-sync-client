import { DEFAULT_PART_SIZE } from '../constants';
import TransferManager from './transfer-manager';
import asyncMap from '../utilities/async-map';
import defer from '../utilities/defer';

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

  deferCreateMultipartUpload(object) {
    return defer(async () => object.createMultipartUpload({
      client: this.client,
      bucket: this.bucket,
      commandInput: this.commandInput,
    }));
  }

  deferUploadPart(object, options = {}) {
    const {
      start,
      end,
      partNumber,
      createMultipartUploadPromise,
    } = options;
    return defer(async () => {
      const { uploadId } = await createMultipartUploadPromise;
      return object.uploadPart({
        client: this.client,
        bucket: this.bucket,
        commandInput: this.commandInput,
        monitor: this.monitor,
        abortSignal: this.abortController.signal,
        start,
        end,
        uploadId,
        partNumber,
      });
    });
  }

  deferCompleteMultipartUpload(object, options = {}) {
    const {
      createMultipartUploadPromise,
      uploadPartPromises,
    } = options;
    return defer(async () => {
      const { uploadId } = await createMultipartUploadPromise;
      const uploadedParts = await Promise.all(uploadPartPromises);
      return object.completeMultipartUpload({
        client: this.client,
        bucket: this.bucket,
        uploadId,
        uploadedParts,
      });
    });
  }

  // create deferred promises which will be resolved by the concurrent transfer queue
  createMultipartUploadPromises(object) {
    const deferredCreateMultipartUpload = this.deferCreateMultipartUpload(object);
    const deferredUploadParts = object.getPartOffsets(this.partSize)
      .map(({ start, end }, index) => this.deferUploadPart(object, {
        start,
        end,
        partNumber: index + 1,
        createMultipartUploadPromise: deferredCreateMultipartUpload.promise,
      }));
    const deferredCompleteMultipartUpload = this.deferCompleteMultipartUpload(object, {
      createMultipartUploadPromise: deferredCreateMultipartUpload.promise,
      uploadPartPromises: deferredUploadParts.map(({ promise }) => promise),
    });
    return [
      deferredCreateMultipartUpload.resolve,
      ...deferredUploadParts.map(({ resolve }) => resolve),
      deferredCompleteMultipartUpload.resolve,
    ];
  }

  async done() {
    const uploadOps = [];
    this.objects.forEach((object) => {
      if (object.size > this.partSize) {
        uploadOps.push(...this.createMultipartUploadPromises(object));
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

export default UploadManager;
