import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  S3Client,
  GetObjectAclCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { AbortController } from '@aws-sdk/abort-controller';
import { createLocalObjects, createMultipartLocalObjects } from './setup';
import emptyBucket from './helpers/emptyBucket';
import hasObject from './helpers/hasObject';
import getRelocatedId from './helpers/getRelocatedId';
import {
  S3SyncClient,
  SyncBucketWithBucketCommand,
  SyncBucketWithLocalCommand,
  SyncLocalWithBucketCommand,
  TransferMonitor,
  BucketObject,
  LocalObject,
  SyncObject,
  ListBucketObjectsCommand,
  ListLocalObjectsCommand,
} from '..';

const BUCKET = 's3-sync-client';
const BUCKET_2 = 's3-sync-client-2';
const DATA_DIR = path.join(__dirname, 'data');
const MULTIPART_DATA_DIR = path.join(__dirname, 'multipart-data');
const SYNC_DIR = path.join(__dirname, 'sync');

test('s3 sync client', async (t) => {
  const s3Client = new S3Client({ region: 'eu-west-3' });
  const syncClient = new S3SyncClient({ client: s3Client });
  await createLocalObjects(DATA_DIR);
  await createMultipartLocalObjects(MULTIPART_DATA_DIR);

  await t.test('loads bucket dataset', async () => {
    const monitor = new TransferMonitor();
    let count = 0;
    monitor.on('progress', (progress) => {
      count = progress.count.current;
    });
    await emptyBucket(s3Client, BUCKET_2);
    await syncClient.sync(DATA_DIR, `s3://${BUCKET_2}`, {
      del: true,
      maxConcurrentTransfers: 200,
      monitor,
    });
    const objects = await syncClient.send(
      new ListLocalObjectsCommand({
        directory: DATA_DIR,
      })
    );
    assert(count === 5000);
    assert(objects.length === 5000);
  });

  await t.test('empties bucket', async () => {
    await emptyBucket(s3Client, BUCKET);
    const bucketObjects = await syncClient.send(
      new ListBucketObjectsCommand({
        bucket: BUCKET,
      })
    );
    assert(bucketObjects.length === 0);
  });

  await t.test('lists local objects', async (l) => {
    await l.test('lists objects', async () => {
      const objects = await syncClient.send(
        new ListLocalObjectsCommand({
          directory: path.join(DATA_DIR, 'def/jkl'),
        })
      );
      assert.deepStrictEqual(
        objects.find(({ id }) => id === 'xmoj'),
        new LocalObject({
          id: 'xmoj',
          lastModified: 1618993846000,
          size: 3,
          path: path.join(DATA_DIR, 'def/jkl/xmoj'),
        })
      );
    });

    await l.test('throws if directory is invalid ', async () => {
      await assert.rejects(() =>
        syncClient.send(
          new ListLocalObjectsCommand({
            directory: path.join(DATA_DIR, 'xoin'),
          })
        )
      );
    });
  });

  await t.test('relocates objects', async (r) => {
    await r.test('relocates id from root', () => {
      assert(getRelocatedId('', '', '') === '');
      assert(getRelocatedId('id', '', '') === 'id');
      assert(getRelocatedId('a/b/c', '', '') === 'a/b/c');
      assert(getRelocatedId('a/b/c', '', 'x') === 'x/a/b/c');
      assert(getRelocatedId('a/b/c', '', 'x/y') === 'x/y/a/b/c');
      assert(getRelocatedId('zzz/xmoj', '', 'zzz') === 'zzz/zzz/xmoj');
    });

    await r.test('relocates id to root', () => {
      assert(getRelocatedId('a/b/c', 'a', '') === 'b/c');
      assert(getRelocatedId('a/b/c', 'a/b', '') === 'c');
    });

    await r.test('does not relocate folders', () => {
      assert(getRelocatedId('a/b/c', 'a/b/c', '') === 'a/b/c');
    });

    await r.test('performs complex id relocation', () => {
      assert(getRelocatedId('a/b/c', 'a', 'x') === 'x/b/c');
      assert(getRelocatedId('a/b/c', 'a', 'x/y/z') === 'x/y/z/b/c');
      assert(getRelocatedId('a/b/c', 'a/b', 'x') === 'x/c');
      assert(getRelocatedId('a/b/c', 'a/b', 'x/y') === 'x/y/c');
      assert(getRelocatedId('x/y/z', 'x/y', '') === 'z');
    });
  });

  await t.test('syncs bucket with bucket', async (b) => {
    await b.test('syncs a single dir with progress tracking', async () => {
      const monitor = new TransferMonitor();
      let count = 0;
      monitor.on('progress', (progress) => {
        count = progress.count.current;
      });
      await syncClient.send(
        new SyncBucketWithBucketCommand({
          sourceBucketPrefix: `${BUCKET_2}/def/jkl`,
          targetBucketPrefix: `${BUCKET}/def/jkl`,
          maxConcurrentTransfers: 200,
          monitor,
        })
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
          prefix: 'def/jkl',
        })
      );
      assert(hasObject(objects, 'def/jkl/xmoj') === true);
      assert(count === 11);
      assert(objects.length === 11);
    });

    await b.test('syncs a single dir with root relocation', async () => {
      await syncClient.send(
        new SyncBucketWithBucketCommand({
          sourceBucketPrefix: `${BUCKET_2}/def/jkl`,
          targetBucketPrefix: `${BUCKET}/def/jkl`,
          maxConcurrentTransfers: 200,
          relocations: [(currentPath) => `relocated/${currentPath}`],
        })
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
          prefix: 'relocated',
        })
      );
      assert(hasObject(objects, 'relocated/def/jkl/xmoj') === true);
      assert(objects.length === 11);
    });

    await b.test('syncs a single dir with folder relocation', async () => {
      await syncClient.sync(
        `s3://${BUCKET_2}/def/jkl`,
        `s3://${BUCKET}/def/jkl`,
        {
          maxConcurrentTransfers: 200,
          relocations: [
            (currentPath) =>
              currentPath.startsWith('def/jkl')
                ? currentPath.replace('def/jkl', 'relocated-bis/folder')
                : currentPath,
          ],
        }
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
          prefix: 'relocated-bis/folder',
        })
      );
      assert(hasObject(objects, 'relocated-bis/folder/xmoj') === true);
      assert(objects.length === 11);
    });

    await b.test(
      'syncs an entire bucket with delete option enabled',
      async () => {
        await syncClient.send(
          new SyncBucketWithBucketCommand({
            sourceBucketPrefix: BUCKET_2,
            targetBucketPrefix: BUCKET,
            del: true,
            maxConcurrentTransfers: 200,
          })
        );
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
          })
        );
        assert(objects.length === 5000);
      }
    );

    // https://github.com/jeanbmar/s3-sync-client/issues/40
    await b.test('processes prefix properly', async () => {
      fs.rmSync(path.join(SYNC_DIR, 'issue40'), {
        recursive: true,
        force: true,
      });
      await syncClient.sync(`s3://${BUCKET_2}/def`, `s3://${BUCKET}/issue40`);
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
          prefix: 'issue40',
        })
      );
      assert(hasObject(objects, 'issue40/def/jkl/xmoj') === false);
      assert(hasObject(objects, 'issue40/jkl/xmoj') === true);
    });
  });

  await t.test('syncs bucket with local', async (b) => {
    await b.test('syncs a single dir with a few files', async () => {
      await syncClient.send(
        new SyncBucketWithLocalCommand({
          localDir: path.join(DATA_DIR, 'def/jkl'),
          bucketPrefix: BUCKET,
        })
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
        })
      );
      assert(hasObject(objects, 'xmoj') === true);
    });

    // https://github.com/jeanbmar/s3-sync-client/issues/30
    await b.test('does not delete excluded files', async () => {
      await syncClient.send(
        new SyncBucketWithLocalCommand({
          localDir: path.join(DATA_DIR, 'def/jkl'),
          bucketPrefix: BUCKET,
          del: true,
          filters: [{ exclude: (key) => key.startsWith('def/jkl/xmot') }],
        })
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
        })
      );
      assert(hasObject(objects, 'xmot') === true);
    });

    await b.test('deletes excluded files', async () => {
      await syncClient.send(
        new SyncBucketWithLocalCommand({
          localDir: path.join(DATA_DIR, 'def/jkl'),
          bucketPrefix: BUCKET,
          del: true,
          deleteExcluded: true,
          filters: [{ exclude: (key) => key.startsWith('def/jkl/xmot') }],
        })
      );
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
        })
      );
      assert(hasObject(objects, 'xmot') === false);
    });

    await b.test(
      'syncs a single dir with a bucket using relocation',
      async () => {
        await syncClient.sync(
          path.join(DATA_DIR, 'def/jkl'),
          `s3://${path.posix.join(BUCKET, 'zzz')}`,
          { relocations: [(currentPath) => `zzz/${currentPath}`] }
        );
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
            prefix: 'zzz',
          })
        );
        assert(hasObject(objects, 'zzz/zzz/xmoj') === true);
      }
    );

    await b.test(
      'syncs files with extra SDK command input options',
      async () => {
        await syncClient.send(
          new SyncBucketWithLocalCommand({
            localDir: path.join(DATA_DIR, 'def/jkl'),
            bucketPrefix: path.posix.join(BUCKET, 'acl'),
            commandInput: (input) => ({
              ACL: 'aws-exec-read',
              Metadata: {
                custom: input.Key,
              },
            }),
          })
        );
        const metadataResponse = await s3Client.send(
          new GetObjectCommand({
            Bucket: BUCKET,
            Key: 'acl/xmoj',
          })
        );
        assert(metadataResponse.Metadata.custom === 'acl/xmoj');
        const aclResponse = await s3Client.send(
          new GetObjectAclCommand({
            Bucket: BUCKET,
            Key: 'acl/xmoj',
          })
        );
        assert(
          aclResponse.Grants.find(
            ({ Permission }) => Permission === 'FULL_CONTROL'
          ) != null
        );
        assert(
          aclResponse.Grants.find(({ Permission }) => Permission === 'READ') !=
            null
        );
      }
    );

    await b.test(
      'syncs 5000 local objects successfully with progress tracking',
      async () => {
        await emptyBucket(s3Client, BUCKET);
        const monitor = new TransferMonitor();
        let count = 0;
        monitor.on('progress', (progress) => {
          count = progress.count.current;
        });
        await syncClient.send(
          new SyncBucketWithLocalCommand({
            localDir: DATA_DIR,
            bucketPrefix: BUCKET,
            maxConcurrentTransfers: 200,
            monitor,
          })
        );
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
          })
        );
        assert(count === 5000);
        assert(objects.length >= 5000);
      }
    );

    await b.test(
      'syncs 5000 local objects with delete option enabled',
      async () => {
        await syncClient.send(
          new SyncBucketWithLocalCommand({
            localDir: path.join(DATA_DIR, 'def/jkl'),
            bucketPrefix: BUCKET,
          })
        );
        await syncClient.sync(DATA_DIR, `s3://${BUCKET}`, {
          del: true,
          maxConcurrentTransfers: 200,
        });
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
          })
        );
        assert(objects.length === 5000);
        assert(hasObject(objects, 'xmoj') === false);
      }
    );

    await b.test('aborts sync on purpose and throw', async () => {
      const monitor = new TransferMonitor();
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), 10000);
      await assert.rejects(
        () =>
          syncClient.sync(DATA_DIR, `s3://${BUCKET}/abort`, {
            monitor,
            abortSignal: abortController.signal,
          }),
        { message: 'Request aborted' }
      );
    });

    await b.test('syncs a local object using multipart uploads', async () => {
      await syncClient.sync(MULTIPART_DATA_DIR, `s3://${BUCKET}`, {
        maxConcurrentTransfers: 2,
        partSize: 5 * 1024 * 1024,
        relocations: [(currentPath) => `multipart/${currentPath}`],
      });
      const objects = await syncClient.send(
        new ListBucketObjectsCommand({
          bucket: BUCKET,
        })
      );
      assert(hasObject(objects, 'multipart/multipart.data') === true);
    });

    // https://github.com/jeanbmar/s3-sync-client/issues/33
    await b.test('aborts a multipart sync and throw', async () => {
      const monitor = new TransferMonitor();
      const abortController = new AbortController();
      let tick = 0;
      monitor.on('progress', () => {
        tick += 1;
        if (tick === 100) abortController.abort();
      });
      await assert.rejects(
        () =>
          syncClient.sync(
            MULTIPART_DATA_DIR,
            `s3://${BUCKET}/abort-multipart`,
            {
              maxConcurrentTransfers: 1,
              partSize: 5 * 1024 * 1024,
              monitor,
              abortSignal: abortController.signal,
            }
          ),
        { message: 'Request aborted' }
      );
    });
  });

  await t.test('syncs local with bucket', async (l) => {
    fs.mkdirSync(path.join(__dirname, 'sync'), { recursive: true });

    await l.test('syncs a single dir with a few files', async () => {
      await syncClient.send(
        new SyncLocalWithBucketCommand({
          bucketPrefix: `${BUCKET_2}/def`,
          localDir: SYNC_DIR,
        })
      );
      const objects = await syncClient.send(
        new ListLocalObjectsCommand({
          directory: SYNC_DIR,
        })
      );
      assert(hasObject(objects, 'jkl/xmoj') === true);
    });

    await l.test(
      'syncs a single dir with a few files and delete extra files',
      async () => {
        // https://github.com/jeanbmar/s3-sync-client/issues/9
        await syncClient.send(
          new SyncLocalWithBucketCommand({
            bucketPrefix: `${BUCKET_2}/def/jkl`,
            localDir: SYNC_DIR,
            relocations: [(currentPath) => `issue9/${currentPath}`],
          })
        );
        fs.writeFileSync(
          path.join(`${SYNC_DIR}/issue9`, 'to-be-deleted'),
          'to-be-deleted',
          'utf8'
        );
        await syncClient.send(
          new SyncLocalWithBucketCommand({
            bucketPrefix: `${BUCKET_2}/def/jkl`,
            localDir: SYNC_DIR,
            relocations: [(currentPath) => `issue9/${currentPath}`],
            del: true,
          })
        );
        const objects = await syncClient.send(
          new ListLocalObjectsCommand({
            directory: `${SYNC_DIR}/issue9`,
          })
        );
        assert(objects.length === 11);
        assert(
          hasObject(objects, `${SYNC_DIR}/issue9/to-be-deleted`) === false
        );
      }
    );

    await l.test('syncs a single dir and flatten it', async () => {
      await syncClient.send(
        new SyncLocalWithBucketCommand({
          bucketPrefix: `${BUCKET_2}/def/jkl`,
          localDir: SYNC_DIR,
          relocations: [
            (currentPath) =>
              currentPath.startsWith('def/jkl')
                ? currentPath.replace('def/jkl', '')
                : currentPath,
          ],
        })
      );
      const objects = await syncClient.send(
        new ListLocalObjectsCommand({
          directory: SYNC_DIR,
        })
      );
      assert(hasObject(objects, 'xmoj') === true);
    });

    await l.test(
      'syncs 5000 bucket objects with progress tracking',
      async () => {
        const monitor = new TransferMonitor();
        let count = 0;
        monitor.on('progress', (progress) => {
          count = progress.count.current;
        });
        await syncClient.sync(`s3://${BUCKET_2}`, SYNC_DIR, {
          maxConcurrentTransfers: 200,
          monitor,
        });
        const objects = await syncClient.send(
          new ListLocalObjectsCommand({
            directory: SYNC_DIR,
          })
        );
        assert(count === 5000);
        assert(objects.length >= 5000);
      }
    );

    await l.test(
      'syncs 5000 bucket objects with delete option enabled',
      async () => {
        await syncClient.send(
          new SyncLocalWithBucketCommand({
            bucketPrefix: `${BUCKET_2}/def/jkl`,
            localDir: path.join(SYNC_DIR, 'foo'),
          })
        );
        await syncClient.sync(`s3://${BUCKET_2}`, SYNC_DIR, {
          del: true,
          maxConcurrentTransfers: 200,
        });
        const objects = await syncClient.send(
          new ListLocalObjectsCommand({
            directory: SYNC_DIR,
          })
        );
        assert(objects.length === 5000);
        assert(hasObject(objects, 'foo/def/jkl/xmoj') === false);
      }
    );

    await l.test('aborts sync and throw', async () => {
      const monitor = new TransferMonitor();
      const abortController = new AbortController();
      monitor.on('progress', () => abortController.abort());
      await assert.rejects(
        () =>
          syncClient.send(
            new SyncLocalWithBucketCommand({
              bucketPrefix: BUCKET_2,
              localDir: path.join(SYNC_DIR, 'abort'),
              monitor,
              abortSignal: abortController.signal,
            })
          ),
        { message: 'Request aborted' }
      );
    });

    // https://github.com/jeanbmar/s3-sync-client/issues/36
    await l.test('preserves s3 last modified date', async () => {
      const now = Date.now();
      fs.rmSync(path.join(SYNC_DIR, 'last-modified'), {
        recursive: true,
        force: true,
      });
      await syncClient.sync(
        `s3://${BUCKET_2}/xoim`,
        path.join(SYNC_DIR, 'last-modified')
      );
      const { atimeMs, mtimeMs } = fs.statSync(
        path.join(SYNC_DIR, 'last-modified', 'xoim')
      );
      assert(atimeMs < now);
      assert(mtimeMs < now);
    });

    // https://github.com/jeanbmar/s3-sync-client/issues/40
    await l.test('processes prefix properly', async () => {
      fs.rmSync(path.join(SYNC_DIR, 'issue40'), {
        recursive: true,
        force: true,
      });
      await syncClient.sync(
        `s3://${BUCKET_2}/def`,
        path.join(SYNC_DIR, 'issue40')
      );
      const objects = await syncClient.send(
        new ListLocalObjectsCommand({
          directory: path.join(SYNC_DIR, 'issue40'),
        })
      );
      assert(hasObject(objects, 'def/jkl/xmoj') === false);
      assert(hasObject(objects, 'jkl/xmoj') === true);
    });
  });

  await t.test('diffs sync objects', async (d) => {
    const bucketObjects = [
      { id: 'abc/created', lastModified: 0, size: 1 },
      { id: 'abc/updated1', lastModified: 1, size: 1 },
      { id: 'abc/updated2', lastModified: 0, size: 2 },
      { id: 'abc/unchanged', lastModified: 0, size: 1 },
    ] as BucketObject[];
    const localObjects = [
      { id: 'abc/unchanged', lastModified: 0, size: 1 },
      { id: 'abc/updated1', lastModified: 0, size: 1 },
      { id: 'abc/updated2', lastModified: 0, size: 1 },
      { id: 'deleted', lastModified: 0, size: 1 },
    ] as LocalObject[];

    await d.test('computes sync operations on objects', () => {
      const diff = SyncObject.diff(bucketObjects, localObjects);
      assert.deepStrictEqual(diff.created, [
        { id: 'abc/created', size: 1, lastModified: 0 },
      ]);
      assert.deepStrictEqual(diff.updated, [
        { id: 'abc/updated1', size: 1, lastModified: 1 },
        { id: 'abc/updated2', size: 2, lastModified: 0 },
      ]);
      assert.deepStrictEqual(diff.deleted, [
        { id: 'deleted', size: 1, lastModified: 0 },
      ]);
    });

    await d.test('computes sync sizeOnly operations on objects', () => {
      const diff = SyncObject.diff(bucketObjects, localObjects, {
        sizeOnly: true,
      });
      assert.deepStrictEqual(diff.created, [
        { id: 'abc/created', size: 1, lastModified: 0 },
      ]);
      assert.deepStrictEqual(diff.updated, [
        { id: 'abc/updated2', size: 2, lastModified: 0 },
      ]);
      assert.deepStrictEqual(diff.deleted, [
        { id: 'deleted', size: 1, lastModified: 0 },
      ]);
    });
  });

  await t.test('filters source objects', async (f) => {
    await f.test(
      'applies include and exclude filters to source objects',
      () => {
        const objects = [
          'flowers/rose.jpg',
          'flowers/sunflower.jpg',
          'flowers/tulip.png',
          'flowers/unknown/1.jpg',
          'animals/cat.jpg',
        ].map(
          (id) => new LocalObject({ id, size: 0, lastModified: 0, path: '' })
        );
        objects.forEach((object) => {
          object.applyFilters([
            { exclude: () => true },
            { include: (key) => key.endsWith('.jpg') },
            { exclude: (key) => key.startsWith('animals') },
            { exclude: (key) => key.indexOf('/unknown/') > -1 },
          ]);
        });
        const included = objects.filter((object) => object.isIncluded);
        const keys = included.map((object) => object.id);
        assert.deepStrictEqual(keys, [
          'flowers/rose.jpg',
          'flowers/sunflower.jpg',
        ]);
      }
    );

    await f.test(
      'syncs bucket with filtered source bucket objects',
      async () => {
        await syncClient.send(
          new SyncBucketWithBucketCommand({
            sourceBucketPrefix: BUCKET_2,
            targetBucketPrefix: BUCKET,
            filters: [
              { exclude: () => true },
              { include: (key) => key.startsWith('def/jkl') },
            ],
            del: true,
          })
        );
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
          })
        );
        assert(objects.length === 11);
      }
    );

    await f.test(
      'syncs bucket with filtered source local objects',
      async () => {
        await emptyBucket(s3Client, BUCKET);
        await syncClient.send(
          new SyncBucketWithLocalCommand({
            localDir: DATA_DIR,
            bucketPrefix: BUCKET,
            filters: [
              { exclude: () => true },
              { include: (key) => key.startsWith('def/jkl') },
            ],
          })
        );
        const objects = await syncClient.send(
          new ListBucketObjectsCommand({
            bucket: BUCKET,
          })
        );
        assert(objects.length === 11);
      }
    );

    await f.test(
      'syncs local fs with filtered source bucket objects',
      async () => {
        fs.rmSync(path.join(SYNC_DIR, 'def/jkl'), {
          force: true,
          recursive: true,
        });
        await syncClient.send(
          new SyncLocalWithBucketCommand({
            bucketPrefix: BUCKET,
            localDir: SYNC_DIR,
            filters: [
              { exclude: () => true },
              { include: (key) => key.startsWith('def/j') },
            ],
          })
        );
        const objects = await syncClient.send(
          new ListLocalObjectsCommand({
            directory: path.join(SYNC_DIR, 'def/jkl'),
          })
        );
        assert(objects.length === 11);
      }
    );
  });
});
