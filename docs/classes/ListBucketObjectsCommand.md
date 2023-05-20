[s3-sync-client](../README.md) / [Exports](../modules.md) / ListBucketObjectsCommand

# Class: ListBucketObjectsCommand

## Table of contents

### Constructors

- [constructor](ListBucketObjectsCommand.md#constructor)

### Properties

- [bucket](ListBucketObjectsCommand.md#bucket)
- [prefix](ListBucketObjectsCommand.md#prefix)

### Methods

- [execute](ListBucketObjectsCommand.md#execute)

## Constructors

### constructor

• **new ListBucketObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ListBucketObjectsCommandInput`](../modules.md#listbucketobjectscommandinput) |

#### Defined in

[src/commands/ListBucketObjectsCommand.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListBucketObjectsCommand.ts#L18)

## Properties

### bucket

• **bucket**: `string`

#### Defined in

[src/commands/ListBucketObjectsCommand.ts:15](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListBucketObjectsCommand.ts#L15)

___

### prefix

• `Optional` **prefix**: `string`

#### Defined in

[src/commands/ListBucketObjectsCommand.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListBucketObjectsCommand.ts#L16)

## Methods

### execute

▸ **execute**(`client`): `Promise`<[`BucketObject`](BucketObject.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `S3Client` |

#### Returns

`Promise`<[`BucketObject`](BucketObject.md)[]\>

#### Defined in

[src/commands/ListBucketObjectsCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListBucketObjectsCommand.ts#L23)
