// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/authSimple.ts';
import type { IEntityOptionsAuthSimple } from '../entity/authSimple.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'auth-simple:authSimple': IEntityOptionsAuthSimple;
    }

  
}
declare module 'vona-module-auth-simple' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityAuthSimple } from '../entity/authSimple.ts';
export interface IModuleEntity {
  'authSimple': EntityAuthSimpleMeta;
}
/** entity: end */
/** entity: begin */
export type EntityAuthSimpleTableName = 'aAuthSimple';
export type EntityAuthSimpleMeta=TypeEntityMeta<EntityAuthSimple,EntityAuthSimpleTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aAuthSimple': EntityAuthSimpleMeta;
  }
}
declare module 'vona-module-auth-simple' {
  
    export interface IEntityOptionsAuthSimple {
      fields?: TypeEntityOptionsFields<EntityAuthSimple, IEntityOptionsAuthSimple[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/authSimple.ts';
import type { IModelOptionsAuthSimple } from '../model/authSimple.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'auth-simple:authSimple': IModelOptionsAuthSimple;
    }

  
}
declare module 'vona-module-auth-simple' {
  
        export interface ModelAuthSimple {
          /** @internal */
          get scope(): ScopeModuleAuthSimple;
        }

          export interface ModelAuthSimple {
            get $beanFullName(): 'auth-simple.model.authSimple';
            get $onionName(): 'auth-simple:authSimple';
            get $onionOptions(): IModelOptionsAuthSimple;
          } 
}
/** model: end */
/** model: begin */
import type { ModelAuthSimple } from '../model/authSimple.ts';
export interface IModuleModel {
  'authSimple': ModelAuthSimple;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'auth-simple.model.authSimple': ModelAuthSimple;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-auth-simple' {
  
  export interface ModelAuthSimple {
      [SymbolKeyEntity]: EntityAuthSimple;
      [SymbolKeyEntityMeta]: EntityAuthSimpleMeta;
      [SymbolKeyModelOptions]: IModelOptionsAuthSimple;
      get<T extends IModelGetOptions<EntityAuthSimple,ModelAuthSimple>>(where: TypeModelWhere<EntityAuthSimple>, options?: T): Promise<TypeModelRelationResult<EntityAuthSimple, ModelAuthSimple, T> | undefined>;
      mget<T extends IModelGetOptions<EntityAuthSimple,ModelAuthSimple>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityAuthSimple, ModelAuthSimple, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityAuthSimple, ModelAuthSimple, T>>;
      select<T extends IModelSelectParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityAuthSimple, ModelAuthSimple, T>[]>;
      insert<T extends IModelInsertOptions<EntityAuthSimple,ModelAuthSimple>>(data?: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityAuthSimple,ModelAuthSimple>>(items: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityAuthSimple,ModelAuthSimple>>(data: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityAuthSimple,ModelAuthSimple>>(items: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>[]>;
      delete<T extends IModelDeleteOptions<EntityAuthSimple,ModelAuthSimple>>(where?: TypeModelWhere<EntityAuthSimple>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityAuthSimple,ModelAuthSimple>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityAuthSimple,ModelAuthSimple>>(data?: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityAuthSimple,ModelAuthSimple>>(items: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>[]>;
      count<T extends IModelSelectCountParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityAuthSimple,ModelAuthSimple,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityAuthSimple, T>[]>;
      getById<T extends IModelGetOptions<EntityAuthSimple,ModelAuthSimple>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityAuthSimple, ModelAuthSimple, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityAuthSimple,ModelAuthSimple>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>, options?: T): Promise<TypeModelMutateRelationData<EntityAuthSimple,ModelAuthSimple, T>>;
deleteById<T extends IModelDeleteOptions<EntityAuthSimple,ModelAuthSimple>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'auth-simple:authSimple': ModelAuthSimple;
  }
}
/** model: end */
/** authProvider: begin */
export * from '../bean/authProvider.simple.ts';
import type { IAuthProviderOptionsSimple } from '../bean/authProvider.simple.ts';
import 'vona-module-a-auth';
declare module 'vona-module-a-auth' {
  
    export interface IAuthProviderRecord {
      'auth-simple:simple': IAuthProviderOptionsSimple;
    }

  
}
declare module 'vona-module-auth-simple' {
  
        export interface AuthProviderSimple {
          /** @internal */
          get scope(): ScopeModuleAuthSimple;
        }

          export interface AuthProviderSimple {
            get $beanFullName(): 'auth-simple.authProvider.simple';
            get $onionName(): 'auth-simple:simple';
            get $onionOptions(): IAuthProviderOptionsSimple;
          } 
}
/** authProvider: end */
/** authProvider: begin */
import type { AuthProviderSimple } from '../bean/authProvider.simple.ts';
export interface IModuleAuthProvider {
  'simple': AuthProviderSimple;
}
/** authProvider: end */
/** service: begin */
export * from '../service/authSimple.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'auth-simple:authSimple': never;
    }

  
}
declare module 'vona-module-auth-simple' {
  
        export interface ServiceAuthSimple {
          /** @internal */
          get scope(): ScopeModuleAuthSimple;
        }

          export interface ServiceAuthSimple {
            get $beanFullName(): 'auth-simple.service.authSimple';
            get $onionName(): 'auth-simple:authSimple';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceAuthSimple } from '../service/authSimple.ts';
export interface IModuleService {
  'authSimple': ServiceAuthSimple;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'auth-simple.service.authSimple': ServiceAuthSimple;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'auth-simple:version': never;
    }

  
}
declare module 'vona-module-auth-simple' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAuthSimple;
        }

          export interface MetaVersion {
            get $beanFullName(): 'auth-simple.meta.version';
            get $onionName(): 'auth-simple:version';
            
          } 
}
/** meta: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAuthSimple extends BeanScopeBase {}

export interface ScopeModuleAuthSimple {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
entity: IModuleEntity;
model: IModuleModel;
authProvider: IModuleAuthProvider;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'auth-simple': ScopeModuleAuthSimple;
  }

  export interface IBeanScopeContainer {
    authSimple: ScopeModuleAuthSimple;
  }
  
  export interface IBeanScopeConfig {
    'auth-simple': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
