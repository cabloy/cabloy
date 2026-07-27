// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/paymentAttempt.tsx';
export * from '../entity/paymentAudit.tsx';
export * from '../entity/refundAttempt.tsx';
export * from '../entity/refundAudit.tsx';
export * from '../entity/refundRequest.tsx';
import type { IEntityOptionsPaymentAttempt } from '../entity/paymentAttempt.tsx';
import type { IEntityOptionsPaymentAudit } from '../entity/paymentAudit.tsx';
import type { IEntityOptionsRefundAttempt } from '../entity/refundAttempt.tsx';
import type { IEntityOptionsRefundAudit } from '../entity/refundAudit.tsx';
import type { IEntityOptionsRefundRequest } from '../entity/refundRequest.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-payment:paymentAttempt': IEntityOptionsPaymentAttempt;
'commerce-payment:paymentAudit': IEntityOptionsPaymentAudit;
'commerce-payment:refundAttempt': IEntityOptionsRefundAttempt;
'commerce-payment:refundAudit': IEntityOptionsRefundAudit;
'commerce-payment:refundRequest': IEntityOptionsRefundRequest;
    }

  
}
declare module 'vona-module-commerce-payment' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityPaymentAttempt } from '../entity/paymentAttempt.tsx';
import type { EntityPaymentAudit } from '../entity/paymentAudit.tsx';
import type { EntityRefundAttempt } from '../entity/refundAttempt.tsx';
import type { EntityRefundAudit } from '../entity/refundAudit.tsx';
import type { EntityRefundRequest } from '../entity/refundRequest.tsx';
export interface IModuleEntity {
  'paymentAttempt': EntityPaymentAttemptMeta;
'paymentAudit': EntityPaymentAuditMeta;
'refundAttempt': EntityRefundAttemptMeta;
'refundAudit': EntityRefundAuditMeta;
'refundRequest': EntityRefundRequestMeta;
}
/** entity: end */
/** entity: begin */
export type EntityPaymentAttemptTableName = 'commercePaymentAttempt';
export type EntityPaymentAuditTableName = 'commercePaymentAudit';
export type EntityRefundAttemptTableName = 'commercePaymentRefundAttempt';
export type EntityRefundAuditTableName = 'commercePaymentRefundAudit';
export type EntityRefundRequestTableName = 'commercePaymentRefundRequest';
export type EntityPaymentAttemptMeta=TypeEntityMeta<EntityPaymentAttempt,EntityPaymentAttemptTableName>;
export type EntityPaymentAuditMeta=TypeEntityMeta<EntityPaymentAudit,EntityPaymentAuditTableName>;
export type EntityRefundAttemptMeta=TypeEntityMeta<EntityRefundAttempt,EntityRefundAttemptTableName>;
export type EntityRefundAuditMeta=TypeEntityMeta<EntityRefundAudit,EntityRefundAuditTableName>;
export type EntityRefundRequestMeta=TypeEntityMeta<EntityRefundRequest,EntityRefundRequestTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commercePaymentAttempt': EntityPaymentAttemptMeta;
'commercePaymentAudit': EntityPaymentAuditMeta;
'commercePaymentRefundAttempt': EntityRefundAttemptMeta;
'commercePaymentRefundAudit': EntityRefundAuditMeta;
'commercePaymentRefundRequest': EntityRefundRequestMeta;
  }
}
declare module 'vona-module-commerce-payment' {
  
    export interface IEntityOptionsPaymentAttempt {
      fields?: TypeEntityOptionsFields<EntityPaymentAttempt, IEntityOptionsPaymentAttempt[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsPaymentAudit {
      fields?: TypeEntityOptionsFields<EntityPaymentAudit, IEntityOptionsPaymentAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRefundAttempt {
      fields?: TypeEntityOptionsFields<EntityRefundAttempt, IEntityOptionsRefundAttempt[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRefundAudit {
      fields?: TypeEntityOptionsFields<EntityRefundAudit, IEntityOptionsRefundAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRefundRequest {
      fields?: TypeEntityOptionsFields<EntityRefundRequest, IEntityOptionsRefundRequest[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/paymentAttempt.ts';
export * from '../model/paymentAudit.ts';
export * from '../model/refundAttempt.ts';
export * from '../model/refundAudit.ts';
export * from '../model/refundRequest.ts';
import type { IModelOptionsPaymentAttempt } from '../model/paymentAttempt.ts';
import type { IModelOptionsPaymentAudit } from '../model/paymentAudit.ts';
import type { IModelOptionsRefundAttempt } from '../model/refundAttempt.ts';
import type { IModelOptionsRefundAudit } from '../model/refundAudit.ts';
import type { IModelOptionsRefundRequest } from '../model/refundRequest.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-payment:paymentAttempt': IModelOptionsPaymentAttempt;
'commerce-payment:paymentAudit': IModelOptionsPaymentAudit;
'commerce-payment:refundAttempt': IModelOptionsRefundAttempt;
'commerce-payment:refundAudit': IModelOptionsRefundAudit;
'commerce-payment:refundRequest': IModelOptionsRefundRequest;
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

        export interface ModelPaymentAudit {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ModelPaymentAudit {
            get $beanFullName(): 'commerce-payment.model.paymentAudit';
            get $onionName(): 'commerce-payment:paymentAudit';
            get $onionOptions(): IModelOptionsPaymentAudit;
          }

        export interface ModelRefundAttempt {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ModelRefundAttempt {
            get $beanFullName(): 'commerce-payment.model.refundAttempt';
            get $onionName(): 'commerce-payment:refundAttempt';
            get $onionOptions(): IModelOptionsRefundAttempt;
          }

        export interface ModelRefundAudit {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ModelRefundAudit {
            get $beanFullName(): 'commerce-payment.model.refundAudit';
            get $onionName(): 'commerce-payment:refundAudit';
            get $onionOptions(): IModelOptionsRefundAudit;
          }

        export interface ModelRefundRequest {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ModelRefundRequest {
            get $beanFullName(): 'commerce-payment.model.refundRequest';
            get $onionName(): 'commerce-payment:refundRequest';
            get $onionOptions(): IModelOptionsRefundRequest;
          } 
}
/** model: end */
/** model: begin */
import type { ModelPaymentAttempt } from '../model/paymentAttempt.ts';
import type { ModelPaymentAudit } from '../model/paymentAudit.ts';
import type { ModelRefundAttempt } from '../model/refundAttempt.ts';
import type { ModelRefundAudit } from '../model/refundAudit.ts';
import type { ModelRefundRequest } from '../model/refundRequest.ts';
export interface IModuleModel {
  'paymentAttempt': ModelPaymentAttempt;
'paymentAudit': ModelPaymentAudit;
'refundAttempt': ModelRefundAttempt;
'refundAudit': ModelRefundAudit;
'refundRequest': ModelRefundRequest;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-payment.model.paymentAttempt': ModelPaymentAttempt;
'commerce-payment.model.paymentAudit': ModelPaymentAudit;
'commerce-payment.model.refundAttempt': ModelRefundAttempt;
'commerce-payment.model.refundAudit': ModelRefundAudit;
'commerce-payment.model.refundRequest': ModelRefundRequest;
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
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityPaymentAttempt,ModelPaymentAttempt>>(where: TypeModelWhere<EntityPaymentAttempt>, options?: T): Promise<TypeModelRelationResult<EntityPaymentAttempt, ModelPaymentAttempt, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
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
export interface ModelPaymentAudit {
      [SymbolKeyEntity]: EntityPaymentAudit;
      [SymbolKeyEntityMeta]: EntityPaymentAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsPaymentAudit;
      get<T extends IModelGetOptions<EntityPaymentAudit,ModelPaymentAudit>>(where: TypeModelWhere<EntityPaymentAudit>, options?: T): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityPaymentAudit,ModelPaymentAudit>>(where: TypeModelWhere<EntityPaymentAudit>, options?: T): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityPaymentAudit,ModelPaymentAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPaymentAudit,ModelPaymentAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPaymentAudit, ModelPaymentAudit, T>>;
      select<T extends IModelSelectParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityPaymentAudit,ModelPaymentAudit>>(data?: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPaymentAudit,ModelPaymentAudit>>(items: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPaymentAudit,ModelPaymentAudit>>(data: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPaymentAudit,ModelPaymentAudit>>(items: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPaymentAudit,ModelPaymentAudit>>(where?: TypeModelWhere<EntityPaymentAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPaymentAudit,ModelPaymentAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPaymentAudit,ModelPaymentAudit>>(data?: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPaymentAudit,ModelPaymentAudit>>(items: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPaymentAudit,ModelPaymentAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPaymentAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityPaymentAudit,ModelPaymentAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentAudit, ModelPaymentAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPaymentAudit,ModelPaymentAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentAudit,ModelPaymentAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityPaymentAudit,ModelPaymentAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRefundAttempt {
      [SymbolKeyEntity]: EntityRefundAttempt;
      [SymbolKeyEntityMeta]: EntityRefundAttemptMeta;
      [SymbolKeyModelOptions]: IModelOptionsRefundAttempt;
      get<T extends IModelGetOptions<EntityRefundAttempt,ModelRefundAttempt>>(where: TypeModelWhere<EntityRefundAttempt>, options?: T): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRefundAttempt,ModelRefundAttempt>>(where: TypeModelWhere<EntityRefundAttempt>, options?: T): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRefundAttempt,ModelRefundAttempt>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRefundAttempt,ModelRefundAttempt>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRefundAttempt, ModelRefundAttempt, T>>;
      select<T extends IModelSelectParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T>[]>;
      insert<T extends IModelInsertOptions<EntityRefundAttempt,ModelRefundAttempt>>(data?: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRefundAttempt,ModelRefundAttempt>>(items: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRefundAttempt,ModelRefundAttempt>>(data: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRefundAttempt,ModelRefundAttempt>>(items: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRefundAttempt,ModelRefundAttempt>>(where?: TypeModelWhere<EntityRefundAttempt>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRefundAttempt,ModelRefundAttempt>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRefundAttempt,ModelRefundAttempt>>(data?: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRefundAttempt,ModelRefundAttempt>>(items: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>[]>;
      count<T extends IModelSelectCountParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRefundAttempt,ModelRefundAttempt,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRefundAttempt, T>[]>;
      getById<T extends IModelGetOptions<EntityRefundAttempt,ModelRefundAttempt>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundAttempt, ModelRefundAttempt, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRefundAttempt,ModelRefundAttempt>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAttempt,ModelRefundAttempt, T>>;
deleteById<T extends IModelDeleteOptions<EntityRefundAttempt,ModelRefundAttempt>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRefundAudit {
      [SymbolKeyEntity]: EntityRefundAudit;
      [SymbolKeyEntityMeta]: EntityRefundAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsRefundAudit;
      get<T extends IModelGetOptions<EntityRefundAudit,ModelRefundAudit>>(where: TypeModelWhere<EntityRefundAudit>, options?: T): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRefundAudit,ModelRefundAudit>>(where: TypeModelWhere<EntityRefundAudit>, options?: T): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRefundAudit,ModelRefundAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRefundAudit,ModelRefundAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRefundAudit, ModelRefundAudit, T>>;
      select<T extends IModelSelectParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityRefundAudit,ModelRefundAudit>>(data?: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRefundAudit,ModelRefundAudit>>(items: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRefundAudit,ModelRefundAudit>>(data: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRefundAudit,ModelRefundAudit>>(items: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRefundAudit,ModelRefundAudit>>(where?: TypeModelWhere<EntityRefundAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRefundAudit,ModelRefundAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRefundAudit,ModelRefundAudit>>(data?: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRefundAudit,ModelRefundAudit>>(items: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRefundAudit,ModelRefundAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRefundAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityRefundAudit,ModelRefundAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundAudit, ModelRefundAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRefundAudit,ModelRefundAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundAudit,ModelRefundAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityRefundAudit,ModelRefundAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRefundRequest {
      [SymbolKeyEntity]: EntityRefundRequest;
      [SymbolKeyEntityMeta]: EntityRefundRequestMeta;
      [SymbolKeyModelOptions]: IModelOptionsRefundRequest;
      get<T extends IModelGetOptions<EntityRefundRequest,ModelRefundRequest>>(where: TypeModelWhere<EntityRefundRequest>, options?: T): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRefundRequest,ModelRefundRequest>>(where: TypeModelWhere<EntityRefundRequest>, options?: T): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRefundRequest,ModelRefundRequest>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRefundRequest,ModelRefundRequest>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRefundRequest, ModelRefundRequest, T>>;
      select<T extends IModelSelectParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T>[]>;
      insert<T extends IModelInsertOptions<EntityRefundRequest,ModelRefundRequest>>(data?: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRefundRequest,ModelRefundRequest>>(items: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRefundRequest,ModelRefundRequest>>(data: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRefundRequest,ModelRefundRequest>>(items: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRefundRequest,ModelRefundRequest>>(where?: TypeModelWhere<EntityRefundRequest>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRefundRequest,ModelRefundRequest>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRefundRequest,ModelRefundRequest>>(data?: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRefundRequest,ModelRefundRequest>>(items: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>[]>;
      count<T extends IModelSelectCountParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRefundRequest,ModelRefundRequest,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRefundRequest, T>[]>;
      getById<T extends IModelGetOptions<EntityRefundRequest,ModelRefundRequest>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundRequest, ModelRefundRequest, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRefundRequest,ModelRefundRequest>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundRequest,ModelRefundRequest, T>>;
deleteById<T extends IModelDeleteOptions<EntityRefundRequest,ModelRefundRequest>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-payment:paymentAttempt': ModelPaymentAttempt;
'commerce-payment:paymentAudit': ModelPaymentAudit;
'commerce-payment:refundAttempt': ModelRefundAttempt;
'commerce-payment:refundAudit': ModelRefundAudit;
'commerce-payment:refundRequest': ModelRefundRequest;
  }
}
/** model: end */
/** service: begin */
export * from '../service/mockPaymentAdapter.ts';
export * from '../service/paymentAttempt.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-payment:mockPaymentAdapter': never;
'commerce-payment:paymentAttempt': never;
    }

  
}
declare module 'vona-module-commerce-payment' {
  
        export interface ServiceMockPaymentAdapter {
          /** @internal */
          get scope(): ScopeModuleCommercePayment;
        }

          export interface ServiceMockPaymentAdapter {
            get $beanFullName(): 'commerce-payment.service.mockPaymentAdapter';
            get $onionName(): 'commerce-payment:mockPaymentAdapter';
            
          }

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
import type { ServiceMockPaymentAdapter } from '../service/mockPaymentAdapter.ts';
import type { ServicePaymentAttempt } from '../service/paymentAttempt.ts';
export interface IModuleService {
  'mockPaymentAdapter': ServiceMockPaymentAdapter;
'paymentAttempt': ServicePaymentAttempt;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-payment.service.mockPaymentAdapter': ServiceMockPaymentAdapter;
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
