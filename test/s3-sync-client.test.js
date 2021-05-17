/* eslint-disable func-names */
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const tar = require('tar');
const { describe, it } = require('mocha');
const S3SyncClient = require('..');

const BUCKET = 's3-sync-client';
const BUCKET_2 = 's3-sync-client-2';
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DATA_DIR = path.join(__dirname, 'data');
const SYNC_DIR = path.join(__dirname, 'sync');

describe('S3SyncClient', () => {
    let s3;

    before(() => {
        s3 = new S3SyncClient({
            region: 'eu-west-3',
            credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY },
        });
    });

    it('load initial data folder', async function () {
        this.timeout(20000);
        fs.rmSync(DATA_DIR, { force: true, recursive: true });
        fs.mkdirSync(DATA_DIR, { recursive: true });
        await tar.x({
            file: path.join(__dirname, 'sample-files.tar.gz'),
            cwd: DATA_DIR,
        });
    });

    it('load bucket 2 dataset', async function () {
        this.timeout(180000);
        await s3.emptyBucket(BUCKET_2);
        await s3.bucketWithLocal(DATA_DIR, BUCKET_2, { del: true, maxConcurrentTransfers: 1000 });
        const objects = await s3.listLocalObjects(DATA_DIR);
        assert(objects.size === 10000);
    });

    it('empty bucket', async function () {
        this.timeout(20000);
        await s3.emptyBucket(BUCKET);
        const bucketObjects = await s3.listBucketObjects(BUCKET);
        assert(bucketObjects.size === 0);
    });

    describe('list local objects', () => {
        it('listed objects are properly formed', async () => {
            const objects = await s3.listLocalObjects(path.join(DATA_DIR, 'def/jkl'));
            assert.deepStrictEqual(objects.get('xmoj'), {
                id: 'xmoj',
                lastModified: 1618993846000,
                size: 3,
                path: path.join(DATA_DIR, 'def/jkl/xmoj'),
            });
        });

        it('listed objects with prefix are properly formed', async () => {
            const objects = await s3.listLocalObjects(path.join(DATA_DIR, 'def/jkl'), { prefix: 'azerty' });
            assert.deepStrictEqual(objects.get('azerty/xmoj'), {
                id: 'azerty/xmoj',
                lastModified: 1618993846000,
                size: 3,
                path: path.join(DATA_DIR, 'def/jkl/xmoj'),
            });
        });

        it('list local objects with non-directory args throws', async () => {
            await assert.rejects(async () => s3.listLocalObjects(path.join(DATA_DIR, 'xoin')));
        });
    });

    describe('sync bucket with local', function () {
        this.timeout(120000);

        it('sync a single dir with a few files successfully', async () => {
            await s3.bucketWithLocal(path.join(DATA_DIR, 'def/jkl'), BUCKET);
            const objects = await s3.listBucketObjects(BUCKET);
            assert(objects.has('xmoj'));
        });

        it('sync a single dir with a bucket prefix successfully', async () => {
            await s3.bucketWithLocal(path.join(DATA_DIR, 'def/jkl'), path.posix.join(BUCKET, 'zzz'));
            const objects = await s3.listBucketObjects(BUCKET, { prefix: 'zzz' });
            assert(objects.has('zzz/xmoj'));
        });

        it('sync 10000 local objects successfully', async () => {
            await s3.bucketWithLocal(DATA_DIR, BUCKET, { maxConcurrentTransfers: 1000 });
            const objects = await s3.listLocalObjects(DATA_DIR);
            assert(objects.size >= 10000);
        });

        it('sync 10000 local objects with delete option successfully', async () => {
            await s3.bucketWithLocal(path.join(DATA_DIR, 'def/jkl'), BUCKET);
            await s3.bucketWithLocal(DATA_DIR, BUCKET, { del: true, maxConcurrentTransfers: 1000 });
            const objects = await s3.listLocalObjects(DATA_DIR);
            assert(objects.size === 10000);
            assert(!objects.has('xmoj'));
        });
    });

    describe('sync local with bucket', function () {
        this.timeout(120000);

        before(() => {
            fs.mkdirSync(path.join(__dirname, 'sync'), { recursive: true });
        });

        it('sync a single dir with a few files successfully', async () => {
            await s3.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR);
            const objects = await s3.listLocalObjects(SYNC_DIR);
            assert(objects.has('def/jkl/xmoj'));
        });

        it('sync a single dir and flatten it', async () => {
            await s3.localWithBucket(`${BUCKET_2}/def/jkl`, SYNC_DIR, { flatten: true });
            const objects = await s3.listLocalObjects(SYNC_DIR);
            assert(objects.has('xmoj'));
        });

        it('sync 10000 bucket objects successfully', async () => {
            await s3.localWithBucket(BUCKET_2, SYNC_DIR, { maxConcurrentTransfers: 1000 });
            const objects = await s3.listLocalObjects(SYNC_DIR);
            assert(objects.size >= 10000);
        });

        it('sync 10000 bucket objects with delete option successfully', async () => {
            await s3.localWithBucket(`${BUCKET_2}/def/jkl`, path.join(SYNC_DIR, 'foo'));
            await s3.localWithBucket(BUCKET_2, SYNC_DIR, { del: true, maxConcurrentTransfers: 1000 });
            const objects = await s3.listLocalObjects(SYNC_DIR);
            assert(objects.size === 10000);
            assert(!objects.has('foo/def/jkl/xmoj'));
        });
    });

    describe('compute sync operations', () => {
        const sourceObjects = new Map([
            ['abc/created', { id: 'abc/created', lastModified: 1619002208000, size: 1 }],
            ['abc/updated1', { id: 'abc/updated1', lastModified: 1619002208001, size: 1 }],
            ['abc/updated2', { id: 'abc/updated2', lastModified: 1619002208000, size: 2 }],
            ['abc/unchanged', { id: 'abc/unchanged', lastModified: 1619002208000, size: 1 }],
        ]);
        const targetObjects = new Map([
            ['abc/unchanged', { id: 'abc/unchanged', lastModified: 1619002208000, size: 1 }],
            ['abc/updated1', { id: 'abc/updated1', lastModified: 1619002208000, size: 1 }],
            ['abc/updated2', { id: 'abc/updated2', lastModified: 1619002208000, size: 1 }],
            ['deleted', { id: 'deleted', lastModified: 1619002208000, size: 1 }],
        ]);

        it('compute objects to transfer successfully', () => {
            const objectsToTransfer = S3SyncClient.util.getObjectsToTransfer(sourceObjects, targetObjects);
            assert.deepStrictEqual(objectsToTransfer, [
                { id: 'abc/created', lastModified: 1619002208000, size: 1 },
                { id: 'abc/updated1', lastModified: 1619002208001, size: 1 },
                { id: 'abc/updated2', lastModified: 1619002208000, size: 2 },
            ]);
        });

        it('compute objects to delete successfully', () => {
            const objectsToDelete = S3SyncClient.util.getObjectsToDelete(sourceObjects, targetObjects);
            assert.deepStrictEqual(objectsToDelete.map(({ id }) => id), ['deleted']);
        });
    });
});
