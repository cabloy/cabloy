// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/datasource.ts';
import type { IEntityOptionsDatasource } from '../entity/datasource.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-datasource:datasource': IEntityOptionsDatasource;
    }

  
}
declare module 'vona-module-a-datasource' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityDatasource } from '../entity/datasource.ts';
export interface IModuleEntity {
  'datasource': EntityDatasourceMeta;
}
/** entity: end */
/** entity: begin */
export type EntityDatasourceTableName = 'aDatasource';
export type EntityDatasourceMeta=TypeEntityMeta<EntityDatasource,EntityDatasourceTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aDatasource': EntityDatasourceMeta;
  }
}
declare module 'vona-module-a-datasource' {
  
    export interface IEntityOptionsDatasource {
      fields?: TypeEntityOptionsFields<EntityDatasource, IEntityOptionsDatasource[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/datasource.ts';
import type { IModelOptionsDatasource } from '../model/datasource.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-datasource:datasource': IModelOptionsDatasource;
    }

  
}
declare module 'vona-module-a-datasource' {
  
        export interface ModelDatasource {
          /** @internal */
          get scope(): ScopeModuleADatasource;
        }

          export interface ModelDatasource {
            get $beanFullName(): 'a-datasource.model.datasource';
            get $onionName(): 'a-datasource:datasource';
            get $onionOptions(): IModelOptionsDatasource;
          } 
}
/** model: end */
/** model: begin */
import type { ModelDatasource } from '../model/datasource.ts';
export interface IModuleModel {
  'datasource': ModelDatasource;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-datasource.model.datasource': ModelDatasource;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-datasource' {
  
  export interface ModelDatasource {
      [SymbolKeyEntity]: EntityDatasource;
      [SymbolKeyEntityMeta]: EntityDatasourceMeta;
      [SymbolKeyModelOptions]: IModelOptionsDatasource;
      get<T extends IModelGetOptions<EntityDatasource,ModelDatasource>>(where: TypeModelWhere<EntityDatasource>, options?: T): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T> | undefined>;
      mget<T extends IModelGetOptions<EntityDatasource,ModelDatasource>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityDatasource, ModelDatasource, T>>;
      select<T extends IModelSelectParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T>[]>;
      insert<T extends IModelInsertOptions<EntityDatasource,ModelDatasource>>(data?: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityDatasource,ModelDatasource>>(items: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityDatasource,ModelDatasource>>(data: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityDatasource,ModelDatasource>>(items: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>[]>;
      delete<T extends IModelDeleteOptions<EntityDatasource,ModelDatasource>>(where?: TypeModelWhere<EntityDatasource>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityDatasource,ModelDatasource>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityDatasource,ModelDatasource>>(data?: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityDatasource,ModelDatasource>>(items: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>[]>;
      count<T extends IModelSelectCountParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityDatasource, T>[]>;
      getById<T extends IModelGetOptions<EntityDatasource,ModelDatasource>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityDatasource,ModelDatasource>>(id: number, data: TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDatasource,ModelDatasource, T>>;
deleteById<T extends IModelDeleteOptions<EntityDatasource,ModelDatasource>>(id: number, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityDatasource,ModelDatasource>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityDatasource,ModelDatasource>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityDatasource,ModelDatasource,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDatasource, ModelDatasource, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-datasource:datasource': ModelDatasource;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.datasource.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-datasource' {
  
        export interface BeanDatasource {
          /** @internal */
          get scope(): ScopeModuleADatasource;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanDatasource } from '../bean/bean.datasource.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'datasource': BeanDatasource;
  }
}
/** bean: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-datasource:version': never;
    }

  
}
declare module 'vona-module-a-datasource' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleADatasource;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-datasource.meta.version';
            get $onionName(): 'a-datasource:version';
            
          } 
}
/** meta: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleADatasource extends BeanScopeBase {}

export interface ScopeModuleADatasource {
  util: BeanScopeUtil;
entity: IModuleEntity;
model: IModuleModel;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-datasource': ScopeModuleADatasource;
  }

  export interface IBeanScopeContainer {
    datasource: ScopeModuleADatasource;
  }
  
  

  

  
}
/** scope: end */
