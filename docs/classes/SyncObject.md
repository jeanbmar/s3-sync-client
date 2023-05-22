[s3-sync-client](../README.md) / [Exports](../modules.md) / SyncObject

# Class: SyncObject

## Hierarchy

- **`SyncObject`**

  ↳ [`BucketObject`](BucketObject.md)

  ↳ [`LocalObject`](LocalObject.md)

## Table of contents

### Constructors

- [constructor](SyncObject.md#constructor)

### Properties

- [id](SyncObject.md#id)
- [isExcluded](SyncObject.md#isexcluded)
- [lastModified](SyncObject.md#lastmodified)
- [size](SyncObject.md#size)

### Accessors

- [isIncluded](SyncObject.md#isincluded)

### Methods

- [applyFilters](SyncObject.md#applyfilters)
- [applyLegacyRelocation](SyncObject.md#applylegacyrelocation)
- [applyRelocation](SyncObject.md#applyrelocation)
- [applyRelocations](SyncObject.md#applyrelocations)
- [diff](SyncObject.md#diff)

## Constructors

### constructor

• **new SyncObject**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SyncObjectOptions`](../modules.md#syncobjectoptions) |

#### Defined in

[src/fs/SyncObject.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L21)

## Properties

### id

• **id**: `string`

#### Defined in

[src/fs/SyncObject.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L16)

___

### isExcluded

• `Private` **isExcluded**: `boolean` = `false`

#### Defined in

[src/fs/SyncObject.ts:19](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L19)

___

### lastModified

• **lastModified**: `number`

#### Defined in

[src/fs/SyncObject.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L18)

___

### size

• **size**: `number`

#### Defined in

[src/fs/SyncObject.ts:17](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L17)

## Accessors

### isIncluded

• `get` **isIncluded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/fs/SyncObject.ts:60](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L60)

## Methods

### applyFilters

▸ **applyFilters**(`filters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filters` | [`Filter`](../modules.md#filter)[] |

#### Returns

`void`

#### Defined in

[src/fs/SyncObject.ts:64](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L64)

___

### applyLegacyRelocation

▸ **applyLegacyRelocation**(`sourcePrefix`, `targetPrefix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourcePrefix` | `any` |
| `targetPrefix` | `any` |

#### Returns

`void`

#### Defined in

[src/fs/SyncObject.ts:75](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L75)

___

### applyRelocation

▸ **applyRelocation**(`relocation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `relocation` | [`Relocation`](../modules.md#relocation) |

#### Returns

`void`

#### Defined in

[src/fs/SyncObject.ts:87](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L87)

___

### applyRelocations

▸ **applyRelocations**(`relocations`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `relocations` | [`Relocation`](../modules.md#relocation)[] |

#### Returns

`void`

#### Defined in

[src/fs/SyncObject.ts:95](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L95)

___

### diff

▸ `Static` **diff**(`sourceObjects`, `targetObjects`, `sizeOnly?`): [`Diff`](../modules.md#diff)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `sourceObjects` | [`SyncObject`](SyncObject.md)[] | `undefined` |
| `targetObjects` | [`SyncObject`](SyncObject.md)[] | `undefined` |
| `sizeOnly` | `boolean` | `false` |

#### Returns

[`Diff`](../modules.md#diff)

#### Defined in

[src/fs/SyncObject.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L27)
