// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/file.ts';
export * from '../entity/fileProvider.ts';
import type { IEntityOptionsFile } from '../entity/file.ts';
import type { IEntityOptionsFileProvider } from '../entity/fileProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-file:file': IEntityOptionsFile;
'a-file:fileProvider': IEntityOptionsFileProvider;
    }

  
}
declare module 'vona-module-a-file' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityFile } from '../entity/file.ts';
import type { EntityFileProvider } from '../entity/fileProvider.ts';
export interface IModuleEntity {
  'file': EntityFileMeta;
'fileProvider': EntityFileProviderMeta;
}
/** entity: end */
/** entity: begin */
export type EntityFileTableName = 'aFile';
export type EntityFileProviderTableName = 'aFileProvider';
export type EntityFileMeta=TypeEntityMeta<EntityFile,EntityFileTableName>;
export type EntityFileProviderMeta=TypeEntityMeta<EntityFileProvider,EntityFileProviderTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aFile': EntityFileMeta;
'aFileProvider': EntityFileProviderMeta;
  }
}
declare module 'vona-module-a-file' {
  
    export interface IEntityOptionsFile {
      fields?: TypeEntityOptionsFields<EntityFile, IEntityOptionsFile[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsFileProvider {
      fields?: TypeEntityOptionsFields<EntityFileProvider, IEntityOptionsFileProvider[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/file.ts';
export * from '../model/fileProvider.ts';
import type { IModelOptionsFile } from '../model/file.ts';
import type { IModelOptionsFileProvider } from '../model/fileProvider.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-file:file': IModelOptionsFile;
'a-file:fileProvider': IModelOptionsFileProvider;
    }

  
}
declare module 'vona-module-a-file' {
  
        export interface ModelFile {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface ModelFile {
            get $beanFullName(): 'a-file.model.file';
            get $onionName(): 'a-file:file';
            get $onionOptions(): IModelOptionsFile;
          }

        export interface ModelFileProvider {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface ModelFileProvider {
            get $beanFullName(): 'a-file.model.fileProvider';
            get $onionName(): 'a-file:fileProvider';
            get $onionOptions(): IModelOptionsFileProvider;
          } 
}
/** model: end */
/** model: begin */
import type { ModelFile } from '../model/file.ts';
import type { ModelFileProvider } from '../model/fileProvider.ts';
export interface IModuleModel {
  'file': ModelFile;
'fileProvider': ModelFileProvider;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-file.model.file': ModelFile;
'a-file.model.fileProvider': ModelFileProvider;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-file' {
  
  export interface ModelFile {
      [SymbolKeyEntity]: EntityFile;
      [SymbolKeyEntityMeta]: EntityFileMeta;
      [SymbolKeyModelOptions]: IModelOptionsFile;
      get<T extends IModelGetOptions<EntityFile,ModelFile>>(where: TypeModelWhere<EntityFile>, options?: T): Promise<TypeModelRelationResult<EntityFile, ModelFile, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityFile,ModelFile>>(where: TypeModelWhere<EntityFile>, options?: T): Promise<TypeModelRelationResult<EntityFile, ModelFile, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityFile,ModelFile>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityFile, ModelFile, T> | undefined>;
      mget<T extends IModelGetOptions<EntityFile,ModelFile>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityFile, ModelFile, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityFile, ModelFile, T>>;
      select<T extends IModelSelectParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityFile, ModelFile, T>[]>;
      insert<T extends IModelInsertOptions<EntityFile,ModelFile>>(data?: TypeModelMutateRelationData<EntityFile,ModelFile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityFile,ModelFile>>(items: TypeModelMutateRelationData<EntityFile,ModelFile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityFile,ModelFile>>(data: TypeModelMutateRelationData<EntityFile,ModelFile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityFile,ModelFile>>(items: TypeModelMutateRelationData<EntityFile,ModelFile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T>[]>;
      delete<T extends IModelDeleteOptions<EntityFile,ModelFile>>(where?: TypeModelWhere<EntityFile>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityFile,ModelFile>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityFile,ModelFile>>(data?: TypeModelMutateRelationData<EntityFile,ModelFile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityFile,ModelFile>>(items: TypeModelMutateRelationData<EntityFile,ModelFile, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T>[]>;
      count<T extends IModelSelectCountParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityFile,ModelFile,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityFile, T>[]>;
      getById<T extends IModelGetOptions<EntityFile,ModelFile>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityFile, ModelFile, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityFile,ModelFile>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityFile,ModelFile, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFile,ModelFile, T>>;
deleteById<T extends IModelDeleteOptions<EntityFile,ModelFile>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelFileProvider {
      [SymbolKeyEntity]: EntityFileProvider;
      [SymbolKeyEntityMeta]: EntityFileProviderMeta;
      [SymbolKeyModelOptions]: IModelOptionsFileProvider;
      get<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(where: TypeModelWhere<EntityFileProvider>, options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(where: TypeModelWhere<EntityFileProvider>, options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T> | undefined>;
      mget<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityFileProvider, ModelFileProvider, T>>;
      select<T extends IModelSelectParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T>[]>;
      insert<T extends IModelInsertOptions<EntityFileProvider,ModelFileProvider>>(data?: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityFileProvider,ModelFileProvider>>(items: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityFileProvider,ModelFileProvider>>(data: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityFileProvider,ModelFileProvider>>(items: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>[]>;
      delete<T extends IModelDeleteOptions<EntityFileProvider,ModelFileProvider>>(where?: TypeModelWhere<EntityFileProvider>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityFileProvider,ModelFileProvider>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityFileProvider,ModelFileProvider>>(data?: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityFileProvider,ModelFileProvider>>(items: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>[]>;
      count<T extends IModelSelectCountParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityFileProvider, T>[]>;
      getById<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityFileProvider,ModelFileProvider>>(id: number, data: TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>, options?: T): Promise<TypeModelMutateRelationData<EntityFileProvider,ModelFileProvider, T>>;
deleteById<T extends IModelDeleteOptions<EntityFileProvider,ModelFileProvider>>(id: number, options?: T): Promise<void>;
getByDisabled<T extends IModelGetOptions<EntityFileProvider,ModelFileProvider>>(disabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T> | undefined>;
selectByDisabled<T extends IModelSelectParams<EntityFileProvider,ModelFileProvider,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(disabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityFileProvider, ModelFileProvider, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-file:file': ModelFile;
'a-file:fileProvider': ModelFileProvider;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.file.ts';
export * from '../bean/bean.fileProvider.ts';
export * from '../bean/bean.fileUploadPolicy.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-file' {
  
        export interface BeanFile {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

        export interface BeanFileProvider {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

        export interface BeanFileUploadPolicy {
          /** @internal */
          get scope(): ScopeModuleAFile;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanFile } from '../bean/bean.file.ts';
import type { BeanFileProvider } from '../bean/bean.fileProvider.ts';
import type { BeanFileUploadPolicy } from '../bean/bean.fileUploadPolicy.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'file': BeanFile;
    'fileProvider': BeanFileProvider;
    'fileUploadPolicy': BeanFileUploadPolicy;
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
      'a-file:index': IMetaOptionsIndex;
'a-file:redlock': never;
'a-file:version': never;
    }

  
}
declare module 'vona-module-a-file' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface MetaIndex {
            get $beanFullName(): 'a-file.meta.index';
            get $onionName(): 'a-file:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-file.meta.redlock';
            get $onionName(): 'a-file:redlock';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-file.meta.version';
            get $onionName(): 'a-file:version';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** schedule: begin */
export * from '../bean/schedule.fileDraftPrune.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {
  
    export interface IScheduleRecord {
      'a-file:fileDraftPrune': IDecoratorScheduleOptions;
    }

  
}
declare module 'vona-module-a-file' {
  
        export interface ScheduleFileDraftPrune {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface ScheduleFileDraftPrune {
            get $beanFullName(): 'a-file.schedule.fileDraftPrune';
            get $onionName(): 'a-file:fileDraftPrune';
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
      'a-file:resolveView': ISerializerTransformOptionsResolveView;
'a-file:resolveViews': ISerializerTransformOptionsResolveViews;
    }

  
}
declare module 'vona-module-a-file' {
  
        export interface SerializerTransformResolveView {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface SerializerTransformResolveView {
            get $beanFullName(): 'a-file.serializerTransform.resolveView';
            get $onionName(): 'a-file:resolveView';
            get $onionOptions(): ISerializerTransformOptionsResolveView;
          }

        export interface SerializerTransformResolveViews {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface SerializerTransformResolveViews {
            get $beanFullName(): 'a-file.serializerTransform.resolveViews';
            get $onionName(): 'a-file:resolveViews';
            get $onionOptions(): ISerializerTransformOptionsResolveViews;
          } 
}
/** serializerTransform: end */
/** dto: begin */
export * from '../dto/fileDirectUploadFinalizeRequest.ts';
export * from '../dto/fileDirectUploadFinalizeResponse.ts';
export * from '../dto/fileDirectUploadRequest.ts';
export * from '../dto/fileDirectUploadResponse.ts';
export * from '../dto/fileDownloadRequest.ts';
export * from '../dto/fileUploadPolicyRequest.ts';
export * from '../dto/fileUploadPolicyResponse.ts';
export * from '../dto/fileUploadResponse.ts';
export * from '../dto/fileUploadTokenRequest.ts';
export * from '../dto/fileUploadTokenResponse.ts';
export * from '../dto/fileUploadUrlRequest.ts';
export * from '../dto/fileView.ts';
import type { IDtoOptionsFileDirectUploadFinalizeRequest } from '../dto/fileDirectUploadFinalizeRequest.ts';
import type { IDtoOptionsFileDirectUploadFinalizeResponse } from '../dto/fileDirectUploadFinalizeResponse.ts';
import type { IDtoOptionsFileDirectUploadRequest } from '../dto/fileDirectUploadRequest.ts';
import type { IDtoOptionsFileDirectUploadResponse } from '../dto/fileDirectUploadResponse.ts';
import type { IDtoOptionsFileDownloadRequest } from '../dto/fileDownloadRequest.ts';
import type { IDtoOptionsFileUploadPolicyRequest } from '../dto/fileUploadPolicyRequest.ts';
import type { IDtoOptionsFileUploadPolicyResponse } from '../dto/fileUploadPolicyResponse.ts';
import type { IDtoOptionsFileUploadResponse } from '../dto/fileUploadResponse.ts';
import type { IDtoOptionsFileUploadTokenRequest } from '../dto/fileUploadTokenRequest.ts';
import type { IDtoOptionsFileUploadTokenResponse } from '../dto/fileUploadTokenResponse.ts';
import type { IDtoOptionsFileUploadUrlRequest } from '../dto/fileUploadUrlRequest.ts';
import type { IDtoOptionsFileView } from '../dto/fileView.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-file:fileDirectUploadFinalizeRequest': IDtoOptionsFileDirectUploadFinalizeRequest;
'a-file:fileDirectUploadFinalizeResponse': IDtoOptionsFileDirectUploadFinalizeResponse;
'a-file:fileDirectUploadRequest': IDtoOptionsFileDirectUploadRequest;
'a-file:fileDirectUploadResponse': IDtoOptionsFileDirectUploadResponse;
'a-file:fileDownloadRequest': IDtoOptionsFileDownloadRequest;
'a-file:fileUploadPolicyRequest': IDtoOptionsFileUploadPolicyRequest;
'a-file:fileUploadPolicyResponse': IDtoOptionsFileUploadPolicyResponse;
'a-file:fileUploadResponse': IDtoOptionsFileUploadResponse;
'a-file:fileUploadTokenRequest': IDtoOptionsFileUploadTokenRequest;
'a-file:fileUploadTokenResponse': IDtoOptionsFileUploadTokenResponse;
'a-file:fileUploadUrlRequest': IDtoOptionsFileUploadUrlRequest;
'a-file:fileView': IDtoOptionsFileView;
    }

  
}
declare module 'vona-module-a-file' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoFileDirectUploadFinalizeRequest } from '../dto/fileDirectUploadFinalizeRequest.ts';
import type { DtoFileDirectUploadFinalizeResponse } from '../dto/fileDirectUploadFinalizeResponse.ts';
import type { DtoFileDirectUploadRequest } from '../dto/fileDirectUploadRequest.ts';
import type { DtoFileDirectUploadResponse } from '../dto/fileDirectUploadResponse.ts';
import type { DtoFileDownloadRequest } from '../dto/fileDownloadRequest.ts';
import type { DtoFileUploadPolicyRequest } from '../dto/fileUploadPolicyRequest.ts';
import type { DtoFileUploadPolicyResponse } from '../dto/fileUploadPolicyResponse.ts';
import type { DtoFileUploadResponse } from '../dto/fileUploadResponse.ts';
import type { DtoFileUploadTokenRequest } from '../dto/fileUploadTokenRequest.ts';
import type { DtoFileUploadTokenResponse } from '../dto/fileUploadTokenResponse.ts';
import type { DtoFileUploadUrlRequest } from '../dto/fileUploadUrlRequest.ts';
import type { DtoFileView } from '../dto/fileView.ts';
declare module 'vona-module-a-file' {
  
    export interface IDtoOptionsFileDirectUploadFinalizeRequest {
      fields?: TypeEntityOptionsFields<DtoFileDirectUploadFinalizeRequest, IDtoOptionsFileDirectUploadFinalizeRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileDirectUploadFinalizeResponse {
      fields?: TypeEntityOptionsFields<DtoFileDirectUploadFinalizeResponse, IDtoOptionsFileDirectUploadFinalizeResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileDirectUploadRequest {
      fields?: TypeEntityOptionsFields<DtoFileDirectUploadRequest, IDtoOptionsFileDirectUploadRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileDirectUploadResponse {
      fields?: TypeEntityOptionsFields<DtoFileDirectUploadResponse, IDtoOptionsFileDirectUploadResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileDownloadRequest {
      fields?: TypeEntityOptionsFields<DtoFileDownloadRequest, IDtoOptionsFileDownloadRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadPolicyRequest {
      fields?: TypeEntityOptionsFields<DtoFileUploadPolicyRequest, IDtoOptionsFileUploadPolicyRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadPolicyResponse {
      fields?: TypeEntityOptionsFields<DtoFileUploadPolicyResponse, IDtoOptionsFileUploadPolicyResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadResponse {
      fields?: TypeEntityOptionsFields<DtoFileUploadResponse, IDtoOptionsFileUploadResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadTokenRequest {
      fields?: TypeEntityOptionsFields<DtoFileUploadTokenRequest, IDtoOptionsFileUploadTokenRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadTokenResponse {
      fields?: TypeEntityOptionsFields<DtoFileUploadTokenResponse, IDtoOptionsFileUploadTokenResponse[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileUploadUrlRequest {
      fields?: TypeEntityOptionsFields<DtoFileUploadUrlRequest, IDtoOptionsFileUploadUrlRequest[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsFileView {
      fields?: TypeEntityOptionsFields<DtoFileView, IDtoOptionsFileView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/file.ts';
import type { IControllerOptionsFile } from '../controller/file.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-file:file': IControllerOptionsFile;
    }

  
}
declare module 'vona-module-a-file' {
  
        export interface ControllerFile {
          /** @internal */
          get scope(): ScopeModuleAFile;
        }

          export interface ControllerFile {
            get $beanFullName(): 'a-file.controller.file';
            get $onionName(): 'a-file:file';
            get $onionOptions(): IControllerOptionsFile;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerFile } from '../controller/file.ts';
declare module 'vona-module-a-file' {
  
    export interface IControllerOptionsFile {
      actions?: TypeControllerOptionsActions<ControllerFile>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/file/upload-policy': undefined;
'/file/upload': undefined;
'/file/direct-upload': undefined;
'/file/direct-upload/finalize': undefined;
'/file/upload-url': undefined;
    }
export interface IApiPathGetRecord{
        '/file/download': undefined;
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
export class ScopeModuleAFile extends BeanScopeBase {}

export interface ScopeModuleAFile {
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
    'a-file': ScopeModuleAFile;
  }

  export interface IBeanScopeContainer {
    file: ScopeModuleAFile;
  }
  
  export interface IBeanScopeConfig {
    'a-file': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'a-file': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
