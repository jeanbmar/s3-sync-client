[s3-sync-client](../README.md) / [Exports](../modules.md) / DownloadBucketObjectCommand

# Class: DownloadBucketObjectCommand

## Table of contents

### Constructors

- [constructor](DownloadBucketObjectCommand.md#constructor)

### Properties

- [abortSignal](DownloadBucketObjectCommand.md#abortsignal)
- [bucketObject](DownloadBucketObjectCommand.md#bucketobject)
- [commandInput](DownloadBucketObjectCommand.md#commandinput)
- [localDir](DownloadBucketObjectCommand.md#localdir)
- [monitor](DownloadBucketObjectCommand.md#monitor)

### Methods

- [execute](DownloadBucketObjectCommand.md#execute)

## Constructors

### constructor

• **new DownloadBucketObjectCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`DownloadBucketObjectCommandInput`](../modules.md#downloadbucketobjectcommandinput) |

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:32](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L32)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:28](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L28)

___

### bucketObject

• **bucketObject**: [`BucketObject`](BucketObject.md)

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:26](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L26)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`GetObjectCommandInput`\>

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:29](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L29)

___

### localDir

• **localDir**: `string`

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L27)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:30](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L30)

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

[src/commands/DownloadBucketObjectCommand.ts:40](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/DownloadBucketObjectCommand.ts#L40)
