import { SyncObject } from '../../src';

export default function getRelocatedId(id, sourcePrefix, targetPrefix) {
  const object = new SyncObject({ id, size: 0, lastModified: 0 });
  object.applyRelocation(sourcePrefix, targetPrefix);
  return object.id;
}
