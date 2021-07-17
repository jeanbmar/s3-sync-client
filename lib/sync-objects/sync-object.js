const path = require('path');

class SyncObject {
    constructor(properties = {}) {
        this.id = properties.id;
        this.size = 0;
        this.lastModified = 0;
    }

    flatten() {
        this.id = path.posix.basename(this.id);
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

    applyRelocations(relocations) {
        relocations.forEach(([sourcePrefix, targetPrefix]) => {
            this.relocate(sourcePrefix, targetPrefix);
        });
    }
}

module.exports = SyncObject;
