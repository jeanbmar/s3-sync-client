import fs from 'node:fs';
import path from 'node:path';
import tar from 'tar';

export const createLocalObjects = async (dir) => {
  fs.rmSync(dir, { force: true, recursive: true });
  fs.mkdirSync(dir, { recursive: true });
  await tar.x({
    file: path.join(__dirname, 'sample-files.tar.gz'),
    cwd: dir,
  });
};

export const createMultipartLocalObjects = async (dir) => {
  fs.rmSync(dir, { force: true, recursive: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'multipart.data'),
    Buffer.alloc(512 * 1024 * 1024).fill('a')
  );
};
