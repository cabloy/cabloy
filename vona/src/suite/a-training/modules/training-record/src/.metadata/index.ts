// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationHasMany } from 'vona-module-a-orm';
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
export * from '../dto/recordBase.tsx';
export * from '../dto/recordCreate.tsx';
export * from '../dto/recordSelectReq.tsx';
export * from '../dto/recordSelectRes.tsx';
export * from '../dto/recordSelectResItem.tsx';
export * from '../dto/recordSubjectBase.tsx';
export * from '../dto/recordSubjectMutate.tsx';
export * from '../dto/recordSubjectResItem.tsx';
export * from '../dto/recordSubjectView.tsx';
export * from '../dto/recordUpdate.tsx';
export * from '../dto/recordView.tsx';
import type { IDtoOptionsRecordBase } from '../dto/recordBase.tsx';
import type { IDtoOptionsRecordCreate } from '../dto/recordCreate.tsx';
import type { IDtoOptionsRecordSelectReq } from '../dto/recordSelectReq.tsx';
import type { IDtoOptionsRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { IDtoOptionsRecordSelectResItem } from '../dto/recordSelectResItem.tsx';
import type { IDtoOptionsRecordSubjectBase } from '../dto/recordSubjectBase.tsx';
import type { IDtoOptionsRecordSubjectMutate } from '../dto/recordSubjectMutate.tsx';
import type { IDtoOptionsRecordSubjectResItem } from '../dto/recordSubjectResItem.tsx';
import type { IDtoOptionsRecordSubjectView } from '../dto/recordSubjectView.tsx';
import type { IDtoOptionsRecordUpdate } from '../dto/recordUpdate.tsx';
import type { IDtoOptionsRecordView } from '../dto/recordView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'training-record:recordBase': IDtoOptionsRecordBase;
'training-record:recordCreate': IDtoOptionsRecordCreate;
'training-record:recordSelectReq': IDtoOptionsRecordSelectReq;
'training-record:recordSelectRes': IDtoOptionsRecordSelectRes;
'training-record:recordSelectResItem': IDtoOptionsRecordSelectResItem;
'training-record:recordSubjectBase': IDtoOptionsRecordSubjectBase;
'training-record:recordSubjectMutate': IDtoOptionsRecordSubjectMutate;
'training-record:recordSubjectResItem': IDtoOptionsRecordSubjectResItem;
'training-record:recordSubjectView': IDtoOptionsRecordSubjectView;
'training-record:recordUpdate': IDtoOptionsRecordUpdate;
'training-record:recordView': IDtoOptionsRecordView;
    }

  
}
declare module 'vona-module-training-record' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoRecordBase } from '../dto/recordBase.tsx';
import type { DtoRecordCreate } from '../dto/recordCreate.tsx';
import type { DtoRecordSelectReq } from '../dto/recordSelectReq.tsx';
import type { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import type { DtoRecordSelectResItem } from '../dto/recordSelectResItem.tsx';
import type { DtoRecordSubjectBase } from '../dto/recordSubjectBase.tsx';
import type { DtoRecordSubjectMutate } from '../dto/recordSubjectMutate.tsx';
import type { DtoRecordSubjectResItem } from '../dto/recordSubjectResItem.tsx';
import type { DtoRecordSubjectView } from '../dto/recordSubjectView.tsx';
import type { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import type { DtoRecordView } from '../dto/recordView.tsx';
declare module 'vona-module-training-record' {
  
    export interface IDtoOptionsRecordBase {
      fields?: TypeEntityOptionsFields<DtoRecordBase, IDtoOptionsRecordBase[TypeSymbolKeyFieldsMore]>;
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

    export interface IDtoOptionsRecordSubjectBase {
      fields?: TypeEntityOptionsFields<DtoRecordSubjectBase, IDtoOptionsRecordSubjectBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSubjectMutate {
      fields?: TypeEntityOptionsFields<DtoRecordSubjectMutate, IDtoOptionsRecordSubjectMutate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSubjectResItem {
      fields?: TypeEntityOptionsFields<DtoRecordSubjectResItem, IDtoOptionsRecordSubjectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRecordSubjectView {
      fields?: TypeEntityOptionsFields<DtoRecordSubjectView, IDtoOptionsRecordSubjectView[TypeSymbolKeyFieldsMore]>;
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
