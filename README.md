# AWS CLI s3 sync for Node.js

**AWS CLI ``s3 sync`` for Node.js** provides a modern client to perform S3 sync operations between a file system and a S3 bucket in the spirit of:  
https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html

## Why should I use this module?

1. There is no way to achieve S3 sync using the AWS SDK for JavaScript v3 alone.
1. AWS CLI installation is **NOT** required.
1. The package contains no external dependency besides AWS SDK.
1. The AWS SDK dependency is up-to-date (**AWS SDK for JavaScript v3**, https://github.com/aws/aws-sdk-js-v3).
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
1. [Comparison with other modules](#comparison-with-other-modules)

## Getting Started

### Install

``npm install s3-sync-client``

### Code Examples

``S3SyncClient`` extends AWS SDK ``S3Client`` and should be instantiated the same way:

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

Sync a remote S3 bucket with the local file system:

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// aws s3 sync /path/to/local/dir s3://mybucket2
await sync.bucketWithLocal('/path/to/local/dir', 'mybucket2');

// aws s3 sync /path/to/local/dir s3://mybucket2/zzz --delete
await sync.bucketWithLocal('/path/to/local/dir', 'mybucket2/zzz', { del: true });
```

Sync the local file system with a remote S3 bucket:

```javascript
const S3SyncClient = require('s3-sync-client');

const sync = new S3SyncClient({ /* credentials */ });

// aws s3 sync s3://mybucket /path/to/some/local --delete
await sync.localWithBucket('mybucket', '/path/to/some/local', { del: true });

// aws s3 sync s3://mybucket2 /path/to/local/dir --dryrun
const syncOps = await sync.localWithBucket('mybucket2', '/path/to/local/dir', { dryRun: true });
console.log(syncOps); // log download and delete operations to perform
```

Additional code examples are available in the test folder.

## API Reference
<a name="class-s3-sync-client"></a>
### Class: S3SyncClient
<a name="new-s3-sync-client"></a>
#### new S3SyncClient(configuration)

- configuration (Object) - Configuration as in AWS SDK S3Client. See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html.

<a name="sync-bucket-with-local"></a>
#### sync.bucketWithLocal(localDir, bucketPrefix[, options])

- localDir (string) Local directory
- bucketPrefix (string) Remote bucket name which may contain a prefix appended with a ``/`` separator 
- options (Object)
  - del (boolean) Equivalent to CLI ``--delete`` option
  - dryRun (boolean) Equivalent to CLI ``--dryrun`` option
  - maxConcurrentTransfers (number) Each upload generates a Promise which is resolved when a local object is written to the S3 bucket. This parameter sets the maximum number of upload promises that might be running concurrently.
- Returns: Promise resolving an object of sync operations 

Sync a remote S3 bucket with the local file system.  
Similar to AWS CLI ``aws s3 sync localDir s3://bucketPrefix [options]``.

<a name="sync-local-with-bucket"></a>
#### sync.localWithBucket(bucketPrefix, localDir[, options])

- bucketPrefix (string) Remote bucket name which may contain a prefix appended with a ``/`` separator
- localDir (string) Local directory
- options (Object)
    - del (boolean) Equivalent to CLI ``--delete`` option
    - dryRun (boolean) Equivalent to CLI ``--dryrun`` option
    - maxConcurrentTransfers (number) Each download generates a Promise which is resolved when a remote object is written to the local file system. This parameter sets the maximum number of download promises that might be running concurrently.
- Returns: Promise resolving an object of sync operations

Sync the local file system with a remote S3 bucket.  
Similar to AWS CLI ``aws s3 sync s3://bucketPrefix localDir [options]``.

# Comparison with other modules

**AWS CLI ``s3 sync`` for Node.js** has been developed to solve the S3 syncing limitations of the existing GitHub repo and NPM modules.

Most of the existing repo and NPM modules encounter one or more of the following limitations:

- Require AWS CLI to be installed
- Use Etag to perform file comparison (Etag should be considered an opaque field, and should not be used)
- Limit S3 bucket object listing to 1000 objects
- Support syncing bucket with local, but doesn't support syncing local with bucket
- Use outdated dependencies
- Is unmaintained

The following JavaScript modules suffer at least one of the limitations:

- https://github.com/guerrerocarlos/aws-cli-s3-sync
- https://github.com/thousandxyz/s3-lambo
- https://github.com/Quobject/aws-cli-js
- https://github.com/auth0/node-s3-client
- https://github.com/andrewrk/node-s3-client
- https://github.com/hughsk/s3-sync
- https://github.com/issacg/s3sync

**AWS CLI ``s3 sync`` for Node.js** has its share of limitations as well:

- Does not support bucket with bucket sync (yet)
- Does not support multipart transfers
- Support a limited set of AWS CLI options (--delete and --dryrun)
