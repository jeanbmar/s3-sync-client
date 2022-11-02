import { SyncObject } from '../sync-objects/SyncObject';

export interface Diff {
  created: SyncObject[];
  updated: SyncObject[];
  deleted: SyncObject[];
}
