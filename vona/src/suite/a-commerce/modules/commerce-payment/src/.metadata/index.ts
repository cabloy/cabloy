// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/paymentAttempt.tsx';
import type { IEntityOptionsPaymentAttempt } from '../entity/paymentAttempt.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-payment:paymentAttempt': IEntityOptionsPaymentAttempt;
    }

  
}
declare module 'vona-module-commerce-payment' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';
export interface IModuleEntity {
  'paymentAttempt': EntityPaymentAttemptMeta;
}
/** entity: end */
/** entity: begin */
export type EntityPaymentAttemptTableName = 'commercePaymentAttempt';
export type EntityPaymentAttemptMeta=TypeEntityMeta<EntityPaymentAttempt,EntityPaymentAttemptTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commercePaymentAttempt': EntityPaymentAttemptMeta;
  }
}
declare module 'vona-module-commerce-payment' {
  
    export interface IEntityOptionsPaymentAttempt {
      fields?: TypeEntityOptionsFields<EntityPaymentAttempt, IEntityOptionsPaymentAttempt[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/paymentAttempt.ts';
import type { IModelOptionsPaymentAttempt } from '../model/paymentAttempt.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-payment:paymentAttempt': IModelOptionsPaymentAttempt;
    }

  
}
declare module 'vona-module-commerce-payment' {
  
        export interface ModelPaymentAttempt {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ModelPaymentAttempt {
            get $beanFullName(): 'commerce-payment.model.paymentAttempt';
            get $onionName(): 'commerce-payment:paymentAttempt';
            get $onionOptions(): IModelOptionsPaymentAttempt;
          } 
}
/** model: end */
/** model: begin */
import type { ModelPaymentAttempt } from '../model/paymentAttempt.ts';
export interface IModuleModel {
  'paymentAttempt': ModelPaymentAttempt;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-payment.model.paymentAttempt': ModelPaymentAttempt;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-payment' {
  
  export interface ModelPaymentAttempt {
      [SymbolKeyEntity]: EntityPaymentAttempt;
      [SymbolKeyEntityMeta]: EntityPaymentAttemptMeta;
      [SymbolKeyModelOptions]: IModelOptionsPaymentAttempt;
      get<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(where: TypeModelWhere<EntityPaymentAttempt>, options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(where: TypeModelWhere<EntityPaymentAttempt>, options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPaymentAttempt, ModelPaymentAttempt, T>>;
      select<T extends IModelSelectParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T>[]>;
      insert<T extends IModelInsertOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(data?: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(items: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(data: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(items: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(where?: TypeModelWhere<EntityPaymentAttempt>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(data?: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(items: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>[]>;
      count<T extends IModelSelectCountParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPaymentAttempt,ModelPaymentAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPaymentAttempt, T>[]>;
      getById<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAttempt,ModelPaymentAttempt, T>>;
deleteById<T extends IModelDeleteOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-payment:paymentAttempt': ModelPaymentAttempt;
  }
}
/** model: end */
/** service: begin */
export * from '../service/paymentAttempt.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-payment:paymentAttempt': never;
    }

  
}
declare module 'vona-module-commerce-payment' {
  
        export interface ServicePaymentAttempt {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ServicePaymentAttempt {
            get $beanFullName(): 'commerce-payment.service.paymentAttempt';
            get $onionName(): 'commerce-payment:paymentAttempt';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServicePaymentAttempt } from '../service/paymentAttempt.ts';
export interface IModuleService {
  'paymentAttempt': ServicePaymentAttempt;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-payment.service.paymentAttempt': ServicePaymentAttempt;
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
      'commerce-payment:index': IMetaOptionsIndex;
'commerce-payment:version': never;
    }

  
}
declare module 'vona-module-commerce-payment' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-payment.meta.index';
            get $onionName(): 'commerce-payment:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-payment.meta.version';
            get $onionName(): 'commerce-payment:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/paymentAttemptView.tsx';
import type { IDtoOptionsPaymentAttemptView } from '../dto/paymentAttemptView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-payment:paymentAttemptView': IDtoOptionsPaymentAttemptView;
    }

  
}
declare module 'vona-module-commerce-payment' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoPaymentAttemptView } from '../dto/paymentAttemptView.tsx';
declare module 'vona-module-commerce-payment' {
  
    export interface IDtoOptionsPaymentAttemptView {
      fields?: TypeEntityOptionsFields<DtoPaymentAttemptView, IDtoOptionsPaymentAttemptView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommercePayment extends BeanScopeBase {}

export interface ScopeModuleCommercePayment {
  util: BeanScopeUtil;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-payment': ScopeModuleCommercePayment;
  }

  export interface IBeanScopeContainer {
    commercePayment: ScopeModuleCommercePayment;
  }
  
  

  

  
}
/** scope: end */
