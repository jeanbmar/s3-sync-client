# Change Log

All notable changes to this project will be documented in this file.

## [1.4.0]

### Features

* support progress tracking and aborting transfers with ``monitor`` option

## [1.3.0]

### Features

* support synchronizing two remote buckets
* add ``relocations`` option to manage different folder structures in source and target in a simple and flexible way 
* deprecate ``flatten`` option in favor of ``relocations``

## [1.2.0]

### Features

* add ``flatten`` option

## [1.1.0]

### Features

* reduce default concurrency on file transfers

## [1.0.0]

### Features

* support synchronizing a local file system with a remote bucket
* support synchronizing a remote bucket with a local file system
* synchronize new and updated files only (using object size and last modified time)
* support aws cli s3 sync --delete option
* support aws cli s3 sync --dryrun option
* support concurrent file transfers
* support synchronizing any number of files (no 1000 files limit)
