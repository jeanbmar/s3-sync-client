[s3-sync-client](../README.md) / [Exports](../modules.md) / SyncBucketWithBucketCommand

# Class: SyncBucketWithBucketCommand

## Table of contents

### Constructors

- [constructor](SyncBucketWithBucketCommand.md#constructor)

### Properties

- [abortSignal](SyncBucketWithBucketCommand.md#abortsignal)
- [commandInput](SyncBucketWithBucketCommand.md#commandinput)
- [del](SyncBucketWithBucketCommand.md#del)
- [deleteExcluded](SyncBucketWithBucketCommand.md#deleteexcluded)
- [dryRun](SyncBucketWithBucketCommand.md#dryrun)
- [filters](SyncBucketWithBucketCommand.md#filters)
- [maxConcurrentTransfers](SyncBucketWithBucketCommand.md#maxconcurrenttransfers)
- [monitor](SyncBucketWithBucketCommand.md#monitor)
- [relocations](SyncBucketWithBucketCommand.md#relocations)
- [sizeOnly](SyncBucketWithBucketCommand.md#sizeonly)
- [sourceBucketPrefix](SyncBucketWithBucketCommand.md#sourcebucketprefix)
- [targetBucketPrefix](SyncBucketWithBucketCommand.md#targetbucketprefix)

### Methods

- [execute](SyncBucketWithBucketCommand.md#execute)

## Constructors

### constructor

• **new SyncBucketWithBucketCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SyncBucketWithBucketCommandInput`](../modules.md#syncbucketwithbucketcommandinput) |

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:48](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L48)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:43](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L43)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`CopyObjectCommandInput`\>

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:44](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L44)

___

### del

• **del**: `boolean`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:38](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L38)

___

### deleteExcluded

• **deleteExcluded**: `boolean`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L39)

___

### dryRun

• **dryRun**: `boolean`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:37](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L37)

___

### filters

• **filters**: [`Filter`](../modules.md#filter)[]

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:42](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L42)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:46](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L46)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:45](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L45)

___

### relocations

• **relocations**: [`Relocation`](../modules.md#relocation)[]

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:41](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L41)

___

### sizeOnly

• **sizeOnly**: `boolean`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:40](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L40)

___

### sourceBucketPrefix

• **sourceBucketPrefix**: `string`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:35](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L35)

___

### targetBucketPrefix

• **targetBucketPrefix**: `string`

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:36](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L36)

## Methods

### execute

▸ **execute**(`client`): `Promise`<[`SyncBucketWithBucketCommandOutput`](../modules.md#syncbucketwithbucketcommandoutput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<[`SyncBucketWithBucketCommandOutput`](../modules.md#syncbucketwithbucketcommandoutput)\>

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:64](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/commands/SyncBucketWithBucketCommand.ts#L64)
