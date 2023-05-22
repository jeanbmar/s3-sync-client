[s3-sync-client](../README.md) / [Exports](../modules.md) / UploadLocalObjectsCommand

# Class: UploadLocalObjectsCommand

## Table of contents

### Constructors

- [constructor](UploadLocalObjectsCommand.md#constructor)

### Properties

- [abortSignal](UploadLocalObjectsCommand.md#abortsignal)
- [bucket](UploadLocalObjectsCommand.md#bucket)
- [commandInput](UploadLocalObjectsCommand.md#commandinput)
- [localObjects](UploadLocalObjectsCommand.md#localobjects)
- [maxConcurrentTransfers](UploadLocalObjectsCommand.md#maxconcurrenttransfers)
- [monitor](UploadLocalObjectsCommand.md#monitor)
- [partSize](UploadLocalObjectsCommand.md#partsize)

### Methods

- [deferDirectUpload](UploadLocalObjectsCommand.md#deferdirectupload)
- [deferMultipartUpload](UploadLocalObjectsCommand.md#defermultipartupload)
- [execute](UploadLocalObjectsCommand.md#execute)

## Constructors

### constructor

• **new UploadLocalObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`UploadLocalObjectsCommandInput`](../modules.md#uploadlocalobjectscommandinput) |

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:46](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L46)

## Properties

### abortSignal

• `Optional` **abortSignal**: `AbortSignal`

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:38](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L38)

___

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:37](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L37)

___

### commandInput

• `Optional` **commandInput**: [`CommandInput`](../modules.md#commandinput)<`PutObjectCommandInput`\> \| [`CommandInput`](../modules.md#commandinput)<`CreateMultipartUploadCommandInput`\>

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L39)

___

### localObjects

• **localObjects**: [`LocalObject`](LocalObject.md)[]

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:36](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L36)

___

### maxConcurrentTransfers

• **maxConcurrentTransfers**: `number`

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:43](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L43)

___

### monitor

• `Optional` **monitor**: [`TransferMonitor`](TransferMonitor.md)

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:42](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L42)

___

### partSize

• **partSize**: `number`

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:44](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L44)

## Methods

### deferDirectUpload

▸ **deferDirectUpload**(`client`, `localObject`): `Function`

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |
| `localObject` | [`LocalObject`](LocalObject.md) |

#### Returns

`Function`

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:78](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L78)

___

### deferMultipartUpload

▸ **deferMultipartUpload**(`client`, `localObject`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |
| `localObject` | [`LocalObject`](LocalObject.md) |

#### Returns

`Function`[]

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:92](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L92)

___

### execute

▸ **execute**(`client`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:57](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/commands/UploadLocalObjectsCommand.ts#L57)
