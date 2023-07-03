[s3-sync-client](../README.md) / [Exports](../modules.md) / CreateMultipartLocalObjectUploadCommand

# Class: CreateMultipartLocalObjectUploadCommand

## Table of contents

### Constructors

- [constructor](CreateMultipartLocalObjectUploadCommand.md#constructor)

### Properties

- [bucket](CreateMultipartLocalObjectUploadCommand.md#bucket)
- [commandInput](CreateMultipartLocalObjectUploadCommand.md#commandinput)
- [localObject](CreateMultipartLocalObjectUploadCommand.md#localobject)

### Methods

- [execute](CreateMultipartLocalObjectUploadCommand.md#execute)

## Constructors

### constructor

• **new CreateMultipartLocalObjectUploadCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`CreateMultipartLocalObjectUploadCommandInput`](../modules.md#createmultipartlocalobjectuploadcommandinput) |

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:19](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L19)

## Properties

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:17](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L17)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`CreateMultipartUploadCommandInput`\>

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L18)

___

### localObject

• **localObject**: [`LocalObject`](LocalObject.md)

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L16)

## Methods

### execute

▸ **execute**(`client`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:25](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L25)
