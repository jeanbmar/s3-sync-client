[s3-sync-client](../README.md) / [Exports](../modules.md) / UploadLocalObjectPartCommand

# Class: UploadLocalObjectPartCommand

## Table of contents

### Constructors

- [constructor](UploadLocalObjectPartCommand.md#constructor)

### Properties

- [abortSignal](UploadLocalObjectPartCommand.md#abortsignal)
- [bucket](UploadLocalObjectPartCommand.md#bucket)
- [commandInput](UploadLocalObjectPartCommand.md#commandinput)
- [endOffset](UploadLocalObjectPartCommand.md#endoffset)
- [localObject](UploadLocalObjectPartCommand.md#localobject)
- [monitor](UploadLocalObjectPartCommand.md#monitor)
- [partNumber](UploadLocalObjectPartCommand.md#partnumber)
- [startOffset](UploadLocalObjectPartCommand.md#startoffset)
- [uploadId](UploadLocalObjectPartCommand.md#uploadid)

### Methods

- [execute](UploadLocalObjectPartCommand.md#execute)

## Constructors

### constructor

• **new UploadLocalObjectPartCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UploadLocalObjectPartCommandInput`](../modules.md#uploadlocalobjectpartcommandinput) |

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L39)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:36](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L36)

___

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:35](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L35)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`UploadPartCommandInput`\>

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:38](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L38)

___

### endOffset

• **endOffset**: `number`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:32](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L32)

___

### localObject

• **localObject**: [`LocalObject`](LocalObject.md)

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:30](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L30)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:37](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L37)

___

### partNumber

• **partNumber**: `number`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:33](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L33)

___

### startOffset

• **startOffset**: `number`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:31](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L31)

___

### uploadId

• **uploadId**: `string`

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:34](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L34)

## Methods

### execute

▸ **execute**(`client`): `Promise`<[`UploadedPart`](../modules.md#uploadedpart)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<[`UploadedPart`](../modules.md#uploadedpart)\>

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:51](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/UploadLocalObjectPartCommand.ts#L51)
