// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/status.ts';
import type { IEntityOptionsStatus } from '../entity/status.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-status:status': IEntityOptionsStatus;
    }

  
}
declare module 'vona-module-a-status' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityStatus } from '../entity/status.ts';
export interface IModuleEntity {
  'status': EntityStatusMeta;
}
/** entity: end */
/** entity: begin */
export type EntityStatusTableName = 'aStatus';
export type EntityStatusMeta=TypeEntityMeta<EntityStatus,EntityStatusTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aStatus': EntityStatusMeta;
  }
}
declare module 'vona-module-a-status' {
  
    export interface IEntityOptionsStatus {
      fields?: TypeEntityOptionsFields<EntityStatus, IEntityOptionsStatus[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/status.ts';
import type { IModelOptionsStatus } from '../model/status.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-status:status': IModelOptionsStatus;
    }

  
}
declare module 'vona-module-a-status' {
  
        export interface ModelStatus {
          /** @internal */
          get scope(): ScopeModuleAStatus;
        }

          export interface ModelStatus {
            get $beanFullName(): 'a-status.model.status';
            get $onionName(): 'a-status:status';
            get $onionOptions(): IModelOptionsStatus;
          } 
}
/** model: end */
/** model: begin */
import type { ModelStatus } from '../model/status.ts';
export interface IModuleModel {
  'status': ModelStatus;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-status.model.status': ModelStatus;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-status' {
  
  export interface ModelStatus {
      [SymbolKeyEntity]: EntityStatus;
      [SymbolKeyEntityMeta]: EntityStatusMeta;
      [SymbolKeyModelOptions]: IModelOptionsStatus;
      get<T extends IModelGetOptions<EntityStatus,ModelStatus>>(where: TypeModelWhere<EntityStatus>, options?: T): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStatus,ModelStatus>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStatus, ModelStatus, T>>;
      select<T extends IModelSelectParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T>[]>;
      insert<T extends IModelInsertOptions<EntityStatus,ModelStatus>>(data?: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStatus,ModelStatus>>(items: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStatus,ModelStatus>>(data: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStatus,ModelStatus>>(items: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStatus,ModelStatus>>(where?: TypeModelWhere<EntityStatus>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStatus,ModelStatus>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStatus,ModelStatus>>(data?: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStatus,ModelStatus>>(items: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T>[]>;
      count<T extends IModelSelectCountParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStatus, T>[]>;
      getById<T extends IModelGetOptions<EntityStatus,ModelStatus>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStatus,ModelStatus>>(id: number, data: TypeModelMutateRelationData<EntityStatus,ModelStatus, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStatus,ModelStatus, T>>;
deleteById<T extends IModelDeleteOptions<EntityStatus,ModelStatus>>(id: number, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityStatus,ModelStatus>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityStatus,ModelStatus>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityStatus,ModelStatus,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStatus, ModelStatus, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-status:status': ModelStatus;
  }
}
/** model: end */
/** meta: begin */
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-status:redlock': never;
'a-status:version': never;
    }

  
}
declare module 'vona-module-a-status' {
  
        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAStatus;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-status.meta.redlock';
            get $onionName(): 'a-status:redlock';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAStatus;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-status.meta.version';
            get $onionName(): 'a-status:version';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAStatus extends BeanScopeBase {}

export interface ScopeModuleAStatus {
  util: BeanScopeUtil;
entity: IModuleEntity;
model: IModuleModel;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-status': ScopeModuleAStatus;
  }

  export interface IBeanScopeContainer {
    status: ScopeModuleAStatus;
  }
  
  

  

  
}
/** scope: end */
