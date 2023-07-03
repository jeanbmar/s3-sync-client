[s3-sync-client](../README.md) / [Exports](../modules.md) / CopyBucketObjectsCommand

# Class: CopyBucketObjectsCommand

## Table of contents

### Constructors

- [constructor](CopyBucketObjectsCommand.md#constructor)

### Properties

- [abortSignal](CopyBucketObjectsCommand.md#abortsignal)
- [bucketObjects](CopyBucketObjectsCommand.md#bucketobjects)
- [commandInput](CopyBucketObjectsCommand.md#commandinput)
- [maxConcurrentTransfers](CopyBucketObjectsCommand.md#maxconcurrenttransfers)
- [monitor](CopyBucketObjectsCommand.md#monitor)
- [targetBucket](CopyBucketObjectsCommand.md#targetbucket)

### Methods

- [execute](CopyBucketObjectsCommand.md#execute)

## Constructors

### constructor

• **new CopyBucketObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CopyBucketObjectsCommandInput`](../modules.md#copybucketobjectscommandinput) |

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:30](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L30)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:25](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L25)

___

### bucketObjects

• **bucketObjects**: [`BucketObject`](BucketObject.md)[]

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L23)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`CopyObjectCommandInput`\>

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:26](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L26)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:28](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L28)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L27)

___

### targetBucket

• **targetBucket**: `string`

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L24)

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

[src/commands/CopyBucketObjectsCommand.ts:40](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CopyBucketObjectsCommand.ts#L40)
