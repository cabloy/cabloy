// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsTo,IModelRelationHasMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/record.tsx';
import type { IEntityOptionsRecord } from '../entity/record.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'training-record:record': IEntityOptionsRecord;
    }

  
}
declare module 'vona-module-training-record' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityRecord } from '../entity/record.tsx';
export interface IModuleEntity {
  'record': EntityRecordMeta;
}
/** entity: end */
/** entity: begin */
export type EntityRecordTableName = 'trainingRecord';
export type EntityRecordMeta=TypeEntityMeta<EntityRecord,EntityRecordTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'trainingRecord': EntityRecordMeta;
  }
}
declare module 'vona-module-training-record' {
  
    export interface IEntityOptionsRecord {
      fields?: TypeEntityOptionsFields<EntityRecord, IEntityOptionsRecord[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/record.ts';
import type { IModelOptionsRecord } from '../model/record.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'training-record:record': IModelOptionsRecord;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface ModelRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface ModelRecord {
            get $beanFullName(): 'training-record.model.record';
            get $onionName(): 'training-record:record';
            get $onionOptions(): IModelOptionsRecord;
          } 
}
/** model: end */
/** model: begin */
import type { ModelRecord } from '../model/record.ts';
export interface IModuleModel {
  'record': ModelRecord;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'training-record.model.record': ModelRecord;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-training-record' {
  export interface IModelOptionsRecord {
        relations: {
          student: IModelRelationBelongsTo<'training-record:record', 'training-student:student', false, 'id'|'name'>;
trainingRecordSubjects: IModelRelationHasMany<'training-recordsubject:subject', 'recordId', false, 'id'|'name'|'score'|'description', undefined, undefined, undefined>;
        };
      }
  export interface ModelRecord {
      [SymbolKeyEntity]: EntityRecord;
      [SymbolKeyEntityMeta]: EntityRecordMeta;
      [SymbolKeyModelOptions]: IModelOptionsRecord;
      get<T extends IModelGetOptions<EntityRecord,ModelRecord>>(where: TypeModelWhere<EntityRecord>, options?: T): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRecord,ModelRecord>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRecord, ModelRecord, T>>;
      select<T extends IModelSelectParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T>[]>;
      insert<T extends IModelInsertOptions<EntityRecord,ModelRecord>>(data?: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRecord,ModelRecord>>(items: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRecord,ModelRecord>>(data: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRecord,ModelRecord>>(items: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRecord,ModelRecord>>(where?: TypeModelWhere<EntityRecord>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRecord,ModelRecord>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRecord,ModelRecord>>(data?: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRecord,ModelRecord>>(items: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T>[]>;
      count<T extends IModelSelectCountParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRecord, T>[]>;
      getById<T extends IModelGetOptions<EntityRecord,ModelRecord>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRecord,ModelRecord>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRecord,ModelRecord, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRecord,ModelRecord, T>>;
deleteById<T extends IModelDeleteOptions<EntityRecord,ModelRecord>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityRecord,ModelRecord>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityRecord,ModelRecord>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityRecord,ModelRecord,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRecord, ModelRecord, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'training-record:record': ModelRecord;
  }
}
/** model: end */
/** service: begin */
export * from '../service/record.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'training-record:record': never;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface ServiceRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface ServiceRecord {
            get $beanFullName(): 'training-record.service.record';
            get $onionName(): 'training-record:record';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceRecord } from '../service/record.ts';
export interface IModuleService {
  'record': ServiceRecord;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'training-record.service.record': ServiceRecord;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'training-record:index': IMetaOptionsIndex;
'training-record:version': never;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface MetaIndex {
            get $beanFullName(): 'training-record.meta.index';
            get $onionName(): 'training-record:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface MetaVersion {
            get $beanFullName(): 'training-record.meta.version';
            get $onionName(): 'training-record:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/detailRecordSubjectBase.tsx';
export * from '../dto/detailRecordSubjectMutate.tsx';
export * from '../dto/detailRecordSubjectResItem.tsx';
export * from '../dto/detailRecordSubjectView.tsx';
export * from '../dto/recordCreate.tsx';
export * from '../dto/recordSelectReq.tsx';
export * from '../dto/recordSelectRes.tsx';
export * from '../dto/recordSelectResItem.tsx';
export * from '../dto/recordUpdate.tsx';
export * from '../dto/recordView.tsx';
import type { IDtoOptionsDetailRecordSubjectBase } from '../dto/detailRecordSubjectBase.tsx';
import type { IDtoOptionsDetailRecordSubjectMutate } from '../dto/detailRecordSubjectMutate.tsx';
import type { IDtoOptionsDetailRecordSubjectResItem } from '../dto/detailRecordSubjectResItem.tsx';
import type { IDtoOptionsDetailRecordSubjectView } from '../dto/detailRecordSubjectView.tsx';
import type { IDtoOptionsRecordCreate } from '../dto/recordCreate.tsx';
import type { IDtoOptionsRecordSelectReq } from '../dto/recordSelectReq.tsx';
import type { IDtoOptionsRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { IDtoOptionsRecordSelectResItem } from '../dto/recordSelectResItem.tsx';
import type { IDtoOptionsRecordUpdate } from '../dto/recordUpdate.tsx';
import type { IDtoOptionsRecordView } from '../dto/recordView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'training-record:detailRecordSubjectBase': IDtoOptionsDetailRecordSubjectBase;
'training-record:detailRecordSubjectMutate': IDtoOptionsDetailRecordSubjectMutate;
'training-record:detailRecordSubjectResItem': IDtoOptionsDetailRecordSubjectResItem;
'training-record:detailRecordSubjectView': IDtoOptionsDetailRecordSubjectView;
'training-record:recordCreate': IDtoOptionsRecordCreate;
'training-record:recordSelectReq': IDtoOptionsRecordSelectReq;
'training-record:recordSelectRes': IDtoOptionsRecordSelectRes;
'training-record:recordSelectResItem': IDtoOptionsRecordSelectResItem;
'training-record:recordUpdate': IDtoOptionsRecordUpdate;
'training-record:recordView': IDtoOptionsRecordView;
    }

  
}
declare module 'vona-module-training-record' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoDetailRecordSubjectBase } from '../dto/detailRecordSubjectBase.tsx';
import type { DtoDetailRecordSubjectMutate } from '../dto/detailRecordSubjectMutate.tsx';
import type { DtoDetailRecordSubjectResItem } from '../dto/detailRecordSubjectResItem.tsx';
import type { DtoDetailRecordSubjectView } from '../dto/detailRecordSubjectView.tsx';
import type { DtoRecordCreate } from '../dto/recordCreate.tsx';
import type { DtoRecordSelectReq } from '../dto/recordSelectReq.tsx';
import type { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { DtoRecordSelectResItem } from '../dto/recordSelectResItem.tsx';
import type { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import type { DtoRecordView } from '../dto/recordView.tsx';
declare module 'vona-module-training-record' {
  
    export interface IDtoOptionsDetailRecordSubjectBase {
      fields?: TypeEntityOptionsFields<DtoDetailRecordSubjectBase, IDtoOptionsDetailRecordSubjectBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDetailRecordSubjectMutate {
      fields?: TypeEntityOptionsFields<DtoDetailRecordSubjectMutate, IDtoOptionsDetailRecordSubjectMutate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDetailRecordSubjectResItem {
      fields?: TypeEntityOptionsFields<DtoDetailRecordSubjectResItem, IDtoOptionsDetailRecordSubjectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDetailRecordSubjectView {
      fields?: TypeEntityOptionsFields<DtoDetailRecordSubjectView, IDtoOptionsDetailRecordSubjectView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordCreate {
      fields?: TypeEntityOptionsFields<DtoRecordCreate, IDtoOptionsRecordCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSelectReq {
      fields?: TypeEntityOptionsFields<DtoRecordSelectReq, IDtoOptionsRecordSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSelectRes {
      fields?: TypeEntityOptionsFields<DtoRecordSelectRes, IDtoOptionsRecordSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSelectResItem {
      fields?: TypeEntityOptionsFields<DtoRecordSelectResItem, IDtoOptionsRecordSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordUpdate {
      fields?: TypeEntityOptionsFields<DtoRecordUpdate, IDtoOptionsRecordUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordView {
      fields?: TypeEntityOptionsFields<DtoRecordView, IDtoOptionsRecordView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/record.ts';
import type { IControllerOptionsRecord } from '../controller/record.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'training-record:record': IControllerOptionsRecord;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface ControllerRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface ControllerRecord {
            get $beanFullName(): 'training-record.controller.record';
            get $onionName(): 'training-record:record';
            get $onionOptions(): IControllerOptionsRecord;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRecord } from '../controller/record.ts';
declare module 'vona-module-training-record' {
  
    export interface IControllerOptionsRecord {
      actions?: TypeControllerOptionsActions<ControllerRecord>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/training/record': undefined;
    }
export interface IApiPathGetRecord{
        '/training/record': undefined;
'/training/record/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/training/record/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/training/record/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'training-record:record': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.record.ts';
import type { ISsrMenuOptionsRecord } from '../bean/ssrMenu.record.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'training-record:record': ISsrMenuOptionsRecord;
    }

  
}
declare module 'vona-module-training-record' {
  
        export interface SsrMenuRecord {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface SsrMenuRecord {
            get $beanFullName(): 'training-record.ssrMenu.record';
            get $onionName(): 'training-record:record';
            get $onionOptions(): ISsrMenuOptionsRecord;
          } 
}
/** ssrMenu: end */
/** fileScene: begin */
export * from '../bean/fileScene.dossierFile.ts';

import { type IDecoratorFileSceneOptions } from 'vona-module-a-file';
declare module 'vona-module-a-file' {

    export interface IFileSceneRecord {
      'training-record:dossierFile': IDecoratorFileSceneOptions;
    }


}
declare module 'vona-module-training-record' {

        export interface FileSceneDossierFile {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface FileSceneDossierFile {
            get $beanFullName(): 'training-record.fileScene.dossierFile';
            get $onionName(): 'training-record:dossierFile';
            get $onionOptions(): IDecoratorFileSceneOptions;
          }
}
/** fileScene: end */
/** imageScene: begin */
export * from '../bean/imageScene.sceneImage.ts';

import { type IDecoratorImageSceneOptions } from 'vona-module-a-image';
declare module 'vona-module-a-image' {

    export interface IImageSceneRecord {
      'training-record:sceneImage': IDecoratorImageSceneOptions;
    }


}
declare module 'vona-module-training-record' {

        export interface ImageSceneSceneImage {
          /** @internal */
          get scope(): ScopeModuleTrainingRecord;
        }

          export interface ImageSceneSceneImage {
            get $beanFullName(): 'training-record.imageScene.sceneImage';
            get $onionName(): 'training-record:sceneImage';
            get $onionOptions(): IDecoratorImageSceneOptions;
          }
}
/** imageScene: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTrainingRecord extends BeanScopeBase {}

export interface ScopeModuleTrainingRecord {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'training-record': ScopeModuleTrainingRecord;
  }

  export interface IBeanScopeContainer {
    trainingRecord: ScopeModuleTrainingRecord;
  }
  
  

  export interface IBeanScopeLocale {
    'training-record': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
