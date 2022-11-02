export class CommandInputHelper {
  static merge(commandInput: any, properties: any = {}): object {
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
  }
}

export default CommandInputHelper;
