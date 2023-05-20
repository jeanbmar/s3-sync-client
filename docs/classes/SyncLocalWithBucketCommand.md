[s3-sync-client](../README.md) / [Exports](../modules.md) / SyncLocalWithBucketCommand

# Class: SyncLocalWithBucketCommand

## Table of contents

### Constructors

- [constructor](SyncLocalWithBucketCommand.md#constructor)

### Properties

- [abortSignal](SyncLocalWithBucketCommand.md#abortsignal)
- [bucketPrefix](SyncLocalWithBucketCommand.md#bucketprefix)
- [commandInput](SyncLocalWithBucketCommand.md#commandinput)
- [del](SyncLocalWithBucketCommand.md#del)
- [dryRun](SyncLocalWithBucketCommand.md#dryrun)
- [filters](SyncLocalWithBucketCommand.md#filters)
- [localDir](SyncLocalWithBucketCommand.md#localdir)
- [maxConcurrentTransfers](SyncLocalWithBucketCommand.md#maxconcurrenttransfers)
- [monitor](SyncLocalWithBucketCommand.md#monitor)
- [relocations](SyncLocalWithBucketCommand.md#relocations)
- [sizeOnly](SyncLocalWithBucketCommand.md#sizeonly)

### Methods

- [execute](SyncLocalWithBucketCommand.md#execute)

## Constructors

### constructor

• **new SyncLocalWithBucketCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`SyncLocalWithBucketCommandInput`](../modules.md#synclocalwithbucketcommandinput) |

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:48](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L48)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:43](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L43)

___

### bucketPrefix

• **bucketPrefix**: `string`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:36](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L36)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`GetObjectCommandInput`\>

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:44](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L44)

___

### del

• **del**: `boolean`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L39)

___

### dryRun

• **dryRun**: `boolean`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:38](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L38)

___

### filters

• **filters**: [`Filter`](../modules.md#filter)[]

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:42](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L42)

___

### localDir

• **localDir**: `string`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:37](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L37)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:46](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L46)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:45](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L45)

___

### relocations

• **relocations**: [`Relocation`](../modules.md#relocation)[]

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:41](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L41)

___

### sizeOnly

• **sizeOnly**: `boolean`

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:40](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L40)

## Methods

### execute

▸ **execute**(`client`): `Promise`<[`SyncLocalWithBucketCommandOutput`](../modules.md#synclocalwithbucketcommandoutput)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<[`SyncLocalWithBucketCommandOutput`](../modules.md#synclocalwithbucketcommandoutput)\>

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:63](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L63)
