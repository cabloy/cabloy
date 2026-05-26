// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.app.ts';
export * from '../bean/middlewareSystem.instance.ts';
import type { IMiddlewareSystemOptionsApp } from '../bean/middlewareSystem.app.ts';
import type { IMiddlewareSystemOptionsInstance } from '../bean/middlewareSystem.instance.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareSystemRecord {
      'a-instance:app': IMiddlewareSystemOptionsApp;
'a-instance:instance': IMiddlewareSystemOptionsInstance;
    }

  
}
declare module 'vona-module-a-instance' {
  
        export interface MiddlewareSystemApp {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface MiddlewareSystemApp {
            get $beanFullName(): 'a-instance.middlewareSystem.app';
            get $onionName(): 'a-instance:app';
            get $onionOptions(): IMiddlewareSystemOptionsApp;
          }

        export interface MiddlewareSystemInstance {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface MiddlewareSystemInstance {
            get $beanFullName(): 'a-instance.middlewareSystem.instance';
            get $onionName(): 'a-instance:instance';
            get $onionOptions(): IMiddlewareSystemOptionsInstance;
          } 
}
/** middlewareSystem: end */
/** entity: begin */
export * from '../entity/instance.ts';
import type { IEntityOptionsInstance } from '../entity/instance.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-instance:instance': IEntityOptionsInstance;
    }

  
}
declare module 'vona-module-a-instance' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityInstance } from '../entity/instance.ts';
export interface IModuleEntity {
  'instance': EntityInstanceMeta;
}
/** entity: end */
/** entity: begin */
export type EntityInstanceTableName = 'aInstance';
export type EntityInstanceMeta=TypeEntityMeta<EntityInstance,EntityInstanceTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'aInstance': EntityInstanceMeta;
  }
}
declare module 'vona-module-a-instance' {
  
    export interface IEntityOptionsInstance {
      fields?: TypeEntityOptionsFields<EntityInstance, IEntityOptionsInstance[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/instance.ts';
import type { IModelOptionsInstance } from '../model/instance.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-instance:instance': IModelOptionsInstance;
    }

  
}
declare module 'vona-module-a-instance' {
  
        export interface ModelInstance {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface ModelInstance {
            get $beanFullName(): 'a-instance.model.instance';
            get $onionName(): 'a-instance:instance';
            get $onionOptions(): IModelOptionsInstance;
          } 
}
/** model: end */
/** model: begin */
import type { ModelInstance } from '../model/instance.ts';
export interface IModuleModel {
  'instance': ModelInstance;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-instance.model.instance': ModelInstance;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-instance' {
  
  export interface ModelInstance {
      [SymbolKeyEntity]: EntityInstance;
      [SymbolKeyEntityMeta]: EntityInstanceMeta;
      [SymbolKeyModelOptions]: IModelOptionsInstance;
      get<T extends IModelGetOptions<EntityInstance,ModelInstance>>(where: TypeModelWhere<EntityInstance>, options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T> | undefined>;
      mget<T extends IModelGetOptions<EntityInstance,ModelInstance>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityInstance, ModelInstance, T>>;
      select<T extends IModelSelectParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T>[]>;
      insert<T extends IModelInsertOptions<EntityInstance,ModelInstance>>(data?: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityInstance,ModelInstance>>(items: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityInstance,ModelInstance>>(data: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityInstance,ModelInstance>>(items: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T>[]>;
      delete<T extends IModelDeleteOptions<EntityInstance,ModelInstance>>(where?: TypeModelWhere<EntityInstance>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityInstance,ModelInstance>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityInstance,ModelInstance>>(data?: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityInstance,ModelInstance>>(items: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T>[]>;
      count<T extends IModelSelectCountParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityInstance, T>[]>;
      getById<T extends IModelGetOptions<EntityInstance,ModelInstance>>(id: number, options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityInstance,ModelInstance>>(id: number, data: TypeModelMutateRelationData<EntityInstance,ModelInstance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityInstance,ModelInstance, T>>;
deleteById<T extends IModelDeleteOptions<EntityInstance,ModelInstance>>(id: number, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityInstance,ModelInstance>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityInstance,ModelInstance>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T>[]>;
getByDisabled<T extends IModelGetOptions<EntityInstance,ModelInstance>>(disabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T> | undefined>;
selectByDisabled<T extends IModelSelectParams<EntityInstance,ModelInstance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(disabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityInstance, ModelInstance, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-instance:instance': ModelInstance;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.instance.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-instance' {
  
        export interface BeanInstance {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanInstance } from '../bean/bean.instance.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'instance': BeanInstance;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/instance.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-instance:instance': never;
    }

  
}
declare module 'vona-module-a-instance' {
  
        export interface ServiceInstance {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface ServiceInstance {
            get $beanFullName(): 'a-instance.service.instance';
            get $onionName(): 'a-instance:instance';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceInstance } from '../service/instance.ts';
export interface IModuleService {
  'instance': ServiceInstance;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-instance.service.instance': ServiceInstance;
  }
}
/** service: end */
/** broadcast: begin */
export * from '../bean/broadcast.reload.ts';
export * from '../bean/broadcast.resetCache.ts';

import { type IDecoratorBroadcastOptions } from 'vona-module-a-broadcast';
declare module 'vona-module-a-broadcast' {
  
    export interface IBroadcastRecord {
      'a-instance:reload': IDecoratorBroadcastOptions;
'a-instance:resetCache': IDecoratorBroadcastOptions;
    }

  
}
declare module 'vona-module-a-instance' {
  
        export interface BroadcastReload {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface BroadcastReload {
            get $beanFullName(): 'a-instance.broadcast.reload';
            get $onionName(): 'a-instance:reload';
            get $onionOptions(): IDecoratorBroadcastOptions;
          }

        export interface BroadcastResetCache {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface BroadcastResetCache {
            get $beanFullName(): 'a-instance.broadcast.resetCache';
            get $onionName(): 'a-instance:resetCache';
            get $onionOptions(): IDecoratorBroadcastOptions;
          } 
}
/** broadcast: end */
/** broadcast: begin */
import type { BroadcastReload } from '../bean/broadcast.reload.ts';
import type { BroadcastResetCache } from '../bean/broadcast.resetCache.ts';
export interface IModuleBroadcast {
  'reload': BroadcastReload;
'resetCache': BroadcastResetCache;
}
/** broadcast: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-instance:index': IMetaOptionsIndex;
'a-instance:redlock': never;
'a-instance:version': never;
    }

  
}
declare module 'vona-module-a-instance' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface MetaIndex {
            get $beanFullName(): 'a-instance.meta.index';
            get $onionName(): 'a-instance:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-instance.meta.redlock';
            get $onionName(): 'a-instance:redlock';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAInstance;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-instance.meta.version';
            get $onionName(): 'a-instance:version';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAInstance extends BeanScopeBase {}

export interface ScopeModuleAInstance {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
broadcast: IModuleBroadcast;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-instance': ScopeModuleAInstance;
  }

  export interface IBeanScopeContainer {
    instance: ScopeModuleAInstance;
  }
  
  

  export interface IBeanScopeLocale {
    'a-instance': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
