// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/mail.ts';
import type { IEntityOptionsMail } from '../entity/mail.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'a-mail:mail': IEntityOptionsMail;
    }

  
}
declare module 'vona-module-a-mail' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityMail } from '../entity/mail.ts';
export interface IModuleEntity {
  'mail': EntityMailMeta;
}
/** entity: end */
/** entity: begin */
export type EntityMailTableName = 'mail';
export type EntityMailMeta=TypeEntityMeta<EntityMail,EntityMailTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'mail': EntityMailMeta;
  }
}
declare module 'vona-module-a-mail' {
  
    export interface IEntityOptionsMail {
      fields?: TypeEntityOptionsFields<EntityMail, IEntityOptionsMail[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/mail.ts';
import type { IModelOptionsMail } from '../model/mail.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'a-mail:mail': IModelOptionsMail;
    }

  
}
declare module 'vona-module-a-mail' {
  
        export interface ModelMail {
          /** @internal */
          get scope(): ScopeModuleAMail;
        }

          export interface ModelMail {
            get $beanFullName(): 'a-mail.model.mail';
            get $onionName(): 'a-mail:mail';
            get $onionOptions(): IModelOptionsMail;
          } 
}
/** model: end */
/** model: begin */
import type { ModelMail } from '../model/mail.ts';
export interface IModuleModel {
  'mail': ModelMail;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-mail.model.mail': ModelMail;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-mail' {
  
  export interface ModelMail {
      [SymbolKeyEntity]: EntityMail;
      [SymbolKeyEntityMeta]: EntityMailMeta;
      [SymbolKeyModelOptions]: IModelOptionsMail;
      get<T extends IModelGetOptions<EntityMail,ModelMail>>(where: TypeModelWhere<EntityMail>, options?: T): Promise<TypeModelRelationResult<EntityMail, ModelMail, T> | undefined>;
      mget<T extends IModelGetOptions<EntityMail,ModelMail>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityMail, ModelMail, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityMail, ModelMail, T>>;
      select<T extends IModelSelectParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityMail, ModelMail, T>[]>;
      insert<T extends IModelInsertOptions<EntityMail,ModelMail>>(data?: TypeModelMutateRelationData<EntityMail,ModelMail, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityMail,ModelMail>>(items: TypeModelMutateRelationData<EntityMail,ModelMail, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityMail,ModelMail>>(data: TypeModelMutateRelationData<EntityMail,ModelMail, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityMail,ModelMail>>(items: TypeModelMutateRelationData<EntityMail,ModelMail, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T>[]>;
      delete<T extends IModelDeleteOptions<EntityMail,ModelMail>>(where?: TypeModelWhere<EntityMail>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityMail,ModelMail>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityMail,ModelMail>>(data?: TypeModelMutateRelationData<EntityMail,ModelMail, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityMail,ModelMail>>(items: TypeModelMutateRelationData<EntityMail,ModelMail, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T>[]>;
      count<T extends IModelSelectCountParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityMail,ModelMail,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityMail, T>[]>;
      getById<T extends IModelGetOptions<EntityMail,ModelMail>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityMail, ModelMail, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityMail,ModelMail>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityMail,ModelMail, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMail,ModelMail, T>>;
deleteById<T extends IModelDeleteOptions<EntityMail,ModelMail>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-mail:mail': ModelMail;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.mail.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-mail' {
  
        export interface BeanMail {
          /** @internal */
          get scope(): ScopeModuleAMail;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanMail } from '../bean/bean.mail.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'mail': BeanMail;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/mail.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-mail:mail': never;
    }

  
}
declare module 'vona-module-a-mail' {
  
        export interface ServiceMail {
          /** @internal */
          get scope(): ScopeModuleAMail;
        }

          export interface ServiceMail {
            get $beanFullName(): 'a-mail.service.mail';
            get $onionName(): 'a-mail:mail';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceMail } from '../service/mail.ts';
export interface IModuleService {
  'mail': ServiceMail;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-mail.service.mail': ServiceMail;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-mail:version': never;
    }

  
}
declare module 'vona-module-a-mail' {
  
        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAMail;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-mail.meta.version';
            get $onionName(): 'a-mail:version';
            
          } 
}
/** meta: end */
/** queue: begin */
export * from '../bean/queue.mail.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {
  
    export interface IQueueRecord {
      'a-mail:mail': IDecoratorQueueOptions;
    }

  
}
declare module 'vona-module-a-mail' {
  
        export interface QueueMail {
          /** @internal */
          get scope(): ScopeModuleAMail;
        }

          export interface QueueMail {
            get $beanFullName(): 'a-mail.queue.mail';
            get $onionName(): 'a-mail:mail';
            get $onionOptions(): IDecoratorQueueOptions;
          } 
}
/** queue: end */
/** queue: begin */
import type { QueueMail } from '../bean/queue.mail.ts';
export interface IModuleQueue {
  'mail': QueueMail;
}
/** queue: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAMail extends BeanScopeBase {}

export interface ScopeModuleAMail {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
queue: IModuleQueue;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-mail': ScopeModuleAMail;
  }

  export interface IBeanScopeContainer {
    mail: ScopeModuleAMail;
  }
  
  export interface IBeanScopeConfig {
    'a-mail': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
