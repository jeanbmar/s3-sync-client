const diff = (sourceObjects, targetObjects, sizeOnly = false) => {
  const sourceObjectMap = new Map(
    sourceObjects.map((sourceObject) => [sourceObject.id, sourceObject]),
  );
  const targetObjectMap = new Map(
    targetObjects.map((targetObject) => [targetObject.id, targetObject]),
  );
  const created = [];
  const updated = [];
  sourceObjectMap.forEach((sourceObject) => {
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
    if (!sourceObjectMap.has(targetObject.id)) {
      deleted.push(targetObject);
    }
  });
  return { created, updated, deleted };
};

export default diff;
