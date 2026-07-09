import type { OmitNever, VonaContext } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IFileProviderRecord } from './fileProvider.ts';

export interface IFileSceneRecord {}

export interface IFileSceneOptionsUpload {
  maxSize?: number;
  mimeTypes?: string[];
  extensions?: string[];
  multiple?: boolean;
}

export interface IDecoratorFileSceneOptionsProvider {
  providerName?: keyof IFileProviderRecord;
  clientName?: string;
}

export type TypeFileSceneOptionsResolver = (
  ctx: VonaContext,
) => Promise<IDecoratorFileSceneOptionsProvider>;

export type TypeDecoratorFileSceneOptionsProvider =
  | TypeFileSceneOptionsResolver
  | IDecoratorFileSceneOptionsProvider;

export type TypeFileSceneOptionsMetaResolver = (
  ctx: VonaContext,
) => Promise<Record<string, any> | undefined> | Record<string, any> | undefined;

export interface IDecoratorFileSceneOptions {
  provider?: TypeDecoratorFileSceneOptionsProvider;
  upload?: IFileSceneOptionsUpload;
  public?: boolean;
  meta?: Record<string, any> | TypeFileSceneOptionsMetaResolver;
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    fileScene: ServiceOnion<IFileSceneRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    fileScene: OmitNever<IFileSceneRecord>;
  }

  export interface IBeanSceneRecord {
    fileScene: never;
  }
}
