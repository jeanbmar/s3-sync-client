[s3-sync-client](../README.md) / [Exports](../modules.md) / S3SyncClient

# Class: S3SyncClient

## Table of contents

### Constructors

- [constructor](S3SyncClient.md#constructor)

### Properties

- [client](S3SyncClient.md#client)

### Methods

- [send](S3SyncClient.md#send)
- [sync](S3SyncClient.md#sync)

## Constructors

### constructor

• **new S3SyncClient**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`S3SyncClientConfig`](../modules.md#s3syncclientconfig) |

#### Defined in

[src/S3SyncClient.ts:16](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/S3SyncClient.ts#L16)

## Properties

### client

• `Private` **client**: `S3Client`

#### Defined in

[src/S3SyncClient.ts:14](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/S3SyncClient.ts#L14)

## Methods

### send

▸ **send**(`command`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | [`ICommand`](../interfaces/ICommand.md) |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/S3SyncClient.ts:33](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/S3SyncClient.ts#L33)

___

### sync

▸ **sync**(`source`, `target`, `options?`): `Promise`<`SyncCommandOutput`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `target` | `string` |
| `options?` | `SyncOptions` |

#### Returns

`Promise`<`SyncCommandOutput`\>

#### Defined in

[src/S3SyncClient.ts:21](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/S3SyncClient.ts#L21)
