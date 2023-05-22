[s3-sync-client](../README.md) / [Exports](../modules.md) / UploadLocalObjectCommand

# Class: UploadLocalObjectCommand

## Table of contents

### Constructors

- [constructor](UploadLocalObjectCommand.md#constructor)

### Properties

- [abortSignal](UploadLocalObjectCommand.md#abortsignal)
- [bucket](UploadLocalObjectCommand.md#bucket)
- [commandInput](UploadLocalObjectCommand.md#commandinput)
- [localObject](UploadLocalObjectCommand.md#localobject)
- [monitor](UploadLocalObjectCommand.md#monitor)

### Methods

- [execute](UploadLocalObjectCommand.md#execute)

## Constructors

### constructor

• **new UploadLocalObjectCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UploadLocalObjectCommandInput`](../modules.md#uploadlocalobjectcommandinput) |

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L27)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L23)

___

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L22)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`PutObjectCommandInput`\>

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L24)

___

### localObject

• **localObject**: [`LocalObject`](LocalObject.md)

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L21)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:25](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L25)

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

[src/commands/UploadLocalObjectCommand.ts:34](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectCommand.ts#L34)
