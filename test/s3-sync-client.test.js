const fs = require('fs');
const path = require('path');
const tar = require('tar');
const { S3Client, GetObjectAclCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const S3SyncClient = require('..');
const { TransferMonitor } = require('..');
const SyncObject = require('../lib/sync-objects/sync-object');
const LocalObject = require('../lib/sync-objects/local-object');
const emptyBucket = require('./helpers/empty-bucket');
const hasObject = require('./helpers/has-object');
const syncDiff = require('../lib/utilities/sync-diff');

const BUCKET = 's3-sync-client';
const BUCKET_2 = 's3-sync-client-2';
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DATA_DIR = path.join(__dirname, 'data');
const MULTIPART_DATA_DIR = path.join(__dirname, 'multipart-data');
const SYNC_DIR = path.join(__dirname, 'sync');

jest.setTimeout(90000);

describe('S3SyncClient', () => {
    let s3Client;
    let syncClient;

    beforeAll(() => {
        s3Client = new S3Client({
            region: 'eu-west-3',
            credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
        });
        syncClient = new S3SyncClient({ client: s3Client });
    });

    test('load initial data folder', async () => {
        fs.rmSync(DATA_DIR, { force: true, recursive: true });
        fs.mkdirSync(DATA_DIR, { recursive: true });
        await tar.x({
            file: path.join(__dirname, 'sample-files.tar.gz'),
            cwd: DATA_DIR,
        });
    });

    test('create multipart data', () => {
        fs.rmSync(MULTIPART_DATA_DIR, { force: true, recursive: true });
        fs.mkdirSync(MULTIPART_DATA_DIR, { recursive: true });
        fs.writeFileSync(path.join(MULTIPART_DATA_DIR, 'multipart.data'), Buffer.alloc(512 * 1024 * 1024).fill('a'));
    });

    test('load bucket 2 dataset', async () => {
        const monitor = new TransferMonitor();
        let count = 0;
        monitor.on('progress', (progress) => { count = progress.count.current; });
        await emptyBucket(syncClient, BUCKET_2);
        await syncClient.sync(DATA_DIR, `s3://${BUCKET_2}`, { del: true, maxConcurrentTransfers: 200, monitor });
        const objects = await syncClient.listLocalObjects(DATA_DIR);
        expect(count).toStrictEqual(5000);
        expect(objects.length).toStrictEqual(5000);
    });

    test('empty bucket', async () => {
        await emptyBucket(syncClient, BUCKET);
        const bucketObjects = await syncClient.listBucketObjects(BUCKET);
        expect(bucketObjects.length).toStrictEqual(0);
    });

    describe('list local objects', () => {
        test('listed objects are properly formed', async () => {
            const objects = await syncClient.listLocalObjects(path.join(DATA_DIR, 'def/jkl'));
            expect(objects.find(({ id }) => id === 'xmoj')).toStrictEqual(new LocalObject({
                id: 'xmoj',
                lastModified: 1618993846000,
                size: 3,
                path: path.join(DATA_DIR, 'def/jkl/xmoj'),
            }));
        });

        test('list local objects with non-directory args throws', async () => {
            await expect(syncClient.listLocalObjects(path.join(DATA_DIR, 'xoin'))).rejects.toThrow();
        });
    });

    describe('get relocation id', () => {
        const getRelocation = (id, sourcePrefix, targetPrefix) => {
            const object = new SyncObject({ id });
            object.relocate(sourcePrefix, targetPrefix);
            return object.id;
        };
        test('relocate id from root', () => {
            expect(getRelocation('', '', '')).toStrictEqual('');
            expect(getRelocation('id', '', '')).toStrictEqual('id');
            expect(getRelocation('a/b/c', '', '')).toStrictEqual('a/b/c');
            expect(getRelocation('a/b/c', '', 'x')).toStrictEqual('x/a/b/c');
            expect(getRelocation('a/b/c', '', 'x/y')).toStrictEqual('x/y/a/b/c');
        });
        test('relocate id to root', () => {
            expect(getRelocation('a/b/c', 'a', '')).toStrictEqual('b/c');
            expect(getRelocation('a/b/c', 'a/b', '')).toStrictEqual('c');
        });
        test('folder is not relocated', () => {
            expect(getRelocation('a/b/c', 'a/b/c', '')).toStrictEqual('a/b/c');
        });
        test('perform complex id relocation', () => {
            expect(getRelocation('a/b/c', 'a', 'x')).toStrictEqual('x/b/c');
            expect(getRelocation('a/b/c', 'a', 'x/y/z')).toStrictEqual('x/y/z/b/c');
            expect(getRelocation('a/b/c', 'a/b', 'x')).toStrictEqual('x/c');
            expect(getRelocation('a/b/c', 'a/b', 'x/y')).toStrictEqual('x/y/c');
            expect(getRelocation('x/y/z', 'x/y', '')).toStrictEqual('z');
        });
    });

    describe('sync bucket with bucket', () => {
        test('sync a single dir with progress tracking', async () => {
            const monitor = new TransferMonitor();
            let count = 0;
            monitor.on('progress', (progress) => { count = progress.count.current; });
            await syncClient.bucketWithBucket(`${BUCKET_2}/def/jkl`, BUCKET, { maxConcurrentTransfers: 200, monitor });
            const objects = await syncClient.listBucketObjects(BUCKET, { prefix: 'def/jkl' });
            expect(hasObject(objects, 'def/jkl/xmoj')).toBe(true);
            expect(count).toStrictEqual(11);
            expect(objects.length).toStrictEqual(11);
        });

        test('sync a single dir with root relocation', async () => {
            await syncClient.bucketWithBucket(`${BUCKET_2}/def/jkl`, BUCKET, {
                maxConcurrentTransfers: 200,
                relocations: [['', 'relocated']],
            });
            const objects = await syncClient.listBucketObjects(BUCKET, { prefix: 'relocated' });
            expect(hasObject(objects, 'relocated/def/jkl/xmoj')).toBe(true);
            expect(objects.length).toStrictEqual(11);
        });

        test('sync a single dir with folder relocation', async () => {
            await syncClient.sync(`s3://${BUCKET_2}/def/jkl`, `s3://${BUCKET}`, {
                maxConcurrentTransfers: 200,
                relocations: [['def/jkl', 'relocated-bis/folder']],
            });
            const objects = await syncClient.listBucketObjects(BUCKET, { prefix: 'relocated-bis/folder' });
            expect(hasObject(objects, 'relocated-bis/folder/xmoj')).toBe(true);
            expect(objects.length).toStrictEqual(11);
        });

        test('sync entire bucket with delete option successfully', async () => {
            await syncClient.bucketWithBucket(BUCKET_2, BUCKET, { del: true, maxConcurrentTransfers: 200 });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(objects.length).toStrictEqual(5000);
        });
    });

    describe('sync bucket with local', () => {
        test('sync a single dir with a few files successfully', async () => {
            await syncClient.bucketWithLocal(path.join(DATA_DIR, 'def/jkl'), BUCKET);
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(hasObject(objects, 'xmoj')).toBe(true);
        });

        test('sync a single dir with a bucket using relocation successfully', async () => {
            await syncClient.sync(
                path.join(DATA_DIR, 'def/jkl'),
                `s3://${path.posix.join(BUCKET, 'zzz')}`,
                { relocations: [['', 'zzz']] },
            );
            const objects = await syncClient.listBucketObjects(BUCKET, { prefix: 'zzz' });
            expect(hasObject(objects, 'zzz/zzz/xmoj')).toBe(true);
        });

        test('sync files with extra SDK command input options successfully', async () => {
            await syncClient.bucketWithLocal(
                path.join(DATA_DIR, 'def/jkl'),
                path.posix.join(BUCKET, 'acl'),
                {
                    commandInput: {
                        ACL: 'aws-exec-read',
                        Metadata: (syncCommandInput) => ({ custom: syncCommandInput.Key }),
                    },
                },
            );
            const metadataResponse = await s3Client.send(new GetObjectCommand({
                Bucket: BUCKET,
                Key: 'acl/xmoj',
            }));
            expect(metadataResponse.Metadata.custom).toStrictEqual('acl/xmoj');
            const aclResponse = await s3Client.send(new GetObjectAclCommand({
                Bucket: BUCKET,
                Key: 'acl/xmoj',
            }));
            expect(aclResponse.Grants.find(({ Permission }) => Permission === 'FULL_CONTROL')).toBeTruthy();
            expect(aclResponse.Grants.find(({ Permission }) => Permission === 'READ')).toBeTruthy();
        });

        test('sync 5000 local objects successfully with progress tracking', async () => {
            await emptyBucket(syncClient, BUCKET);
            const monitor = new TransferMonitor();
            let count = 0;
            monitor.on('progress', (progress) => { count = progress.count.current; });
            await syncClient.bucketWithLocal(DATA_DIR, BUCKET, { maxConcurrentTransfers: 200, monitor });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(count).toStrictEqual(5000);
            expect(objects.length).toBeGreaterThanOrEqual(5000);
        });

        test('sync 5000 local objects with delete option successfully', async () => {
            await syncClient.bucketWithLocal(path.join(DATA_DIR, 'def/jkl'), BUCKET);
            await syncClient.sync(DATA_DIR, `s3://${BUCKET}`, { del: true, maxConcurrentTransfers: 200 });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(objects.length).toStrictEqual(5000);
            expect(hasObject(objects, 'xmoj')).toBe(false);
        });

        test('abort sync and throw', async () => {
            const monitor = new TransferMonitor();
            const pSync = syncClient.sync(DATA_DIR, `s3://${BUCKET}/abort`, { monitor });
            setTimeout(() => monitor.abort(), 10000);
            await expect(pSync).rejects.toThrow('Request aborted');
        });

        test('sync a local object using multipart uploads', async () => {
            await syncClient.sync(MULTIPART_DATA_DIR, `s3://${BUCKET}`, {
                maxConcurrentTransfers: 2,
                partSize: 5 * 1024 * 1024,
                relocations: [['', 'multipart']],
            });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(hasObject(objects, 'multipart/multipart.data')).toBe(true);
        });

        // https://github.com/jeanbmar/s3-sync-client/issues/33
        test('multipart abort sync and throw', async () => {
            const monitor = new TransferMonitor();
            const pSync = syncClient.sync(MULTIPART_DATA_DIR, `s3://${BUCKET}/abort-multipart`, {
                maxConcurrentTransfers: 1,
                partSize: 5 * 1024 * 1024,
                monitor,
            });
            setTimeout(() => monitor.abort(), 4000);
            await expect(pSync).rejects.toThrow('Request aborted');
        });
    });

    describe('sync local with bucket', () => {
        beforeAll(() => {
            fs.mkdirSync(path.join(__dirname, 'sync'), { recursive: true });
        });

        test('sync a single dir with a few files successfully', async () => {
            await syncClient.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR);
            const objects = await syncClient.listLocalObjects(SYNC_DIR);
            expect(hasObject(objects, 'def/jkl/xmoj')).toBe(true);
        });

        test('sync a single dir with a few files and delete extra files successfully', async () => {
            // https://github.com/jeanbmar/s3-sync-client/issues/9
            await syncClient.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR, { relocations: [['def/jkl', 'issue9']] });
            fs.writeFileSync(path.join(`${SYNC_DIR}/issue9`, 'to-be-deleted'), 'to-be-deleted', 'utf8');
            await syncClient.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR, { relocations: [['def/jkl', 'issue9']], del: true });
            const objects = await syncClient.listLocalObjects(`${SYNC_DIR}/issue9`);
            expect(objects.length).toStrictEqual(11);
            expect(hasObject(objects, `${SYNC_DIR}/issue9/to-be-deleted`)).toBe(false);
        });

        test('sync a single dir and flatten it', async () => {
            await syncClient.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR, { relocations: [['def/jkl', '']] });
            const objects = await syncClient.listLocalObjects(SYNC_DIR);
            expect(hasObject(objects, 'xmoj')).toBe(true);
        });

        test('sync 5000 bucket objects successfully with progress tracking', async () => {
            const monitor = new TransferMonitor();
            let count = 0;
            monitor.on('progress', (progress) => { count = progress.count.current; });
            await syncClient.sync(`s3://${BUCKET_2}`, SYNC_DIR, { maxConcurrentTransfers: 200, monitor });
            const objects = await syncClient.listLocalObjects(SYNC_DIR);
            expect(count).toStrictEqual(5000);
            expect(objects.length).toBeGreaterThanOrEqual(5000);
        });

        test('sync 5000 bucket objects with delete option successfully', async () => {
            await syncClient.localWithBucket(`${BUCKET_2}/def/jkl`, path.join(SYNC_DIR, 'foo'));
            await syncClient.sync(`s3://${BUCKET_2}`, SYNC_DIR, { del: true, maxConcurrentTransfers: 200 });
            const objects = await syncClient.listLocalObjects(SYNC_DIR);
            expect(objects.length).toStrictEqual(5000);
            expect(hasObject(objects, 'foo/def/jkl/xmoj')).toBe(false);
        });

        test('abort sync and throw', async () => {
            const monitor = new TransferMonitor();
            const pSync = syncClient.localWithBucket(BUCKET_2, path.join(SYNC_DIR, 'abort'), { monitor });
            monitor.on('progress', () => monitor.abort());
            await expect(pSync).rejects.toThrow('Request aborted');
        });
    });

    describe('compute sync operations', () => {
        const bucketObjects = [
            { id: 'abc/created', lastModified: 0, size: 1 },
            { id: 'abc/updated1', lastModified: 1, size: 1 },
            { id: 'abc/updated2', lastModified: 0, size: 2 },
            { id: 'abc/unchanged', lastModified: 0, size: 1 },
        ];
        const localObjects = [
            { id: 'abc/unchanged', lastModified: 0, size: 1 },
            { id: 'abc/updated1', lastModified: 0, size: 1 },
            { id: 'abc/updated2', lastModified: 0, size: 1 },
            { id: 'deleted', lastModified: 0, size: 1 },
        ];

        test('compute sync operations on objects successfully', () => {
            const { created, updated, deleted } = syncDiff(bucketObjects, localObjects);
            expect(created).toStrictEqual([
                { id: 'abc/created', size: 1, lastModified: 0 },
            ]);
            expect(updated).toStrictEqual([
                { id: 'abc/updated1', size: 1, lastModified: 1 },
                { id: 'abc/updated2', size: 2, lastModified: 0 },
            ]);
            expect(deleted).toStrictEqual([
                { id: 'deleted', size: 1, lastModified: 0 },
            ]);
        });

        test('compute sync sizeOnly operations on objects successfully', () => {
            const sizeOnly = true;
            const { created, updated, deleted } = syncDiff(bucketObjects, localObjects, sizeOnly);
            expect(created).toStrictEqual([
                { id: 'abc/created', size: 1, lastModified: 0 },
            ]);
            expect(updated).toStrictEqual([
                { id: 'abc/updated2', size: 2, lastModified: 0 },
            ]);
            expect(deleted).toStrictEqual([
                { id: 'deleted', size: 1, lastModified: 0 },
            ]);
        });
    });

    describe('filter source objects', () => {
        test('apply include and exclude filters to source objects', () => {
            const syncObjects = [
                'flowers/rose.jpg',
                'flowers/sunflower.jpg',
                'flowers/tulip.png',
                'flowers/unknown/1.jpg',
                'animals/cat.jpg',
            ].map((id) => new SyncObject({ id }));
            syncObjects.forEach((syncObject) => {
                syncObject.applyFilters([
                    { exclude: () => true },
                    { include: (key) => key.endsWith('.jpg') },
                    { exclude: (key) => key.startsWith('animals') },
                    { exclude: (key) => key.indexOf('/unknown/') > -1 },
                ]);
            });
            const included = syncObjects.filter((syncObject) => syncObject.isIncluded());
            const keys = included.map((syncObject) => syncObject.id);
            expect(keys).toStrictEqual(['flowers/rose.jpg', 'flowers/sunflower.jpg']);
        });
        test('sync bucket with filtered source bucket objects', async () => {
            await syncClient.bucketWithBucket(BUCKET_2, BUCKET, {
                filters: [
                    { exclude: () => true },
                    { include: (key) => key.startsWith('def/jkl') },
                ],
                del: true,
            });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(objects.length).toStrictEqual(11);
        });
        test('sync bucket with filtered source local objects', async () => {
            await emptyBucket(syncClient, BUCKET);
            await syncClient.bucketWithLocal(DATA_DIR, BUCKET, {
                filters: [
                    { exclude: () => true },
                    { include: (key) => key.startsWith('def/jkl') },
                ],
            });
            const objects = await syncClient.listBucketObjects(BUCKET);
            expect(objects.length).toStrictEqual(11);
        });
        test('sync local fs with filtered source bucket objects', async () => {
            fs.rmSync(path.join(SYNC_DIR, 'def/jkl'), { force: true, recursive: true });
            await syncClient.localWithBucket(BUCKET, SYNC_DIR, {
                filters: [
                    { exclude: () => true },
                    { include: (key) => key.startsWith('def/j') },
                ],
            });
            const objects = await syncClient.listLocalObjects(path.join(SYNC_DIR, 'def/jkl'));
            expect(objects.length).toStrictEqual(11);
        });
    });
});
