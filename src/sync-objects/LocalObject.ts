import { promises as fsp } from 'node:fs';
import { SyncObject, SyncObjectOptions } from './SyncObject';

export type LocalObjectOptions = {
  path: string;
} & SyncObjectOptions;

export class LocalObject extends SyncObject {
  path: string;

  constructor(options: LocalObjectOptions) {
    super(options);
    this.path = options.path;
  }

  async delete(): Promise<void> {
    await fsp.unlink(this.path);
  }
}
