class Relocator {
    static getRelocation(id, sourcePrefix, targetPrefix) {
        if (sourcePrefix === '' && targetPrefix !== '') {
            return `${targetPrefix}/${id}`;
        }
        if (id.startsWith(`${sourcePrefix}/`)) {
            if (targetPrefix === '') {
                return id.slice(sourcePrefix.length + 1);
            }
            return id.replace(sourcePrefix, targetPrefix);
        }
        return id;
    }

    static relocate(id, relocations) {
        return relocations
            .reduce((relocationId, [sourcePrefix, targetPrefix]) => (
                this.getRelocation(relocationId, sourcePrefix, targetPrefix)
            ), id);
    }

    static relocateMap(map, relocations) {
        const relocatedMap = new Map();
        map.forEach((syncObject) => {
            const relocationId = this.relocate(syncObject.id, relocations);
            relocatedMap.set(relocationId, {
                ...syncObject,
                id: relocationId,
            });
        });
        return relocatedMap;
    }
}

module.exports = Relocator;
