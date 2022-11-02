export const asyncMap = async (iterable, limit, asyncFn): Promise<any[]> => {
  const results = [];
  let currentIndex = limit;
  await Promise.all(iterable.slice(0, limit).map(async (item, i) => {
    results[i] = await asyncFn(item, i);
    while (currentIndex < iterable.length) {
      currentIndex += 1;
      results[currentIndex - 1] = await asyncFn(iterable[currentIndex - 1], currentIndex - 1);
    }
  }));
  return results;
};

export default asyncMap;
