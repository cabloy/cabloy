// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/image.ts';
export * from '../entity/imageProvider.ts';
import type { IEntityOptionsImage } from '../entity/image.ts';
import type { IEntityOptionsImageProvider } from '../entity/imageProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  export interface IEntityRecord {
    'a-image:image': IEntityOptionsImage;
    'a-image:imageProvider': IEntityOptionsImageProvider;
  }
}
declare module 'vona-module-a-image' {}
/** entity: end */
/** entity: begin */
import type { EntityImage } from '../entity/image.ts';
import type { EntityImageProvider } from '../entity/imageProvider.ts';
export interface IModuleEntity {
  'image': EntityImageMeta;
  'imageProvider': EntityImageProviderMeta;
}
/** entity: end */
/** entity: begin */
export type EntityImageTableName = 'aImage';
export type EntityImageProviderTableName = 'aImageProvider';
export type EntityImageMeta = TypeEntityMeta<EntityImage, EntityImageTableName>;
export type EntityImageProviderMeta = TypeEntityMeta<EntityImageProvider, EntityImageProviderTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aImage': EntityImageMeta;
    'aImageProvider': EntityImageProviderMeta;
  }
}
declare module 'vona-module-a-image' {
  export interface IEntityOptionsImage {
    fields?: TypeEntityOptionsFields<EntityImage, IEntityOptionsImage[TypeSymbolKeyFieldsMore]>;
  }

  export interface IEntityOptionsImageProvider {
    fields?: TypeEntityOptionsFields<
      EntityImageProvider,
      IEntityOptionsImageProvider[TypeSymbolKeyFieldsMore]
    >;
  }
}
/** entity: end */
/** model: begin */
export * from '../model/image.ts';
export * from '../model/imageProvider.ts';
import type { IModelOptionsImage } from '../model/image.ts';
import type { IModelOptionsImageProvider } from '../model/imageProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  export interface IModelRecord {
    'a-image:image': IModelOptionsImage;
    'a-image:imageProvider': IModelOptionsImageProvider;
  }
}
declare module 'vona-module-a-image' {
  export interface ModelImage {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }

  export interface ModelImage {
    get $beanFullName(): 'a-image.model.image';
    get $onionName(): 'a-image:image';
    get $onionOptions(): IModelOptionsImage;
  }

  export interface ModelImageProvider {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }

  export interface ModelImageProvider {
    get $beanFullName(): 'a-image.model.imageProvider';
    get $onionName(): 'a-image:imageProvider';
    get $onionOptions(): IModelOptionsImageProvider;
  }
}
/** model: end */
/** model: begin */
import type { ModelImage } from '../model/image.ts';
import type { ModelImageProvider } from '../model/imageProvider.ts';
export interface IModuleModel {
  'image': ModelImage;
  'imageProvider': ModelImageProvider;
}
/** model: end */
/** model: begin */
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-image.model.image': ModelImage;
    'a-image.model.imageProvider': ModelImageProvider;
  }
}
/** model: end */
/** model: begin */
import type { IModelDeleteOptions, IModelGetOptions, IModelInsertOptions, IModelMethodOptions, IModelMutateOptions, IModelSelectAggrParams, IModelSelectCountParams, IModelSelectGroupParams, IModelSelectParams, IModelUpdateOptions, TypeModelAggrRelationResult, TypeModelGroupRelationResult, TypeModelMutateRelationData, TypeModelRelationResult, TypeModelSelectAndCount, TypeModelWhere } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-image' {
  export interface ModelImage {
    [SymbolKeyEntity]: EntityImage;
    [SymbolKeyEntityMeta]: EntityImageMeta;
    [SymbolKeyModelOptions]: IModelOptionsImage;
    get<T extends IModelGetOptions<EntityImage, ModelImage>>(where: TypeModelWhere<EntityImage>, options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T> | undefined>;
    mget<T extends IModelGetOptions<EntityImage, ModelImage>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T>[]>;
    selectAndCount<T extends IModelSelectParams<EntityImage, ModelImage, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityImage, ModelImage, T>>;
    select<T extends IModelSelectParams<EntityImage, ModelImage, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityImage, ModelImage, T>[]>;
    insert<T extends IModelInsertOptions<EntityImage, ModelImage>>(data?: TypeModelMutateRelationData<EntityImage, ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage, ModelImage, T, true>>;
    update<T extends IModelUpdateOptions<EntityImage, ModelImage>>(data: TypeModelMutateRelationData<EntityImage, ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage, ModelImage, T>>;
    delete<T extends IModelDeleteOptions<EntityImage, ModelImage>>(where?: TypeModelWhere<EntityImage>, options?: T): Promise<void>;
    mutate<T extends IModelMutateOptions<EntityImage, ModelImage>>(data?: TypeModelMutateRelationData<EntityImage, ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage, ModelImage, T>>;
    count<T extends IModelSelectCountParams<EntityImage, ModelImage, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
    aggregate<T extends IModelSelectAggrParams<EntityImage, ModelImage, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
    group<T extends IModelSelectGroupParams<EntityImage, ModelImage, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityImage, T>[]>;
    getById<T extends IModelGetOptions<EntityImage, ModelImage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T> | undefined>;
    updateById<T extends IModelUpdateOptions<EntityImage, ModelImage>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityImage, ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage, ModelImage, T>>;
    deleteById<T extends IModelDeleteOptions<EntityImage, ModelImage>>(id: TableIdentity, options?: T): Promise<void>;
  }

  export interface ModelImageProvider {
    [SymbolKeyEntity]: EntityImageProvider;
    [SymbolKeyEntityMeta]: EntityImageProviderMeta;
    [SymbolKeyModelOptions]: IModelOptionsImageProvider;
    get<T extends IModelGetOptions<EntityImageProvider, ModelImageProvider>>(where: TypeModelWhere<EntityImageProvider>, options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T> | undefined>;
    mget<T extends IModelGetOptions<EntityImageProvider, ModelImageProvider>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T>[]>;
    selectAndCount<T extends IModelSelectParams<EntityImageProvider, ModelImageProvider, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityImageProvider, ModelImageProvider, T>>;
    select<T extends IModelSelectParams<EntityImageProvider, ModelImageProvider, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T>[]>;
    insert<T extends IModelInsertOptions<EntityImageProvider, ModelImageProvider>>(data?: TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T, true>>;
    update<T extends IModelUpdateOptions<EntityImageProvider, ModelImageProvider>>(data: TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>>;
    delete<T extends IModelDeleteOptions<EntityImageProvider, ModelImageProvider>>(where?: TypeModelWhere<EntityImageProvider>, options?: T): Promise<void>;
    mutate<T extends IModelMutateOptions<EntityImageProvider, ModelImageProvider>>(data?: TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>>;
    count<T extends IModelSelectCountParams<EntityImageProvider, ModelImageProvider, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
    aggregate<T extends IModelSelectAggrParams<EntityImageProvider, ModelImageProvider, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
    group<T extends IModelSelectGroupParams<EntityImageProvider, ModelImageProvider, ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityImageProvider, T>[]>;
    getById<T extends IModelGetOptions<EntityImageProvider, ModelImageProvider>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T> | undefined>;
    updateById<T extends IModelUpdateOptions<EntityImageProvider, ModelImageProvider>>(id: number, data: TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider, ModelImageProvider, T>>;
    deleteById<T extends IModelDeleteOptions<EntityImageProvider, ModelImageProvider>>(id: number, options?: T): Promise<void>;
  }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-image:image': ModelImage;
    'a-image:imageProvider': ModelImageProvider;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.image.ts';
export * from '../bean/bean.imageProvider.ts';

declare module 'vona-module-a-image' {
  export interface BeanImage {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }

  export interface BeanImageProvider {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }
}
/** bean: end */
/** bean: begin */
import type { BeanImage } from '../bean/bean.image.ts';
import type { BeanImageProvider } from '../bean/bean.imageProvider.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'image': BeanImage;
    'imageProvider': BeanImageProvider;
  }
}
/** bean: end */
/** meta: begin */
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  export interface IMetaRecord {
    'a-image:redlock': never;
    'a-image:version': never;
  }
}
declare module 'vona-module-a-image' {
  export interface MetaRedlock {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }

  export interface MetaRedlock {
    get $beanFullName(): 'a-image.meta.redlock';
    get $onionName(): 'a-image:redlock';
  }

  export interface MetaVersion {
    /** @internal */
    get scope(): ScopeModuleAImage;
  }

  export interface MetaVersion {
    get $beanFullName(): 'a-image.meta.version';
    get $onionName(): 'a-image:version';
  }
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAImage extends BeanScopeBase {}

export interface ScopeModuleAImage {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config>;
  locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
  entity: IModuleEntity;
  model: IModuleModel;
  redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-image': ScopeModuleAImage;
  }

  export interface IBeanScopeContainer {
    image: ScopeModuleAImage;
  }

  export interface IBeanScopeConfig {
    'a-image': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-image': (typeof locales)[TypeLocaleBase];
  }
}
/** scope: end */
