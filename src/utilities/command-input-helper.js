const merge = (commandInput, properties = {}) => {
  const entries = Object.entries(properties)
    .map(([propertyName, propertyValue]) => {
      const evaluated = typeof propertyValue === 'function'
        ? propertyValue(commandInput)
        : propertyValue;
      return [propertyName, evaluated];
    });
  return {
    ...commandInput,
    ...Object.fromEntries(entries),
  };
};

// eslint-disable-next-line import/prefer-default-export
export { merge };
