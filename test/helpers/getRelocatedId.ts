import { SyncObject } from '../../src';

export default function getRelocatedId(id, sourcePrefix, targetPrefix) {
  const object = { id };
  SyncObject.prototype.applyLegacyRelocation.call(
    object,
    sourcePrefix,
    targetPrefix
  );
  return object.id;
}
