[s3-sync-client](../README.md) / [Exports](../modules.md) / CopyBucketObjectCommand

# Class: CopyBucketObjectCommand

## Table of contents

### Constructors

- [constructor](CopyBucketObjectCommand.md#constructor)

### Properties

- [abortSignal](CopyBucketObjectCommand.md#abortsignal)
- [bucketObject](CopyBucketObjectCommand.md#bucketobject)
- [commandInput](CopyBucketObjectCommand.md#commandinput)
- [monitor](CopyBucketObjectCommand.md#monitor)
- [targetBucket](CopyBucketObjectCommand.md#targetbucket)

### Methods

- [execute](CopyBucketObjectCommand.md#execute)

## Constructors

### constructor

• **new CopyBucketObjectCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CopyBucketObjectCommandInput`](../modules.md#copybucketobjectcommandinput) |

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:26](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L26)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L22)

___

### bucketObject

• **bucketObject**: [`BucketObject`](BucketObject.md)

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:20](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L20)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`CopyObjectCommandInput`\>

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L23)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L24)

___

### targetBucket

• **targetBucket**: `string`

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L21)

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

[src/commands/CopyBucketObjectCommand.ts:34](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/CopyBucketObjectCommand.ts#L34)
