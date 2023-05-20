[s3-sync-client](../README.md) / [Exports](../modules.md) / ListLocalObjectsCommand

# Class: ListLocalObjectsCommand

## Table of contents

### Constructors

- [constructor](ListLocalObjectsCommand.md#constructor)

### Properties

- [directory](ListLocalObjectsCommand.md#directory)

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

[src/commands/ListLocalObjectsCommand.ts:12](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListLocalObjectsCommand.ts#L12)

## Properties

### directory

• **directory**: `string`

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:11](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListLocalObjectsCommand.ts#L11)

## Methods

### execute

▸ **execute**(): `Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Returns

`Promise`<[`LocalObject`](LocalObject.md)[]\>

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListLocalObjectsCommand.ts#L16)

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

[src/commands/ListLocalObjectsCommand.ts:20](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListLocalObjectsCommand.ts#L20)
