[s3-sync-client](../README.md) / [Exports](../modules.md) / DeleteBucketObjectsCommand

# Class: DeleteBucketObjectsCommand

## Table of contents

### Constructors

- [constructor](DeleteBucketObjectsCommand.md#constructor)

### Properties

- [bucket](DeleteBucketObjectsCommand.md#bucket)
- [keys](DeleteBucketObjectsCommand.md#keys)

### Methods

- [execute](DeleteBucketObjectsCommand.md#execute)

## Constructors

### constructor

• **new DeleteBucketObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`DeleteBucketObjectsCommandInput`](../modules.md#deletebucketobjectscommandinput) |

#### Defined in

[src/commands/DeleteBucketObjectsCommand.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/DeleteBucketObjectsCommand.ts#L18)

## Properties

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/DeleteBucketObjectsCommand.ts:15](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/DeleteBucketObjectsCommand.ts#L15)

___

### keys

• **keys**: `string`[]

#### Defined in

[src/commands/DeleteBucketObjectsCommand.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/DeleteBucketObjectsCommand.ts#L16)

## Methods

### execute

▸ **execute**(`client`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<`number`\>

#### Defined in

[src/commands/DeleteBucketObjectsCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/commands/DeleteBucketObjectsCommand.ts#L23)
