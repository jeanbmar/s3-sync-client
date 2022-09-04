class SyncObject {
  constructor(properties = {}) {
    this.id = properties.id;
    this.size = 0;
    this.lastModified = 0;
    this.excluded = false;
  }

  isIncluded() {
    return !this.excluded;
  }

  relocate(sourcePrefix, targetPrefix) {
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

  applyFilters(filters) {
    filters.forEach(({ include, exclude }) => {
      if (!this.excluded && exclude) {
        this.excluded = exclude(this.id);
      }
      if (this.excluded && include) {
        this.excluded = !include(this.id);
      }
    });
  }

  applyRelocations(relocations) {
    relocations.forEach(([sourcePrefix, targetPrefix]) => {
      this.relocate(sourcePrefix, targetPrefix);
    });
  }
}

export default SyncObject;
