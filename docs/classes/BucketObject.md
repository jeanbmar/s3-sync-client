[s3-sync-client](../README.md) / [Exports](../modules.md) / BucketObject

# Class: BucketObject

## Hierarchy

- [`SyncObject`](SyncObject.md)

  ↳ **`BucketObject`**

## Table of contents

### Constructors

- [constructor](BucketObject.md#constructor)

### Properties

- [bucket](BucketObject.md#bucket)
- [id](BucketObject.md#id)
- [key](BucketObject.md#key)
- [lastModified](BucketObject.md#lastmodified)
- [size](BucketObject.md#size)

### Accessors

- [isIncluded](BucketObject.md#isincluded)

### Methods

- [applyFilters](BucketObject.md#applyfilters)
- [applyLegacyRelocation](BucketObject.md#applylegacyrelocation)
- [applyRelocation](BucketObject.md#applyrelocation)
- [applyRelocations](BucketObject.md#applyrelocations)
- [diff](BucketObject.md#diff)

## Constructors

### constructor

• **new BucketObject**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`BucketObjectOptions`](../modules.md#bucketobjectoptions) |

#### Overrides

[SyncObject](SyncObject.md).[constructor](SyncObject.md#constructor)

#### Defined in

[src/fs/BucketObject.ts:12](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/BucketObject.ts#L12)

## Properties

### bucket

• **bucket**: `string`

#### Defined in

[src/fs/BucketObject.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/BucketObject.ts#L9)

___

### id

• **id**: `string`

#### Inherited from

[SyncObject](SyncObject.md).[id](SyncObject.md#id)

#### Defined in

[src/fs/SyncObject.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L16)

___

### key

• **key**: `string`

#### Defined in

[src/fs/BucketObject.ts:10](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/BucketObject.ts#L10)

___

### lastModified

• **lastModified**: `number`

#### Inherited from

[SyncObject](SyncObject.md).[lastModified](SyncObject.md#lastmodified)

#### Defined in

[src/fs/SyncObject.ts:18](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L18)

___

### size

• **size**: `number`

#### Inherited from

[SyncObject](SyncObject.md).[size](SyncObject.md#size)

#### Defined in

[src/fs/SyncObject.ts:17](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L17)

## Accessors

### isIncluded

• `get` **isIncluded**(): `boolean`

#### Returns

`boolean`

#### Inherited from

SyncObject.isIncluded

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

#### Inherited from

[SyncObject](SyncObject.md).[applyFilters](SyncObject.md#applyfilters)

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

#### Inherited from

[SyncObject](SyncObject.md).[applyLegacyRelocation](SyncObject.md#applylegacyrelocation)

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

#### Inherited from

[SyncObject](SyncObject.md).[applyRelocation](SyncObject.md#applyrelocation)

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

#### Inherited from

[SyncObject](SyncObject.md).[applyRelocations](SyncObject.md#applyrelocations)

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

#### Inherited from

[SyncObject](SyncObject.md).[diff](SyncObject.md#diff)

#### Defined in

[src/fs/SyncObject.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/3b5f6c4/src/fs/SyncObject.ts#L27)
