[s3-sync-client](../README.md) / [Exports](../modules.md) / SyncBucketWithLocalCommand

# Class: SyncBucketWithLocalCommand

## Table of contents

### Constructors

- [constructor](SyncBucketWithLocalCommand.md#constructor)

### Properties

- [abortSignal](SyncBucketWithLocalCommand.md#abortsignal)
- [bucketPrefix](SyncBucketWithLocalCommand.md#bucketprefix)
- [commandInput](SyncBucketWithLocalCommand.md#commandinput)
- [del](SyncBucketWithLocalCommand.md#del)
- [dryRun](SyncBucketWithLocalCommand.md#dryrun)
- [filters](SyncBucketWithLocalCommand.md#filters)
- [localDir](SyncBucketWithLocalCommand.md#localdir)
- [maxConcurrentTransfers](SyncBucketWithLocalCommand.md#maxconcurrenttransfers)
- [monitor](SyncBucketWithLocalCommand.md#monitor)
- [partSize](SyncBucketWithLocalCommand.md#partsize)
- [relocations](SyncBucketWithLocalCommand.md#relocations)
- [sizeOnly](SyncBucketWithLocalCommand.md#sizeonly)

### Methods

- [execute](SyncBucketWithLocalCommand.md#execute)

## Constructors

### constructor

• **new SyncBucketWithLocalCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SyncBucketWithLocalCommandInput`](../modules.md#syncbucketwithlocalcommandinput) |

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:61](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L61)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:53](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L53)

___

### bucketPrefix

• **bucketPrefix**: `string`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:47](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L47)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`PutObjectCommandInput`\> \| [`CommandInput`](../modules.md#commandinput)<`CreateMultipartUploadCommandInput`\>

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:54](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L54)

___

### del

• **del**: `boolean`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:49](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L49)

___

### dryRun

• **dryRun**: `boolean`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:48](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L48)

___

### filters

• **filters**: [`Filter`](../modules.md#filter)[]

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:52](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L52)

___

### localDir

• **localDir**: `string`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:46](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L46)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:58](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L58)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:57](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L57)

___

### partSize

• **partSize**: `number`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:59](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L59)

___

### relocations

• **relocations**: [`Relocation`](../modules.md#relocation)[]

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:51](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L51)

___

### sizeOnly

• **sizeOnly**: `boolean`

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:50](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L50)

## Methods

### execute

▸ **execute**(`client`): `Promise`<[`SyncBucketWithLocalCommandOutput`](../modules.md#syncbucketwithlocalcommandoutput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<[`SyncBucketWithLocalCommandOutput`](../modules.md#syncbucketwithlocalcommandoutput)\>

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:77](https://github.com/jeanbmar/s3-sync-client/blob/7c529f6/src/commands/SyncBucketWithLocalCommand.ts#L77)
