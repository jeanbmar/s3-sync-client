import { SyncObject } from '../../src';

export default function getRelocatedId(id, sourcePrefix, targetPrefix) {
  const object = { id };
  SyncObject.prototype.applyRelocation.call(object, sourcePrefix, targetPrefix);
  return object.id;
}
