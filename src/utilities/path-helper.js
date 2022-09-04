import path from 'node:path';

export const toPosixPath = (filePath) => filePath.split(path.sep).join(path.posix.sep);
export const toLocalPath = (filePath) => filePath.split(path.posix.sep).join(path.sep);
