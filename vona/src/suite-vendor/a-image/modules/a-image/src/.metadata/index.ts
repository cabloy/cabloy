// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
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
declare module 'vona-module-a-image' {

}
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
export type EntityImageMeta=TypeEntityMeta<EntityImage,EntityImageTableName>;
export type EntityImageProviderMeta=TypeEntityMeta<EntityImageProvider,EntityImageProviderTableName>;
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
      fields?: TypeEntityOptionsFields<EntityImageProvider, IEntityOptionsImageProvider[TypeSymbolKeyFieldsMore]>;
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
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-image' {

  export interface ModelImage {
      [SymbolKeyEntity]: EntityImage;
      [SymbolKeyEntityMeta]: EntityImageMeta;
      [SymbolKeyModelOptions]: IModelOptionsImage;
      get<T extends IModelGetOptions<EntityImage,ModelImage>>(where: TypeModelWhere<EntityImage>, options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T> | undefined>;
      mget<T extends IModelGetOptions<EntityImage,ModelImage>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityImage, ModelImage, T>>;
      select<T extends IModelSelectParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityImage, ModelImage, T>[]>;
      insert<T extends IModelInsertOptions<EntityImage,ModelImage>>(data?: TypeModelMutateRelationData<EntityImage,ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityImage,ModelImage>>(items: TypeModelMutateRelationData<EntityImage,ModelImage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityImage,ModelImage>>(data: TypeModelMutateRelationData<EntityImage,ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityImage,ModelImage>>(items: TypeModelMutateRelationData<EntityImage,ModelImage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T>[]>;
      delete<T extends IModelDeleteOptions<EntityImage,ModelImage>>(where?: TypeModelWhere<EntityImage>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityImage,ModelImage>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityImage,ModelImage>>(data?: TypeModelMutateRelationData<EntityImage,ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityImage,ModelImage>>(items: TypeModelMutateRelationData<EntityImage,ModelImage, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T>[]>;
      count<T extends IModelSelectCountParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityImage,ModelImage,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityImage, T>[]>;
      getById<T extends IModelGetOptions<EntityImage,ModelImage>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityImage, ModelImage, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityImage,ModelImage>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityImage,ModelImage, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImage,ModelImage, T>>;
deleteById<T extends IModelDeleteOptions<EntityImage,ModelImage>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelImageProvider {
      [SymbolKeyEntity]: EntityImageProvider;
      [SymbolKeyEntityMeta]: EntityImageProviderMeta;
      [SymbolKeyModelOptions]: IModelOptionsImageProvider;
      get<T extends IModelGetOptions<EntityImageProvider,ModelImageProvider>>(where: TypeModelWhere<EntityImageProvider>, options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T> | undefined>;
      mget<T extends IModelGetOptions<EntityImageProvider,ModelImageProvider>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityImageProvider, ModelImageProvider, T>>;
      select<T extends IModelSelectParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T>[]>;
      insert<T extends IModelInsertOptions<EntityImageProvider,ModelImageProvider>>(data?: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityImageProvider,ModelImageProvider>>(items: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityImageProvider,ModelImageProvider>>(data: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityImageProvider,ModelImageProvider>>(items: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>[]>;
      delete<T extends IModelDeleteOptions<EntityImageProvider,ModelImageProvider>>(where?: TypeModelWhere<EntityImageProvider>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityImageProvider,ModelImageProvider>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityImageProvider,ModelImageProvider>>(data?: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityImageProvider,ModelImageProvider>>(items: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>[]>;
      count<T extends IModelSelectCountParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityImageProvider, T>[]>;
      getById<T extends IModelGetOptions<EntityImageProvider,ModelImageProvider>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityImageProvider,ModelImageProvider>>(id: number, data: TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityImageProvider,ModelImageProvider, T>>;
deleteById<T extends IModelDeleteOptions<EntityImageProvider,ModelImageProvider>>(id: number, options?: T): Promise<void>;
getByDisabled<T extends IModelGetOptions<EntityImageProvider,ModelImageProvider>>(disabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T> | undefined>;
selectByDisabled<T extends IModelSelectParams<EntityImageProvider,ModelImageProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(disabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityImageProvider, ModelImageProvider, T>[]>;
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
export * from '../bean/bean.imageUploadPolicy.ts';

import 'vona';
declare module 'vona' {


}
declare module 'vona-module-a-image' {

        export interface BeanImage {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

        export interface BeanImageProvider {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

        export interface BeanImageUploadPolicy {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }
}
/** bean: end */
/** bean: begin */
import type { BeanImage } from '../bean/bean.image.ts';
import type { BeanImageProvider } from '../bean/bean.imageProvider.ts';
import type { BeanImageUploadPolicy } from '../bean/bean.imageUploadPolicy.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'image': BeanImage;
    'imageProvider': BeanImageProvider;
    'imageUploadPolicy': BeanImageUploadPolicy;
  }
}
/** bean: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'a-image:index': IMetaOptionsIndex;
'a-image:redlock': never;
'a-image:version': never;
    }


}
declare module 'vona-module-a-image' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

          export interface MetaIndex {
            get $beanFullName(): 'a-image.meta.index';
            get $onionName(): 'a-image:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

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
/** meta index: begin */
import type { MetaIndex } from '../bean/meta.index.ts';
/** meta index: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** schedule: begin */
export * from '../bean/schedule.imageDraftPrune.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {

    export interface IScheduleRecord {
      'a-image:imageDraftPrune': IDecoratorScheduleOptions;
    }


}
declare module 'vona-module-a-image' {

        export interface ScheduleImageDraftPrune {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

          export interface ScheduleImageDraftPrune {
            get $beanFullName(): 'a-image.schedule.imageDraftPrune';
            get $onionName(): 'a-image:imageDraftPrune';
            get $onionOptions(): IDecoratorScheduleOptions;
          }
}
/** schedule: end */
/** serializerTransform: begin */
export * from '../bean/serializerTransform.resolveView.ts';
export * from '../bean/serializerTransform.resolveViews.ts';
import type { ISerializerTransformOptionsResolveView } from '../bean/serializerTransform.resolveView.ts';
import type { ISerializerTransformOptionsResolveViews } from '../bean/serializerTransform.resolveViews.ts';
import 'vona-module-a-serialization';
declare module 'vona-module-a-serialization' {

    export interface ISerializerTransformRecord {
      'a-image:resolveView': ISerializerTransformOptionsResolveView;
'a-image:resolveViews': ISerializerTransformOptionsResolveViews;
    }


}
declare module 'vona-module-a-image' {

        export interface SerializerTransformResolveView {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

          export interface SerializerTransformResolveView {
            get $beanFullName(): 'a-image.serializerTransform.resolveView';
            get $onionName(): 'a-image:resolveView';
            get $onionOptions(): ISerializerTransformOptionsResolveView;
          }

        export interface SerializerTransformResolveViews {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

          export interface SerializerTransformResolveViews {
            get $beanFullName(): 'a-image.serializerTransform.resolveViews';
            get $onionName(): 'a-image:resolveViews';
            get $onionOptions(): ISerializerTransformOptionsResolveViews;
          }
}
/** serializerTransform: end */
/** dto: begin */
export * from '../dto/imageDeliveryRequest.ts';
export * from '../dto/imageDirectUploadFinalizeRequest.ts';
export * from '../dto/imageDirectUploadFinalizeResponse.ts';
export * from '../dto/imageDirectUploadRequest.ts';
export * from '../dto/imageDirectUploadResponse.ts';
export * from '../dto/imageTransformOptions.tsx';
export * from '../dto/imageUploadResponse.ts';
export * from '../dto/imageUploadTokenRequest.ts';
export * from '../dto/imageUploadTokenResponse.ts';
export * from '../dto/imageUploadUrlRequest.ts';
export * from '../dto/imageView.ts';
import type { IDtoOptionsImageDeliveryRequest } from '../dto/imageDeliveryRequest.ts';
import type { IDtoOptionsImageDirectUploadFinalizeRequest } from '../dto/imageDirectUploadFinalizeRequest.ts';
import type { IDtoOptionsImageDirectUploadFinalizeResponse } from '../dto/imageDirectUploadFinalizeResponse.ts';
import type { IDtoOptionsImageDirectUploadRequest } from '../dto/imageDirectUploadRequest.ts';
import type { IDtoOptionsImageDirectUploadResponse } from '../dto/imageDirectUploadResponse.ts';
import type { IDtoOptionsImageTransformOptions } from '../dto/imageTransformOptions.tsx';
import type { IDtoOptionsImageUploadResponse } from '../dto/imageUploadResponse.ts';
import type { IDtoOptionsImageUploadTokenRequest } from '../dto/imageUploadTokenRequest.ts';
import type { IDtoOptionsImageUploadTokenResponse } from '../dto/imageUploadTokenResponse.ts';
import type { IDtoOptionsImageUploadUrlRequest } from '../dto/imageUploadUrlRequest.ts';
import type { IDtoOptionsImageView } from '../dto/imageView.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'a-image:imageDeliveryRequest': IDtoOptionsImageDeliveryRequest;
'a-image:imageDirectUploadFinalizeRequest': IDtoOptionsImageDirectUploadFinalizeRequest;
'a-image:imageDirectUploadFinalizeResponse': IDtoOptionsImageDirectUploadFinalizeResponse;
'a-image:imageDirectUploadRequest': IDtoOptionsImageDirectUploadRequest;
'a-image:imageDirectUploadResponse': IDtoOptionsImageDirectUploadResponse;
'a-image:imageTransformOptions': IDtoOptionsImageTransformOptions;
'a-image:imageUploadResponse': IDtoOptionsImageUploadResponse;
'a-image:imageUploadTokenRequest': IDtoOptionsImageUploadTokenRequest;
'a-image:imageUploadTokenResponse': IDtoOptionsImageUploadTokenResponse;
'a-image:imageUploadUrlRequest': IDtoOptionsImageUploadUrlRequest;
'a-image:imageView': IDtoOptionsImageView;
    }


}
declare module 'vona-module-a-image' {

}
/** dto: end */
/** dto: begin */
import type { DtoImageDeliveryRequest } from '../dto/imageDeliveryRequest.ts';
import type { DtoImageDirectUploadFinalizeRequest } from '../dto/imageDirectUploadFinalizeRequest.ts';
import type { DtoImageDirectUploadFinalizeResponse } from '../dto/imageDirectUploadFinalizeResponse.ts';
import type { DtoImageDirectUploadRequest } from '../dto/imageDirectUploadRequest.ts';
import type { DtoImageDirectUploadResponse } from '../dto/imageDirectUploadResponse.ts';
import type { DtoImageTransformOptions } from '../dto/imageTransformOptions.tsx';
import type { DtoImageUploadResponse } from '../dto/imageUploadResponse.ts';
import type { DtoImageUploadTokenRequest } from '../dto/imageUploadTokenRequest.ts';
import type { DtoImageUploadTokenResponse } from '../dto/imageUploadTokenResponse.ts';
import type { DtoImageUploadUrlRequest } from '../dto/imageUploadUrlRequest.ts';
import type { DtoImageView } from '../dto/imageView.ts';
declare module 'vona-module-a-image' {

    export interface IDtoOptionsImageDeliveryRequest {
      fields?: TypeEntityOptionsFields<DtoImageDeliveryRequest, IDtoOptionsImageDeliveryRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageDirectUploadFinalizeRequest {
      fields?: TypeEntityOptionsFields<DtoImageDirectUploadFinalizeRequest, IDtoOptionsImageDirectUploadFinalizeRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageDirectUploadFinalizeResponse {
      fields?: TypeEntityOptionsFields<DtoImageDirectUploadFinalizeResponse, IDtoOptionsImageDirectUploadFinalizeResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageDirectUploadRequest {
      fields?: TypeEntityOptionsFields<DtoImageDirectUploadRequest, IDtoOptionsImageDirectUploadRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageDirectUploadResponse {
      fields?: TypeEntityOptionsFields<DtoImageDirectUploadResponse, IDtoOptionsImageDirectUploadResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageTransformOptions {
      fields?: TypeEntityOptionsFields<DtoImageTransformOptions, IDtoOptionsImageTransformOptions[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageUploadResponse {
      fields?: TypeEntityOptionsFields<DtoImageUploadResponse, IDtoOptionsImageUploadResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageUploadTokenRequest {
      fields?: TypeEntityOptionsFields<DtoImageUploadTokenRequest, IDtoOptionsImageUploadTokenRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageUploadTokenResponse {
      fields?: TypeEntityOptionsFields<DtoImageUploadTokenResponse, IDtoOptionsImageUploadTokenResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageUploadUrlRequest {
      fields?: TypeEntityOptionsFields<DtoImageUploadUrlRequest, IDtoOptionsImageUploadUrlRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsImageView {
      fields?: TypeEntityOptionsFields<DtoImageView, IDtoOptionsImageView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/image.ts';
import type { IControllerOptionsImage } from '../controller/image.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'a-image:image': IControllerOptionsImage;
    }


}
declare module 'vona-module-a-image' {

        export interface ControllerImage {
          /** @internal */
          get scope(): ScopeModuleAImage;
        }

          export interface ControllerImage {
            get $beanFullName(): 'a-image.controller.image';
            get $onionName(): 'a-image:image';
            get $onionOptions(): IControllerOptionsImage;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerImage } from '../controller/image.ts';
declare module 'vona-module-a-image' {

    export interface IControllerOptionsImage {
      actions?: TypeControllerOptionsActions<ControllerImage>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/image/upload-token': undefined;
'/image/upload': undefined;
'/image/direct-upload': undefined;
'/image/direct-upload/finalize': undefined;
'/image/upload-url': undefined;
    }
export interface IApiPathGetRecord{
        '/image/delivery/:imageId': undefined;
    }

}

/** controller: end */
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
