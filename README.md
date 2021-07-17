# AWS CLI s3 sync for Node.js

**AWS CLI ``s3 sync`` for Node.js** provides a modern client to perform S3 sync operations between file systems and S3 buckets in the spirit of the official [AWS CLI command](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html).    
AWS CLI installation is **NOT** required by this module.

## Features

- Sync a local file system with a remote Amazon S3 bucket
- Sync a remote Amazon S3 bucket with a local file system
- Sync two remote Amazon S3 buckets
- Sync only new and updated objects
- Support AWS CLI options ``--delete``, ``--dryrun``
- Support AWS SDK command input options
- Track object sync progress
- Sync **any** number of objects (no 1000 objects limit)
- Transfer objects concurrently
- Manage differences in folder structures easily through relocation

## Why should I use this module?

1. There is no way to achieve S3 sync using the AWS SDK for JavaScript v3 alone.
1. AWS CLI installation is **NOT** required.
1. The package contains no external dependency besides AWS SDK.
1. The AWS SDK dependency is up-to-date ([AWS SDK for JavaScript v3](https://github.com/aws/aws-sdk-js-v3)).
1. The module overcomes a set of common limitations listed at the bottom of this README.

# Table of Contents

1. [Getting Started](#getting-started)
    1. [Install](#install)
    1. [Code Examples](#code-examples)
1. [API Reference](#api-reference)
    - [Class: S3SyncClient](#class-s3-sync-client)
      - [new S3SyncClient(configuration)](#new-s3-sync-client)
      - [sync.bucketWithLocal(localDir, bucketPrefix[, options])](#sync-bucket-with-local)
      - [sync.localWithBucket(bucketPrefix, localDir[, options])](#sync-local-with-bucket)
      - [sync.bucketWithBucket(sourceBucketPrefix, targetBucketPrefix[, options])](#sync-bucket-with-bucket)
1. [Change Log](#change-log)
1. [Comparison with other modules](#comparison-with-other-modules)

## Getting Started

### Install

``npm install s3-sync-client``

### Code Examples

#### Init client

``S3SyncClient`` extends the AWS SDK ``S3Client`` class and should be instantiated the same way.

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({
    region: 'eu-west-3',
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});
```

#### Sync a remote S3 bucket with the local file system

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// aws s3 sync /path/to/local/dir s3://mybucket2
await sync.bucketWithLocal('/path/to/local/dir', 'mybucket2');

// aws s3 sync /path/to/local/dir s3://mybucket2/zzz --delete
await sync.bucketWithLocal('/path/to/local/dir', 'mybucket2/zzz', { del: true });
```

#### Sync the local file system with a remote S3 bucket

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// aws s3 sync s3://mybucket /path/to/some/local --delete
await sync.localWithBucket('mybucket', '/path/to/some/local', { del: true });

// aws s3 sync s3://mybucket2 /path/to/local/dir --dryrun
const syncOps = await sync.localWithBucket('mybucket2', '/path/to/local/dir', { dryRun: true });
console.log(syncOps); // log download and delete operations to perform
```

#### Sync two remote S3 buckets

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// aws s3 sync s3://my-source-bucket s3://my-target-bucket --delete
await sync.bucketWithBucket('my-source-bucket', 'my-target-bucket', { del: true });
```

#### Track transfer progress

```javascript
const EventEmitter = require('events');
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

const monitor = new EventEmitter();
monitor.on('progress', (progress) => console.log(progress));
setTimeout(() => monitor.emit('abort'), 30000); // optional abort
await sync.localWithBucket('mybucket', '/path/to/local/dir', { monitor });

/* output:
...
{
  size: { current: 11925, total: 35688 },
  count: { current: 3974, total: 10000 }
}
...
and abort unfinished sync after 30s (promise rejected with an AbortError) 
*/
```

#### Use AWS SDK command input options

```javascript
const mime = require('mime-types');
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

/*
commandInput properties can either be:
  - fixed values
  - functions, in order to set dynamic values (e.g. using the object key)
*/

// set ACL, fixed value
await sync.localWithBucket('mybucket', '/path/to/local/dir', {
    commandInput: {
        ACL: 'aws-exec-read',
    },
});

// set content type, dynamic value (function)
await sync.bucketWithBucket('mybucket1', 'mybucket2', {
    commandInput: {
        ContentType: (syncCommandInput) => (
            mime.lookup(syncCommandInput.Key) || 'text/html'
        ),
    },
});
```

#### Relocate objects during sync

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// sync s3://my-source-bucket/a/b/c.txt to s3://my-target-bucket/zzz/c.txt
await sync.bucketWithBucket('my-source-bucket/a/b/c.txt', 'my-target-bucket', {
    relocations: [ // multiple relocations can be applied
        ['a/b', 'zzz'],
    ],
});

// sync s3://mybucket/flowers/red/rose.png to /path/to/local/dir/rose.png
await sync.localWithBucket('mybucket/flowers/red/rose.png', '/path/to/local/dir', {
    relocations: [
        ['flowers/red', ''], // folder flowers/red will be flattened during sync
    ],
});
```

Additional code examples are available in the test folder.

## API Reference
<a name="class-s3-sync-client"></a>
### Class: S3SyncClient
<a name="new-s3-sync-client"></a>
#### ``new S3SyncClient(configuration)``

- `configuration` *<Object\>* Configuration as in the [AWS SDK S3Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html).

<a name="sync-bucket-with-local"></a>
#### ``sync.bucketWithLocal(localDir, bucketPrefix[, options])``

- `localDir` *<string\>* Local directory
- `bucketPrefix` *<string\>* Remote bucket name which may contain a prefix appended with a `/` separator 
- `options` *<Object\>*
  - `commandInput` [*<PutObjectCommandInput\>*](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/putobjectcommandinput.html) Set any of the SDK PutObjectCommand options to uploads
  - `del` *<boolean\>* Equivalent to CLI ``--delete`` option
  - `dryRun` *<boolean\>* Equivalent to CLI ``--dryrun`` option
  - `monitor` *<EventEmitter\>*
    - Attach `progress` event to receive upload progress notifications
    - Emit `abort` event to stop object uploads immediately
  - `maxConcurrentTransfers` *<number\>* Each upload generates a Promise which is resolved when a local object is written to the S3 bucket. This parameter sets the maximum number of upload promises that might be running concurrently.
  - `relocations` *<Array\>* Allows uploading objects to remote folders without mirroring the source directory structure. Each relocation should be specified as an *<Array\>* of `[sourcePrefix, targetPrefix]`.
- Returns: *<Promise\>* Fulfills with an *<Object\>* of sync operations upon success.

Sync a remote S3 bucket with the local file system.  
Similar to AWS CLI ``aws s3 sync localDir s3://bucketPrefix [options]``.

<a name="sync-local-with-bucket"></a>
#### ``sync.localWithBucket(bucketPrefix, localDir[, options])``

- `bucketPrefix` *<string\>* Remote bucket name which may contain a prefix appended with a ``/`` separator
- `localDir` *<string\>* Local directory
- `options` *<Object\>*
  - `commandInput` [*<GetObjectCommandInput\>*](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/getobjectcommandinput.html) Set any of the SDK GetObjectCommand options to downloads
  - `del` *<boolean\>* Equivalent to CLI ``--delete`` option
  - `dryRun` *<boolean\>* Equivalent to CLI ``--dryrun`` option
  - `monitor` *<EventEmitter\>*
    - Attach `progress` event to receive download progress notifications
    - Emit `abort` event to stop object downloads immediately
  - `maxConcurrentTransfers` *<number\>* Each download generates a Promise which is resolved when a remote object is written to the local file system. This parameter sets the maximum number of download promises that might be running concurrently.
  - `relocations` *<Array\>* Allows downloading objects to local directories without mirroring the source folder structure. Each relocation should be specified as an *<Array\>* of `[sourcePrefix, targetPrefix]`.
- Returns: *<Promise\>* Fulfills with an *<Object\>* of sync operations upon success.

Sync the local file system with a remote S3 bucket.  
Similar to AWS CLI ``aws s3 sync s3://bucketPrefix localDir [options]``.

<a name="sync-bucket-with-bucket"></a>
#### ``sync.bucketWithBucket(sourceBucketPrefix, targetBucketPrefix[, options])``

- `sourceBucketPrefix` *<string\>* Remote reference bucket name which may contain a prefix appended with a ``/`` separator
- `targetBucketPrefix` *<string\>* Remote bucket name to sync which may contain a prefix appended with a ``/`` separator
- `options` *<Object\>*
  - `commandInput` [*<CopyObjectCommandInput\>*](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/interfaces/copyobjectcommandinput.html) Set any of the SDK CopyObjectCommand options to copy operations
  - `del` *<boolean\>* Equivalent to CLI ``--delete`` option
  - `dryRun` *<boolean\>* Equivalent to CLI ``--dryrun`` option
  - `monitor` *<EventEmitter\>*
    - Attach `progress` event to receive copy progress notifications
    - Emit `abort` event to stop object copy operations immediately
  - `maxConcurrentTransfers` *<number\>* Each copy generates a Promise which is resolved after the object has been copied. This parameter sets the maximum number of copy promises that might be running concurrently.
  - `relocations` *<Array\>* Allows copying objects to remote folders without mirroring the source folder structure. Each relocation should be specified as an *<Array\>* of `[sourcePrefix, targetPrefix]`.
- Returns: *<Promise\>* Fulfills with an *<Object\>* of sync operations upon success.

Sync two remote S3 buckets.  
Similar to AWS CLI ``aws s3 sync s3://sourceBucketPrefix s3://targetBucketPrefix [options]``.

# Change Log

See [CHANGELOG.md](CHANGELOG.md).

# Comparison with other modules

**AWS CLI ``s3 sync`` for Node.js** has been developed to solve the S3 syncing limitations of the existing GitHub repo and NPM modules.

Most of the existing repo and NPM modules encounter one or more of the following limitations:

- requires AWS CLI to be installed
- uses Etag to perform file comparison (Etag should be considered an opaque field, and should not be used)
- limits S3 bucket object listing to 1000 objects
- supports syncing bucket with local, but doesn't support syncing local with bucket
- uses outdated dependencies
- is unmaintained

The following JavaScript modules suffer at least one of the limitations:

- https://github.com/guerrerocarlos/aws-cli-s3-sync
- https://github.com/thousandxyz/s3-lambo
- https://github.com/Quobject/aws-cli-js
- https://github.com/auth0/node-s3-client
- https://github.com/andrewrk/node-s3-client
- https://github.com/hughsk/s3-sync
- https://github.com/issacg/s3sync

**AWS CLI ``s3 sync`` for Node.js** has some limitations too:

- does not support multipart transfers
