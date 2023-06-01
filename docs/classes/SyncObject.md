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

[src/fs/SyncObject.ts:26](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L26)

## Properties

### id

• **id**: `string`

#### Defined in

[src/fs/SyncObject.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L21)

___

### isExcluded

• `Private` **isExcluded**: `boolean` = `false`

#### Defined in

[src/fs/SyncObject.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L24)

___

### lastModified

• **lastModified**: `number`

#### Defined in

[src/fs/SyncObject.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L23)

___

### size

• **size**: `number`

#### Defined in

[src/fs/SyncObject.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L22)

## Accessors

### isIncluded

• `get` **isIncluded**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/fs/SyncObject.ts:71](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L71)

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

[src/fs/SyncObject.ts:75](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L75)

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

[src/fs/SyncObject.ts:86](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L86)

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

[src/fs/SyncObject.ts:98](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L98)

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

[src/fs/SyncObject.ts:106](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L106)

___

### diff

▸ `Static` **diff**(`sourceObjects`, `targetObjects`, `options?`): [`Diff`](../modules.md#diff)

#### Parameters

| Name | Type |
| :------ | :------ |
| `sourceObjects` | [`SyncObject`](SyncObject.md)[] |
| `targetObjects` | [`SyncObject`](SyncObject.md)[] |
| `options?` | [`DiffOptions`](../modules.md#diffoptions) |

#### Returns

[`Diff`](../modules.md#diff)

#### Defined in

[src/fs/SyncObject.ts:32](https://github.com/jeanbmar/s3-sync-client/blob/aff45e9/src/fs/SyncObject.ts#L32)
