const path = require('path');
const minimatch = require('minimatch');

module.exports = (sourceObjects, targetObjects, sizeOnly = false, excludeArr) => {
    const  excludeRegex= new RegExp(
        excludeArr
          .reduce((acc, exclude) => {
            return acc + '|' + minimatch.makeRe(exclude).source;
          }, '')
          .substring(1),
      );
    const sourceObjectMap = new Map(
        sourceObjects.map((sourceObject) => [sourceObject.id, sourceObject]),
    );
    const targetObjectMap = new Map(
        targetObjects.map((targetObject) => [targetObject.id, targetObject]),
    );
    const created = [];
    const updated = [];
    sourceObjectMap.forEach((sourceObject) => {
        if (excludeArr.length && excludeRegex.test(path.basename(sourceObject.id))) {
            return;
        }
        const targetObject = targetObjectMap.get(sourceObject.id);
        if (targetObject === undefined) {
            created.push(sourceObject);
        } else if (
            sourceObject.size !== targetObject.size
            || (!sizeOnly && sourceObject.lastModified > targetObject.lastModified)
        ) {
            updated.push(sourceObject);
        }
    });
    const deleted = [];
    targetObjectMap.forEach((targetObject) => {
        if (excludeArr.length && excludeRegex.test(path.basename(targetObject.id))) {
            return;
        }
        if (!sourceObjectMap.has(targetObject.id)) {
            deleted.push(targetObject);
        }
    });
    return { created, updated, deleted };
};
