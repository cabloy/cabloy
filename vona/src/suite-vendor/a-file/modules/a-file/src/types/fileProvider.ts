import type { OmitNever } from 'vona';
import type { ServiceOnion, TypeOnionOptionsEnableSimple } from 'vona-module-a-onion';

import type { EntityFile } from '../entity/file.ts';
import type { EntityFileProvider } from '../entity/fileProvider.ts';
import type {
  IFileDeliveryOptions,
  IFileDirectUploadInput,
  IFileDownloadResult,
  IFileProviderDirectUploadResource,
  IFileProviderResource,
  IFileUploadInput,
  IFileUploadUrlInput,
} from './file.ts';

export type TypeFileProviderPick = Partial<
  Pick<EntityFileProvider, 'id' | 'providerName' | 'clientName'>
>;

export interface IFileProviderRecord {}

export interface IFileProviderClientRecord {
  default: never;
}

export interface IFileProviderClientOptions {
  bucket?: string;
  deliveryBaseUrl?: string;
  public?: boolean;
  presignExpiresIn?: number;
  signedDeliveryKind?: 'proxy' | 'provider';
}

export type TypeFileProviderClientOptions<T> =
  T extends IDecoratorFileProviderOptions<any, infer O> ? O : never;

export type TypeFileProviderClientName<T> =
  T extends IDecoratorFileProviderOptions<infer R, any> ? keyof R & string : never;

export interface IDecoratorFileProviderOptions<
  R extends IFileProviderClientRecord = IFileProviderClientRecord,
  T extends IFileProviderClientOptions = IFileProviderClientOptions,
> extends TypeOnionOptionsEnableSimple {
  base?: T;
  clients?: { [K in keyof R]?: R[K] extends undefined ? T : R[K] };
}

export type TypeFileProviderOptionsByName<N extends keyof IFileProviderRecord> =
  IFileProviderRecord[N];

export type TypeFileProviderClientOptionsByName<N extends keyof IFileProviderRecord> =
  TypeFileProviderOptionsByName<N> extends IDecoratorFileProviderOptions<any, any>
    ? TypeFileProviderClientOptions<TypeFileProviderOptionsByName<N>>
    : never;

export type TypeFileProviderClientNameByName<N extends keyof IFileProviderRecord> =
  TypeFileProviderOptionsByName<N> extends IDecoratorFileProviderOptions<any, any>
    ? TypeFileProviderClientName<TypeFileProviderOptionsByName<N>>
    : never;

export type TypeFileProviderExecuteByName<N extends keyof IFileProviderRecord> =
  TypeFileProviderOptionsByName<N> extends IDecoratorFileProviderOptions<any, any>
    ? IFileProviderExecute<TypeFileProviderClientOptionsByName<N>, TypeFileProviderOptionsByName<N>>
    : never;

export interface IFileProviderExecute<
  T extends IFileProviderClientOptions = IFileProviderClientOptions,
  O extends IDecoratorFileProviderOptions = IDecoratorFileProviderOptions,
> {
  upload(input: IFileUploadInput, clientOptions: T, options: O): Promise<IFileProviderResource>;
  uploadUrl?(
    input: IFileUploadUrlInput,
    clientOptions: T,
    options: O,
  ): Promise<IFileProviderResource>;
  createDirectUpload?(
    input: IFileDirectUploadInput,
    clientOptions: T,
    options: O,
  ): Promise<IFileProviderDirectUploadResource>;
  get(file: EntityFile, clientOptions: T, options: O): Promise<IFileProviderResource | undefined>;
  delete(file: EntityFile, clientOptions: T, options: O): Promise<void>;
  getDownloadUrl(
    file: EntityFile,
    clientOptions: T,
    options: O,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<string>;
  download?(
    file: EntityFile,
    clientOptions: T,
    options: O,
    deliveryOptions?: IFileDeliveryOptions,
  ): Promise<IFileDownloadResult>;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    fileProvider: ServiceOnion<IFileProviderRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    fileProvider: OmitNever<IFileProviderRecord>;
  }

  export interface IBeanSceneRecord {
    fileProvider: never;
  }
}
