// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
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
