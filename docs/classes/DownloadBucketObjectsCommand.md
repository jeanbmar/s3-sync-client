[s3-sync-client](../README.md) / [Exports](../modules.md) / DownloadBucketObjectsCommand

# Class: DownloadBucketObjectsCommand

## Table of contents

### Constructors

- [constructor](DownloadBucketObjectsCommand.md#constructor)

### Properties

- [abortSignal](DownloadBucketObjectsCommand.md#abortsignal)
- [bucketObjects](DownloadBucketObjectsCommand.md#bucketobjects)
- [commandInput](DownloadBucketObjectsCommand.md#commandinput)
- [localDir](DownloadBucketObjectsCommand.md#localdir)
- [maxConcurrentTransfers](DownloadBucketObjectsCommand.md#maxconcurrenttransfers)
- [monitor](DownloadBucketObjectsCommand.md#monitor)

### Methods

- [execute](DownloadBucketObjectsCommand.md#execute)

## Constructors

### constructor

• **new DownloadBucketObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`DownloadBucketObjectsCommandInput`](../modules.md#downloadbucketobjectscommandinput) |

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:29](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L29)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:25](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L25)

___

### bucketObjects

• **bucketObjects**: [`BucketObject`](BucketObject.md)[]

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L23)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`GetObjectCommandInput`\>

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:26](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L26)

___

### localDir

• **localDir**: `string`

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L24)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:28](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L28)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L27)

## Methods

### execute

▸ **execute**(`client`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/DownloadBucketObjectsCommand.ts#L39)
