import { Relocation, Filter } from '../commands/Command';

export type SyncObjectOptions = {
  id: string;
  size: number;
  lastModified: number;
};

export type Diff = {
  created: SyncObject[];
  updated: SyncObject[];
  deleted: SyncObject[];
};

export abstract class SyncObject {
  id: string;
  size: number;
  lastModified: number;
  private isExcluded: boolean = false;

  constructor(options: SyncObjectOptions) {
    this.id = options.id;
    this.size = options.size;
    this.lastModified = options.lastModified;
  }

  static diff(
    sourceObjects: SyncObject[],
    targetObjects: SyncObject[],
    sizeOnly: boolean = false
  ): Diff {
    const sourceObjectMap = new Map(
      sourceObjects.map((sourceObject) => [sourceObject.id, sourceObject])
    );
    const targetObjectMap = new Map(
      targetObjects.map((targetObject) => [targetObject.id, targetObject])
    );
    const created = [];
    const updated = [];
    sourceObjectMap.forEach((sourceObject) => {
      const targetObject = targetObjectMap.get(sourceObject.id);
      if (targetObject === undefined) {
        created.push(sourceObject);
      } else if (
        sourceObject.size !== targetObject.size ||
        (!sizeOnly && sourceObject.lastModified > targetObject.lastModified)
      ) {
        updated.push(sourceObject);
      }
    });
    const deleted = [];
    targetObjectMap.forEach((targetObject) => {
      if (!sourceObjectMap.has(targetObject.id)) {
        deleted.push(targetObject);
      }
    });
    return { created, updated, deleted };
  }

  get isIncluded(): boolean {
    return !this.isExcluded;
  }

  applyFilters(filters: Filter[]): void {
    filters.forEach(({ include, exclude }) => {
      if (!this.isExcluded && exclude != null) {
        this.isExcluded = exclude(this.id);
      }
      if (this.isExcluded && include) {
        this.isExcluded = !include(this.id);
      }
    });
  }

  applyLegacyRelocation(sourcePrefix, targetPrefix) {
    if (sourcePrefix === '' && targetPrefix !== '') {
      this.id = `${targetPrefix}/${this.id}`;
    }
    if (this.id.startsWith(`${sourcePrefix}/`)) {
      if (targetPrefix === '') {
        this.id = this.id.slice(sourcePrefix.length + 1);
      }
      this.id = this.id.replace(sourcePrefix, targetPrefix);
    }
  }

  applyRelocation(relocation: Relocation): void {
    if (Array.isArray(relocation)) {
      this.applyLegacyRelocation(...relocation);
    } else {
      this.id = relocation(this.id);
    }
  }

  applyRelocations(relocations: Relocation[]): void {
    relocations.forEach((relocation) => {
      this.applyRelocation(relocation);
    });
  }
}
