[s3-sync-client](../README.md) / [Exports](../modules.md) / ListLocalObjectsCommand

# Class: ListLocalObjectsCommand

## Table of contents

### Constructors

- [constructor](ListLocalObjectsCommand.md#constructor)

### Properties

- [directory](ListLocalObjectsCommand.md#directory)
- [followSymlinks](ListLocalObjectsCommand.md#followsymlinks)

### Methods

- [execute](ListLocalObjectsCommand.md#execute)
- [listObjectsRecursively](ListLocalObjectsCommand.md#listobjectsrecursively)

## Constructors

### constructor

• **new ListLocalObjectsCommand**(`input`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ListLocalObjectsCommandInput`](../modules.md#listlocalobjectscommandinput) |

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:15](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/ListLocalObjectsCommand.ts#L15)

## Properties

### directory

• **directory**: `string`

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:13](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/ListLocalObjectsCommand.ts#L13)

___

### followSymlinks

• **followSymlinks**: `boolean`

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:14](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/ListLocalObjectsCommand.ts#L14)

## Methods

### execute

▸ **execute**(): `Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Returns

`Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/ListLocalObjectsCommand.ts#L21)

___

### listObjectsRecursively

▸ `Private` **listObjectsRecursively**(`currentDir`): `Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `currentDir` | `any` |

#### Returns

`Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:25](https://github.com/jeanbmar/s3-sync-client/blob/c83b38d/src/commands/ListLocalObjectsCommand.ts#L25)
