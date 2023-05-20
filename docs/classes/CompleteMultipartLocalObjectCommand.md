[s3-sync-client](../README.md) / [Exports](../modules.md) / CompleteMultipartLocalObjectCommand

# Class: CompleteMultipartLocalObjectCommand

## Table of contents

### Constructors

- [constructor](CompleteMultipartLocalObjectCommand.md#constructor)

### Properties

- [bucket](CompleteMultipartLocalObjectCommand.md#bucket)
- [localObject](CompleteMultipartLocalObjectCommand.md#localobject)
- [parts](CompleteMultipartLocalObjectCommand.md#parts)
- [uploadId](CompleteMultipartLocalObjectCommand.md#uploadid)

### Methods

- [execute](CompleteMultipartLocalObjectCommand.md#execute)

## Constructors

### constructor

• **new CompleteMultipartLocalObjectCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CompleteMultipartLocalObjectCommandInput`](../modules.md#completemultipartlocalobjectcommandinput) |

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L22)

## Properties

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:19](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L19)

___

### localObject

• **localObject**: [`LocalObject`](LocalObject.md)

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L18)

___

### parts

• **parts**: [`UploadedPart`](../modules.md#uploadedpart)[]

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L21)

___

### uploadId

• **uploadId**: `string`

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:20](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L20)

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

[src/commands/CompleteMultipartLocalObjectCommand.ts:29](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L29)
