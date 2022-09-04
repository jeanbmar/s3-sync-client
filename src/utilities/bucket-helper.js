const parsePrefix = (bucketPrefix) => {
  const [bucket, ...prefixTokens] = bucketPrefix.split('/');
  const prefix = prefixTokens.join('/');
  return { bucket, prefix };
};

// eslint-disable-next-line import/prefer-default-export
export { parsePrefix };
