export type Relocation = [sourcePrefix: string, targetPrefix: string];

export type Filter = {
  exclude?: (key) => boolean;
  include?: (key) => boolean;
};

export function mergeInput<T>(commandInput: T, properties: any = {}): T {
  const entries = Object.entries(properties).map(
    ([propertyName, propertyValue]) => {
      const evaluated =
        typeof propertyValue === 'function'
          ? propertyValue(commandInput)
          : propertyValue;
      return [propertyName, evaluated];
    }
  );
  return {
    ...commandInput,
    ...Object.fromEntries(entries),
  };
}

export class Command {}
