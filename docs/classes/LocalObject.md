[s3-sync-client](../README.md) / [Exports](../modules.md) / LocalObject

# Class: LocalObject

## Hierarchy

- [`SyncObject`](SyncObject.md)

  ↳ **`LocalObject`**

## Table of contents

### Constructors

- [constructor](LocalObject.md#constructor)

### Properties

- [id](LocalObject.md#id)
- [lastModified](LocalObject.md#lastmodified)
- [path](LocalObject.md#path)
- [size](LocalObject.md#size)

### Accessors

- [isIncluded](LocalObject.md#isincluded)

### Methods

- [applyFilters](LocalObject.md#applyfilters)
- [applyLegacyRelocation](LocalObject.md#applylegacyrelocation)
- [applyRelocation](LocalObject.md#applyrelocation)
- [applyRelocations](LocalObject.md#applyrelocations)
- [diff](LocalObject.md#diff)

## Constructors

### constructor

• **new LocalObject**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`LocalObjectOptions`](../modules.md#localobjectoptions) |

#### Overrides

[SyncObject](SyncObject.md).[constructor](SyncObject.md#constructor)

#### Defined in

[src/fs/LocalObject.ts:10](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/LocalObject.ts#L10)

## Properties

### id

• **id**: `string`

#### Inherited from

[SyncObject](SyncObject.md).[id](SyncObject.md#id)

#### Defined in

[src/fs/SyncObject.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L21)

___

### lastModified

• **lastModified**: `number`

#### Inherited from

[SyncObject](SyncObject.md).[lastModified](SyncObject.md#lastmodified)

#### Defined in

[src/fs/SyncObject.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L23)

___

### path

• **path**: `string`

#### Defined in

[src/fs/LocalObject.ts:8](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/LocalObject.ts#L8)

___

### size

• **size**: `number`

#### Inherited from

[SyncObject](SyncObject.md).[size](SyncObject.md#size)

#### Defined in

[src/fs/SyncObject.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L22)

## Accessors

### isIncluded

• `get` **isIncluded**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SyncObject.isIncluded

#### Defined in

[src/fs/SyncObject.ts:71](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L71)

## Methods

### applyFilters

▸ **applyFilters**(`filters`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filters` | [`Filter`](../modules.md#filter)[] |

#### Returns

`void`

#### Inherited from

[SyncObject](SyncObject.md).[applyFilters](SyncObject.md#applyfilters)

#### Defined in

[src/fs/SyncObject.ts:75](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L75)

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

#### Inherited from

[SyncObject](SyncObject.md).[applyLegacyRelocation](SyncObject.md#applylegacyrelocation)

#### Defined in

[src/fs/SyncObject.ts:86](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L86)

___

### applyRelocation

▸ **applyRelocation**(`relocation`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `relocation` | [`Relocation`](../modules.md#relocation) |

#### Returns

`void`

#### Inherited from

[SyncObject](SyncObject.md).[applyRelocation](SyncObject.md#applyrelocation)

#### Defined in

[src/fs/SyncObject.ts:98](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L98)

___

### applyRelocations

▸ **applyRelocations**(`relocations`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `relocations` | [`Relocation`](../modules.md#relocation)[] |

#### Returns

`void`

#### Inherited from

[SyncObject](SyncObject.md).[applyRelocations](SyncObject.md#applyrelocations)

#### Defined in

[src/fs/SyncObject.ts:106](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L106)

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

#### Inherited from

[SyncObject](SyncObject.md).[diff](SyncObject.md#diff)

#### Defined in

[src/fs/SyncObject.ts:32](https://github.com/jeanbmar/s3-sync-client/blob/168acbf/src/fs/SyncObject.ts#L32)
