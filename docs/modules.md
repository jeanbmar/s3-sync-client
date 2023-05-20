[s3-sync-client](README.md) / Exports

# s3-sync-client

## Table of contents

### References

- [default](modules.md#default)

### Classes

- [BucketObject](classes/BucketObject.md)
- [CompleteMultipartLocalObjectCommand](classes/CompleteMultipartLocalObjectCommand.md)
- [CopyBucketObjectCommand](classes/CopyBucketObjectCommand.md)
- [CopyBucketObjectsCommand](classes/CopyBucketObjectsCommand.md)
- [CreateMultipartLocalObjectUploadCommand](classes/CreateMultipartLocalObjectUploadCommand.md)
- [DeleteBucketObjectsCommand](classes/DeleteBucketObjectsCommand.md)
- [DownloadBucketObjectCommand](classes/DownloadBucketObjectCommand.md)
- [DownloadBucketObjectsCommand](classes/DownloadBucketObjectsCommand.md)
- [ListBucketObjectsCommand](classes/ListBucketObjectsCommand.md)
- [ListLocalObjectsCommand](classes/ListLocalObjectsCommand.md)
- [LocalObject](classes/LocalObject.md)
- [S3SyncClient](classes/S3SyncClient.md)
- [SyncBucketWithBucketCommand](classes/SyncBucketWithBucketCommand.md)
- [SyncBucketWithLocalCommand](classes/SyncBucketWithLocalCommand.md)
- [SyncLocalWithBucketCommand](classes/SyncLocalWithBucketCommand.md)
- [SyncObject](classes/SyncObject.md)
- [TransferMonitor](classes/TransferMonitor.md)
- [UploadLocalObjectCommand](classes/UploadLocalObjectCommand.md)
- [UploadLocalObjectPartCommand](classes/UploadLocalObjectPartCommand.md)
- [UploadLocalObjectsCommand](classes/UploadLocalObjectsCommand.md)

### Interfaces

- [ICommand](interfaces/ICommand.md)

### Type Aliases

- [BucketObjectOptions](modules.md#bucketobjectoptions)
- [CommandInput](modules.md#commandinput)
- [CompleteMultipartLocalObjectCommandInput](modules.md#completemultipartlocalobjectcommandinput)
- [CopyBucketObjectCommandInput](modules.md#copybucketobjectcommandinput)
- [CopyBucketObjectsCommandInput](modules.md#copybucketobjectscommandinput)
- [CreateMultipartLocalObjectUploadCommandInput](modules.md#createmultipartlocalobjectuploadcommandinput)
- [DeleteBucketObjectsCommandInput](modules.md#deletebucketobjectscommandinput)
- [Diff](modules.md#diff)
- [DownloadBucketObjectCommandInput](modules.md#downloadbucketobjectcommandinput)
- [DownloadBucketObjectsCommandInput](modules.md#downloadbucketobjectscommandinput)
- [Filter](modules.md#filter)
- [ListBucketObjectsCommandInput](modules.md#listbucketobjectscommandinput)
- [ListLocalObjectsCommandInput](modules.md#listlocalobjectscommandinput)
- [LocalObjectOptions](modules.md#localobjectoptions)
- [Relocation](modules.md#relocation)
- [S3SyncClientConfig](modules.md#s3syncclientconfig)
- [SyncBucketWithBucketCommandInput](modules.md#syncbucketwithbucketcommandinput)
- [SyncBucketWithBucketCommandOutput](modules.md#syncbucketwithbucketcommandoutput)
- [SyncBucketWithLocalCommandInput](modules.md#syncbucketwithlocalcommandinput)
- [SyncBucketWithLocalCommandOutput](modules.md#syncbucketwithlocalcommandoutput)
- [SyncLocalWithBucketCommandInput](modules.md#synclocalwithbucketcommandinput)
- [SyncLocalWithBucketCommandOutput](modules.md#synclocalwithbucketcommandoutput)
- [SyncObjectOptions](modules.md#syncobjectoptions)
- [TransferStatus](modules.md#transferstatus)
- [UploadLocalObjectCommandInput](modules.md#uploadlocalobjectcommandinput)
- [UploadLocalObjectPartCommandInput](modules.md#uploadlocalobjectpartcommandinput)
- [UploadLocalObjectsCommandInput](modules.md#uploadlocalobjectscommandinput)
- [UploadedPart](modules.md#uploadedpart)

### Functions

- [mergeInput](modules.md#mergeinput)

## References

### default

Renames and re-exports [S3SyncClient](classes/S3SyncClient.md)

## Type Aliases

### BucketObjectOptions

Ƭ **BucketObjectOptions**: { `bucket`: `string` ; `key`: `string`  } & [`SyncObjectOptions`](modules.md#syncobjectoptions)

#### Defined in

[src/fs/BucketObject.ts:3](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/fs/BucketObject.ts#L3)

___

### CommandInput

Ƭ **CommandInput**<`T`\>: `Partial`<`T`\> \| (`properties`: `Partial`<`T`\>) => `Partial`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/commands/Command.ts:10](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/Command.ts#L10)

___

### CompleteMultipartLocalObjectCommandInput

Ƭ **CompleteMultipartLocalObjectCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bucket` | `string` |
| `localObject` | [`LocalObject`](classes/LocalObject.md) |
| `parts` | [`UploadedPart`](modules.md#uploadedpart)[] |
| `uploadId` | `string` |

#### Defined in

[src/commands/CompleteMultipartLocalObjectCommand.ts:10](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CompleteMultipartLocalObjectCommand.ts#L10)

___

### CopyBucketObjectCommandInput

Ƭ **CopyBucketObjectCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketObject` | [`BucketObject`](classes/BucketObject.md) |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`CopyObjectCommandInput`\> |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `targetBucket` | `string` |

#### Defined in

[src/commands/CopyBucketObjectCommand.ts:11](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CopyBucketObjectCommand.ts#L11)

___

### CopyBucketObjectsCommandInput

Ƭ **CopyBucketObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketObjects` | [`BucketObject`](classes/BucketObject.md)[] |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`CopyObjectCommandInput`\> |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `targetBucket` | `string` |

#### Defined in

[src/commands/CopyBucketObjectsCommand.ts:13](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CopyBucketObjectsCommand.ts#L13)

___

### CreateMultipartLocalObjectUploadCommandInput

Ƭ **CreateMultipartLocalObjectUploadCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bucket` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`CreateMultipartUploadCommandInput`\> |
| `localObject` | [`LocalObject`](classes/LocalObject.md) |

#### Defined in

[src/commands/CreateMultipartLocalObjectUploadCommand.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/CreateMultipartLocalObjectUploadCommand.ts#L9)

___

### DeleteBucketObjectsCommandInput

Ƭ **DeleteBucketObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bucket` | `string` |
| `keys` | `string`[] |

#### Defined in

[src/commands/DeleteBucketObjectsCommand.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/DeleteBucketObjectsCommand.ts#L9)

___

### Diff

Ƭ **Diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | [`SyncObject`](classes/SyncObject.md)[] |
| `deleted` | [`SyncObject`](classes/SyncObject.md)[] |
| `updated` | [`SyncObject`](classes/SyncObject.md)[] |

#### Defined in

[src/fs/SyncObject.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/fs/SyncObject.ts#L9)

___

### DownloadBucketObjectCommandInput

Ƭ **DownloadBucketObjectCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketObject` | [`BucketObject`](classes/BucketObject.md) |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`GetObjectCommandInput`\> |
| `localDir` | `string` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |

#### Defined in

[src/commands/DownloadBucketObjectCommand.ts:17](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/DownloadBucketObjectCommand.ts#L17)

___

### DownloadBucketObjectsCommandInput

Ƭ **DownloadBucketObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketObjects` | [`BucketObject`](classes/BucketObject.md)[] |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`GetObjectCommandInput`\> |
| `localDir` | `string` |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |

#### Defined in

[src/commands/DownloadBucketObjectsCommand.ts:13](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/DownloadBucketObjectsCommand.ts#L13)

___

### Filter

Ƭ **Filter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `exclude?` | (`key`: `any`) => `boolean` |
| `include?` | (`key`: `any`) => `boolean` |

#### Defined in

[src/commands/Command.ts:5](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/Command.ts#L5)

___

### ListBucketObjectsCommandInput

Ƭ **ListBucketObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bucket` | `string` |
| `prefix?` | `string` |

#### Defined in

[src/commands/ListBucketObjectsCommand.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListBucketObjectsCommand.ts#L9)

___

### ListLocalObjectsCommandInput

Ƭ **ListLocalObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `directory` | `string` |

#### Defined in

[src/commands/ListLocalObjectsCommand.ts:6](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/ListLocalObjectsCommand.ts#L6)

___

### LocalObjectOptions

Ƭ **LocalObjectOptions**: { `path`: `string`  } & [`SyncObjectOptions`](modules.md#syncobjectoptions)

#### Defined in

[src/fs/LocalObject.ts:4](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/fs/LocalObject.ts#L4)

___

### Relocation

Ƭ **Relocation**: [sourcePrefix: string, targetPrefix: string]

#### Defined in

[src/commands/Command.ts:3](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/Command.ts#L3)

___

### S3SyncClientConfig

Ƭ **S3SyncClientConfig**: { `client`: `S3Client`  } & `S3ClientConfig`

#### Defined in

[src/S3SyncClient.ts:9](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/S3SyncClient.ts#L9)

___

### SyncBucketWithBucketCommandInput

Ƭ **SyncBucketWithBucketCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`CopyObjectCommandInput`\> |
| `del?` | `boolean` |
| `dryRun?` | `boolean` |
| `filters?` | [`Filter`](modules.md#filter)[] |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `relocations?` | [`Relocation`](modules.md#relocation)[] |
| `sizeOnly?` | `boolean` |
| `sourceBucketPrefix` | `string` |
| `targetBucketPrefix` | `string` |

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:13](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncBucketWithBucketCommand.ts#L13)

___

### SyncBucketWithBucketCommandOutput

Ƭ **SyncBucketWithBucketCommandOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | [`BucketObject`](classes/BucketObject.md)[] |
| `deleted` | [`BucketObject`](classes/BucketObject.md)[] |
| `updated` | [`BucketObject`](classes/BucketObject.md)[] |

#### Defined in

[src/commands/SyncBucketWithBucketCommand.ts:27](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncBucketWithBucketCommand.ts#L27)

___

### SyncBucketWithLocalCommandInput

Ƭ **SyncBucketWithLocalCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketPrefix` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`PutObjectCommandInput`\> \| [`CommandInput`](modules.md#commandinput)<`CreateMultipartUploadCommandInput`\> |
| `del?` | `boolean` |
| `dryRun?` | `boolean` |
| `filters?` | [`Filter`](modules.md#filter)[] |
| `localDir` | `string` |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `partSize?` | `number` |
| `relocations?` | [`Relocation`](modules.md#relocation)[] |
| `sizeOnly?` | `boolean` |

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:22](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncBucketWithLocalCommand.ts#L22)

___

### SyncBucketWithLocalCommandOutput

Ƭ **SyncBucketWithLocalCommandOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | [`LocalObject`](classes/LocalObject.md)[] |
| `deleted` | [`BucketObject`](classes/BucketObject.md)[] |
| `updated` | [`LocalObject`](classes/LocalObject.md)[] |

#### Defined in

[src/commands/SyncBucketWithLocalCommand.ts:39](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncBucketWithLocalCommand.ts#L39)

___

### SyncLocalWithBucketCommandInput

Ƭ **SyncLocalWithBucketCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucketPrefix` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`GetObjectCommandInput`\> |
| `del?` | `boolean` |
| `dryRun?` | `boolean` |
| `filters?` | [`Filter`](modules.md#filter)[] |
| `localDir` | `string` |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `relocations?` | [`Relocation`](modules.md#relocation)[] |
| `sizeOnly?` | `boolean` |

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:15](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L15)

___

### SyncLocalWithBucketCommandOutput

Ƭ **SyncLocalWithBucketCommandOutput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `created` | [`BucketObject`](classes/BucketObject.md)[] |
| `deleted` | [`LocalObject`](classes/LocalObject.md)[] |
| `updated` | [`BucketObject`](classes/BucketObject.md)[] |

#### Defined in

[src/commands/SyncLocalWithBucketCommand.ts:29](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/SyncLocalWithBucketCommand.ts#L29)

___

### SyncObjectOptions

Ƭ **SyncObjectOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `lastModified` | `number` |
| `size` | `number` |

#### Defined in

[src/fs/SyncObject.ts:3](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/fs/SyncObject.ts#L3)

___

### TransferStatus

Ƭ **TransferStatus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | { `current`: `number` ; `total`: `number`  } |
| `count.current` | `number` |
| `count.total` | `number` |
| `size` | { `current`: `number` ; `total`: `number`  } |
| `size.current` | `number` |
| `size.total` | `number` |

#### Defined in

[src/TransferMonitor.ts:3](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/TransferMonitor.ts#L3)

___

### UploadLocalObjectCommandInput

Ƭ **UploadLocalObjectCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucket` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`PutObjectCommandInput`\> |
| `localObject` | [`LocalObject`](classes/LocalObject.md) |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |

#### Defined in

[src/commands/UploadLocalObjectCommand.ts:12](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/UploadLocalObjectCommand.ts#L12)

___

### UploadLocalObjectPartCommandInput

Ƭ **UploadLocalObjectPartCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucket` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`UploadPartCommandInput`\> |
| `endOffset` | `number` |
| `localObject` | [`LocalObject`](classes/LocalObject.md) |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `partNumber` | `number` |
| `startOffset` | `number` |
| `uploadId` | `string` |

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:12](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/UploadLocalObjectPartCommand.ts#L12)

___

### UploadLocalObjectsCommandInput

Ƭ **UploadLocalObjectsCommandInput**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `abortSignal?` | `AbortSignal` |
| `bucket` | `string` |
| `commandInput?` | [`CommandInput`](modules.md#commandinput)<`PutObjectCommandInput`\> \| [`CommandInput`](modules.md#commandinput)<`CreateMultipartUploadCommandInput`\> |
| `localObjects` | [`LocalObject`](classes/LocalObject.md)[] |
| `maxConcurrentTransfers?` | `number` |
| `monitor?` | [`TransferMonitor`](classes/TransferMonitor.md) |
| `partSize?` | `number` |

#### Defined in

[src/commands/UploadLocalObjectsCommand.ts:23](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/UploadLocalObjectsCommand.ts#L23)

___

### UploadedPart

Ƭ **UploadedPart**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `eTag` | `string` |
| `partNumber` | `number` |

#### Defined in

[src/commands/UploadLocalObjectPartCommand.ts:24](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/UploadLocalObjectPartCommand.ts#L24)

## Functions

### mergeInput

▸ **mergeInput**<`T`\>(`commandInput`, `properties`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `commandInput` | `T` |
| `properties` | [`CommandInput`](modules.md#commandinput)<`T`\> |

#### Returns

`T`

#### Defined in

[src/commands/Command.ts:20](https://github.com/jeanbmar/s3-sync-client/blob/4394dfa/src/commands/Command.ts#L20)
