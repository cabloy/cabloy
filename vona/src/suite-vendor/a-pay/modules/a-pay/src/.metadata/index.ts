// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/outboxEvent.tsx';
export * from '../entity/paymentAudit.tsx';
export * from '../entity/paymentSession.tsx';
export * from '../entity/providerOperation.tsx';
export * from '../entity/refundOperation.tsx';
export * from '../entity/webhookInbox.tsx';
import type { IEntityOptionsOutboxEvent } from '../entity/outboxEvent.tsx';
import type { IEntityOptionsPaymentAudit } from '../entity/paymentAudit.tsx';
import type { IEntityOptionsPaymentSession } from '../entity/paymentSession.tsx';
import type { IEntityOptionsProviderOperation } from '../entity/providerOperation.tsx';
import type { IEntityOptionsRefundOperation } from '../entity/refundOperation.tsx';
import type { IEntityOptionsWebhookInbox } from '../entity/webhookInbox.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'a-pay:outboxEvent': IEntityOptionsOutboxEvent;
'a-pay:paymentAudit': IEntityOptionsPaymentAudit;
'a-pay:paymentSession': IEntityOptionsPaymentSession;
'a-pay:providerOperation': IEntityOptionsProviderOperation;
'a-pay:refundOperation': IEntityOptionsRefundOperation;
'a-pay:webhookInbox': IEntityOptionsWebhookInbox;
    }


}
declare module 'vona-module-a-pay' {

}
/** entity: end */
/** entity: begin */
import type { EntityOutboxEvent } from '../entity/outboxEvent.tsx';
import type { EntityPaymentAudit } from '../entity/paymentAudit.tsx';
import type { EntityPaymentSession } from '../entity/paymentSession.tsx';
import type { EntityProviderOperation } from '../entity/providerOperation.tsx';
import type { EntityRefundOperation } from '../entity/refundOperation.tsx';
import type { EntityWebhookInbox } from '../entity/webhookInbox.tsx';
export interface IModuleEntity {
  'outboxEvent': EntityOutboxEventMeta;
'paymentAudit': EntityPaymentAuditMeta;
'paymentSession': EntityPaymentSessionMeta;
'providerOperation': EntityProviderOperationMeta;
'refundOperation': EntityRefundOperationMeta;
'webhookInbox': EntityWebhookInboxMeta;
}
/** entity: end */
/** entity: begin */
export type EntityOutboxEventTableName = 'payOutboxEvent';
export type EntityPaymentAuditTableName = 'payPaymentAudit';
export type EntityPaymentSessionTableName = 'payPaymentSession';
export type EntityProviderOperationTableName = 'payProviderOperation';
export type EntityRefundOperationTableName = 'payRefundOperation';
export type EntityWebhookInboxTableName = 'payWebhookInbox';
export type EntityOutboxEventMeta=TypeEntityMeta<EntityOutboxEvent,EntityOutboxEventTableName>;
export type EntityPaymentAuditMeta=TypeEntityMeta<EntityPaymentAudit,EntityPaymentAuditTableName>;
export type EntityPaymentSessionMeta=TypeEntityMeta<EntityPaymentSession,EntityPaymentSessionTableName>;
export type EntityProviderOperationMeta=TypeEntityMeta<EntityProviderOperation,EntityProviderOperationTableName>;
export type EntityRefundOperationMeta=TypeEntityMeta<EntityRefundOperation,EntityRefundOperationTableName>;
export type EntityWebhookInboxMeta=TypeEntityMeta<EntityWebhookInbox,EntityWebhookInboxTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'payOutboxEvent': EntityOutboxEventMeta;
'payPaymentAudit': EntityPaymentAuditMeta;
'payPaymentSession': EntityPaymentSessionMeta;
'payProviderOperation': EntityProviderOperationMeta;
'payRefundOperation': EntityRefundOperationMeta;
'payWebhookInbox': EntityWebhookInboxMeta;
  }
}
declare module 'vona-module-a-pay' {

    export interface IEntityOptionsOutboxEvent {
      fields?: TypeEntityOptionsFields<EntityOutboxEvent, IEntityOptionsOutboxEvent[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsPaymentAudit {
      fields?: TypeEntityOptionsFields<EntityPaymentAudit, IEntityOptionsPaymentAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsPaymentSession {
      fields?: TypeEntityOptionsFields<EntityPaymentSession, IEntityOptionsPaymentSession[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsProviderOperation {
      fields?: TypeEntityOptionsFields<EntityProviderOperation, IEntityOptionsProviderOperation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRefundOperation {
      fields?: TypeEntityOptionsFields<EntityRefundOperation, IEntityOptionsRefundOperation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsWebhookInbox {
      fields?: TypeEntityOptionsFields<EntityWebhookInbox, IEntityOptionsWebhookInbox[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/outboxEvent.ts';
export * from '../model/paymentAudit.ts';
export * from '../model/paymentSession.ts';
export * from '../model/providerOperation.ts';
export * from '../model/refundOperation.ts';
export * from '../model/webhookInbox.ts';
import type { IModelOptionsOutboxEvent } from '../model/outboxEvent.ts';
import type { IModelOptionsPaymentAudit } from '../model/paymentAudit.ts';
import type { IModelOptionsPaymentSession } from '../model/paymentSession.ts';
import type { IModelOptionsProviderOperation } from '../model/providerOperation.ts';
import type { IModelOptionsRefundOperation } from '../model/refundOperation.ts';
import type { IModelOptionsWebhookInbox } from '../model/webhookInbox.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'a-pay:outboxEvent': IModelOptionsOutboxEvent;
'a-pay:paymentAudit': IModelOptionsPaymentAudit;
'a-pay:paymentSession': IModelOptionsPaymentSession;
'a-pay:providerOperation': IModelOptionsProviderOperation;
'a-pay:refundOperation': IModelOptionsRefundOperation;
'a-pay:webhookInbox': IModelOptionsWebhookInbox;
    }


}
declare module 'vona-module-a-pay' {

        export interface ModelOutboxEvent {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelOutboxEvent {
            get $beanFullName(): 'a-pay.model.outboxEvent';
            get $onionName(): 'a-pay:outboxEvent';
            get $onionOptions(): IModelOptionsOutboxEvent;
          }

        export interface ModelPaymentAudit {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelPaymentAudit {
            get $beanFullName(): 'a-pay.model.paymentAudit';
            get $onionName(): 'a-pay:paymentAudit';
            get $onionOptions(): IModelOptionsPaymentAudit;
          }

        export interface ModelPaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelPaymentSession {
            get $beanFullName(): 'a-pay.model.paymentSession';
            get $onionName(): 'a-pay:paymentSession';
            get $onionOptions(): IModelOptionsPaymentSession;
          }

        export interface ModelProviderOperation {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelProviderOperation {
            get $beanFullName(): 'a-pay.model.providerOperation';
            get $onionName(): 'a-pay:providerOperation';
            get $onionOptions(): IModelOptionsProviderOperation;
          }

        export interface ModelRefundOperation {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelRefundOperation {
            get $beanFullName(): 'a-pay.model.refundOperation';
            get $onionName(): 'a-pay:refundOperation';
            get $onionOptions(): IModelOptionsRefundOperation;
          }

        export interface ModelWebhookInbox {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ModelWebhookInbox {
            get $beanFullName(): 'a-pay.model.webhookInbox';
            get $onionName(): 'a-pay:webhookInbox';
            get $onionOptions(): IModelOptionsWebhookInbox;
          }
}
/** model: end */
/** model: begin */
import type { ModelOutboxEvent } from '../model/outboxEvent.ts';
import type { ModelPaymentAudit } from '../model/paymentAudit.ts';
import type { ModelPaymentSession } from '../model/paymentSession.ts';
import type { ModelProviderOperation } from '../model/providerOperation.ts';
import type { ModelRefundOperation } from '../model/refundOperation.ts';
import type { ModelWebhookInbox } from '../model/webhookInbox.ts';
export interface IModuleModel {
  'outboxEvent': ModelOutboxEvent;
'paymentAudit': ModelPaymentAudit;
'paymentSession': ModelPaymentSession;
'providerOperation': ModelProviderOperation;
'refundOperation': ModelRefundOperation;
'webhookInbox': ModelWebhookInbox;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-pay.model.outboxEvent': ModelOutboxEvent;
'a-pay.model.paymentAudit': ModelPaymentAudit;
'a-pay.model.paymentSession': ModelPaymentSession;
'a-pay.model.providerOperation': ModelProviderOperation;
'a-pay.model.refundOperation': ModelRefundOperation;
'a-pay.model.webhookInbox': ModelWebhookInbox;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-a-pay' {

  export interface ModelOutboxEvent {
      [SymbolKeyEntity]: EntityOutboxEvent;
      [SymbolKeyEntityMeta]: EntityOutboxEventMeta;
      [SymbolKeyModelOptions]: IModelOptionsOutboxEvent;
      get<T extends IModelGetOptions<EntityOutboxEvent,ModelOutboxEvent>>(where: TypeModelWhere<EntityOutboxEvent>, options?: T): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityOutboxEvent,ModelOutboxEvent>>(where: TypeModelWhere<EntityOutboxEvent>, options?: T): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityOutboxEvent,ModelOutboxEvent>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T> | undefined>;
      mget<T extends IModelGetOptions<EntityOutboxEvent,ModelOutboxEvent>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityOutboxEvent, ModelOutboxEvent, T>>;
      select<T extends IModelSelectParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T>[]>;
      insert<T extends IModelInsertOptions<EntityOutboxEvent,ModelOutboxEvent>>(data?: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityOutboxEvent,ModelOutboxEvent>>(items: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityOutboxEvent,ModelOutboxEvent>>(data: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityOutboxEvent,ModelOutboxEvent>>(items: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>[]>;
      delete<T extends IModelDeleteOptions<EntityOutboxEvent,ModelOutboxEvent>>(where?: TypeModelWhere<EntityOutboxEvent>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityOutboxEvent,ModelOutboxEvent>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityOutboxEvent,ModelOutboxEvent>>(data?: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityOutboxEvent,ModelOutboxEvent>>(items: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>[]>;
      count<T extends IModelSelectCountParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityOutboxEvent,ModelOutboxEvent,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityOutboxEvent, T>[]>;
      getById<T extends IModelGetOptions<EntityOutboxEvent,ModelOutboxEvent>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityOutboxEvent, ModelOutboxEvent, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityOutboxEvent,ModelOutboxEvent>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>, options?: T): Promise<TypeModelMutateRelationData<EntityOutboxEvent,ModelOutboxEvent, T>>;
deleteById<T extends IModelDeleteOptions<EntityOutboxEvent,ModelOutboxEvent>>(id: TableIdentity, options?: T): Promise<void>;
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
export interface ModelPaymentSession {
      [SymbolKeyEntity]: EntityPaymentSession;
      [SymbolKeyEntityMeta]: EntityPaymentSessionMeta;
      [SymbolKeyModelOptions]: IModelOptionsPaymentSession;
      get<T extends IModelGetOptions<EntityPaymentSession,ModelPaymentSession>>(where: TypeModelWhere<EntityPaymentSession>, options?: T): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityPaymentSession,ModelPaymentSession>>(where: TypeModelWhere<EntityPaymentSession>, options?: T): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityPaymentSession,ModelPaymentSession>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPaymentSession,ModelPaymentSession>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPaymentSession, ModelPaymentSession, T>>;
      select<T extends IModelSelectParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T>[]>;
      insert<T extends IModelInsertOptions<EntityPaymentSession,ModelPaymentSession>>(data?: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPaymentSession,ModelPaymentSession>>(items: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPaymentSession,ModelPaymentSession>>(data: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPaymentSession,ModelPaymentSession>>(items: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPaymentSession,ModelPaymentSession>>(where?: TypeModelWhere<EntityPaymentSession>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPaymentSession,ModelPaymentSession>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPaymentSession,ModelPaymentSession>>(data?: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPaymentSession,ModelPaymentSession>>(items: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>[]>;
      count<T extends IModelSelectCountParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPaymentSession,ModelPaymentSession,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPaymentSession, T>[]>;
      getById<T extends IModelGetOptions<EntityPaymentSession,ModelPaymentSession>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPaymentSession, ModelPaymentSession, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPaymentSession,ModelPaymentSession>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPaymentSession,ModelPaymentSession, T>>;
deleteById<T extends IModelDeleteOptions<EntityPaymentSession,ModelPaymentSession>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelProviderOperation {
      [SymbolKeyEntity]: EntityProviderOperation;
      [SymbolKeyEntityMeta]: EntityProviderOperationMeta;
      [SymbolKeyModelOptions]: IModelOptionsProviderOperation;
      get<T extends IModelGetOptions<EntityProviderOperation,ModelProviderOperation>>(where: TypeModelWhere<EntityProviderOperation>, options?: T): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityProviderOperation,ModelProviderOperation>>(where: TypeModelWhere<EntityProviderOperation>, options?: T): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityProviderOperation,ModelProviderOperation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T> | undefined>;
      mget<T extends IModelGetOptions<EntityProviderOperation,ModelProviderOperation>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityProviderOperation, ModelProviderOperation, T>>;
      select<T extends IModelSelectParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T>[]>;
      insert<T extends IModelInsertOptions<EntityProviderOperation,ModelProviderOperation>>(data?: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityProviderOperation,ModelProviderOperation>>(items: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityProviderOperation,ModelProviderOperation>>(data: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityProviderOperation,ModelProviderOperation>>(items: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>[]>;
      delete<T extends IModelDeleteOptions<EntityProviderOperation,ModelProviderOperation>>(where?: TypeModelWhere<EntityProviderOperation>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityProviderOperation,ModelProviderOperation>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityProviderOperation,ModelProviderOperation>>(data?: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityProviderOperation,ModelProviderOperation>>(items: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>[]>;
      count<T extends IModelSelectCountParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityProviderOperation,ModelProviderOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityProviderOperation, T>[]>;
      getById<T extends IModelGetOptions<EntityProviderOperation,ModelProviderOperation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityProviderOperation, ModelProviderOperation, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityProviderOperation,ModelProviderOperation>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityProviderOperation,ModelProviderOperation, T>>;
deleteById<T extends IModelDeleteOptions<EntityProviderOperation,ModelProviderOperation>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRefundOperation {
      [SymbolKeyEntity]: EntityRefundOperation;
      [SymbolKeyEntityMeta]: EntityRefundOperationMeta;
      [SymbolKeyModelOptions]: IModelOptionsRefundOperation;
      get<T extends IModelGetOptions<EntityRefundOperation,ModelRefundOperation>>(where: TypeModelWhere<EntityRefundOperation>, options?: T): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRefundOperation,ModelRefundOperation>>(where: TypeModelWhere<EntityRefundOperation>, options?: T): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRefundOperation,ModelRefundOperation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRefundOperation,ModelRefundOperation>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRefundOperation, ModelRefundOperation, T>>;
      select<T extends IModelSelectParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T>[]>;
      insert<T extends IModelInsertOptions<EntityRefundOperation,ModelRefundOperation>>(data?: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRefundOperation,ModelRefundOperation>>(items: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRefundOperation,ModelRefundOperation>>(data: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRefundOperation,ModelRefundOperation>>(items: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRefundOperation,ModelRefundOperation>>(where?: TypeModelWhere<EntityRefundOperation>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRefundOperation,ModelRefundOperation>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRefundOperation,ModelRefundOperation>>(data?: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRefundOperation,ModelRefundOperation>>(items: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>[]>;
      count<T extends IModelSelectCountParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRefundOperation,ModelRefundOperation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRefundOperation, T>[]>;
      getById<T extends IModelGetOptions<EntityRefundOperation,ModelRefundOperation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRefundOperation, ModelRefundOperation, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRefundOperation,ModelRefundOperation>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRefundOperation,ModelRefundOperation, T>>;
deleteById<T extends IModelDeleteOptions<EntityRefundOperation,ModelRefundOperation>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelWebhookInbox {
      [SymbolKeyEntity]: EntityWebhookInbox;
      [SymbolKeyEntityMeta]: EntityWebhookInboxMeta;
      [SymbolKeyModelOptions]: IModelOptionsWebhookInbox;
      get<T extends IModelGetOptions<EntityWebhookInbox,ModelWebhookInbox>>(where: TypeModelWhere<EntityWebhookInbox>, options?: T): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityWebhookInbox,ModelWebhookInbox>>(where: TypeModelWhere<EntityWebhookInbox>, options?: T): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityWebhookInbox,ModelWebhookInbox>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T> | undefined>;
      mget<T extends IModelGetOptions<EntityWebhookInbox,ModelWebhookInbox>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityWebhookInbox, ModelWebhookInbox, T>>;
      select<T extends IModelSelectParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T>[]>;
      insert<T extends IModelInsertOptions<EntityWebhookInbox,ModelWebhookInbox>>(data?: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>, options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityWebhookInbox,ModelWebhookInbox>>(items: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityWebhookInbox,ModelWebhookInbox>>(data: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>, options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityWebhookInbox,ModelWebhookInbox>>(items: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>[]>;
      delete<T extends IModelDeleteOptions<EntityWebhookInbox,ModelWebhookInbox>>(where?: TypeModelWhere<EntityWebhookInbox>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityWebhookInbox,ModelWebhookInbox>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityWebhookInbox,ModelWebhookInbox>>(data?: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>, options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityWebhookInbox,ModelWebhookInbox>>(items: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>[]>;
      count<T extends IModelSelectCountParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityWebhookInbox,ModelWebhookInbox,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityWebhookInbox, T>[]>;
      getById<T extends IModelGetOptions<EntityWebhookInbox,ModelWebhookInbox>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityWebhookInbox, ModelWebhookInbox, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityWebhookInbox,ModelWebhookInbox>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>, options?: T): Promise<TypeModelMutateRelationData<EntityWebhookInbox,ModelWebhookInbox, T>>;
deleteById<T extends IModelDeleteOptions<EntityWebhookInbox,ModelWebhookInbox>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'a-pay:outboxEvent': ModelOutboxEvent;
'a-pay:paymentAudit': ModelPaymentAudit;
'a-pay:paymentSession': ModelPaymentSession;
'a-pay:providerOperation': ModelProviderOperation;
'a-pay:refundOperation': ModelRefundOperation;
'a-pay:webhookInbox': ModelWebhookInbox;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.payProvider.ts';
export * from '../bean/bean.payScene.ts';

import 'vona';
declare module 'vona' {


}
declare module 'vona-module-a-pay' {

        export interface BeanPayProvider {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

        export interface BeanPayScene {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }
}
/** bean: end */
/** bean: begin */
import type { BeanPayProvider } from '../bean/bean.payProvider.ts';
import type { BeanPayScene } from '../bean/bean.payScene.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'payProvider': BeanPayProvider;
    'payScene': BeanPayScene;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/outbox.ts';
export * from '../service/paymentCallback.ts';
export * from '../service/paymentSession.ts';
export * from '../service/providerOperation.ts';
export * from '../service/refundOperation.ts';
export * from '../service/webhook.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'a-pay:outbox': never;
'a-pay:paymentCallback': never;
'a-pay:paymentSession': never;
'a-pay:providerOperation': never;
'a-pay:refundOperation': never;
'a-pay:webhook': never;
    }


}
declare module 'vona-module-a-pay' {

        export interface ServiceOutbox {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServiceOutbox {
            get $beanFullName(): 'a-pay.service.outbox';
            get $onionName(): 'a-pay:outbox';

          }

        export interface ServicePaymentCallback {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServicePaymentCallback {
            get $beanFullName(): 'a-pay.service.paymentCallback';
            get $onionName(): 'a-pay:paymentCallback';

          }

        export interface ServicePaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServicePaymentSession {
            get $beanFullName(): 'a-pay.service.paymentSession';
            get $onionName(): 'a-pay:paymentSession';

          }

        export interface ServiceProviderOperation {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServiceProviderOperation {
            get $beanFullName(): 'a-pay.service.providerOperation';
            get $onionName(): 'a-pay:providerOperation';

          }

        export interface ServiceRefundOperation {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServiceRefundOperation {
            get $beanFullName(): 'a-pay.service.refundOperation';
            get $onionName(): 'a-pay:refundOperation';

          }

        export interface ServiceWebhook {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ServiceWebhook {
            get $beanFullName(): 'a-pay.service.webhook';
            get $onionName(): 'a-pay:webhook';

          }
}
/** service: end */
/** service: begin */
import type { ServiceOutbox } from '../service/outbox.ts';
import type { ServicePaymentCallback } from '../service/paymentCallback.ts';
import type { ServicePaymentSession } from '../service/paymentSession.ts';
import type { ServiceProviderOperation } from '../service/providerOperation.ts';
import type { ServiceRefundOperation } from '../service/refundOperation.ts';
import type { ServiceWebhook } from '../service/webhook.ts';
export interface IModuleService {
  'outbox': ServiceOutbox;
'paymentCallback': ServicePaymentCallback;
'paymentSession': ServicePaymentSession;
'providerOperation': ServiceProviderOperation;
'refundOperation': ServiceRefundOperation;
'webhook': ServiceWebhook;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-pay.service.outbox': ServiceOutbox;
'a-pay.service.paymentCallback': ServicePaymentCallback;
'a-pay.service.paymentSession': ServicePaymentSession;
'a-pay.service.providerOperation': ServiceProviderOperation;
'a-pay.service.refundOperation': ServiceRefundOperation;
'a-pay.service.webhook': ServiceWebhook;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'a-pay:index': IMetaOptionsIndex;
'a-pay:redlock': never;
'a-pay:version': never;
    }


}
declare module 'vona-module-a-pay' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface MetaIndex {
            get $beanFullName(): 'a-pay.meta.index';
            get $onionName(): 'a-pay:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'a-pay.meta.redlock';
            get $onionName(): 'a-pay:redlock';

          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface MetaVersion {
            get $beanFullName(): 'a-pay.meta.version';
            get $onionName(): 'a-pay:version';

          }
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** queue: begin */
export * from '../bean/queue.outboxDispatch.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {

    export interface IQueueRecord {
      'a-pay:outboxDispatch': IDecoratorQueueOptions;
    }


}
declare module 'vona-module-a-pay' {

        export interface QueueOutboxDispatch {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface QueueOutboxDispatch {
            get $beanFullName(): 'a-pay.queue.outboxDispatch';
            get $onionName(): 'a-pay:outboxDispatch';
            get $onionOptions(): IDecoratorQueueOptions;
          }
}
/** queue: end */
/** queue: begin */
import type { QueueOutboxDispatch } from '../bean/queue.outboxDispatch.ts';
export interface IModuleQueue {
  'outboxDispatch': QueueOutboxDispatch;
}
/** queue: end */
/** schedule: begin */
export * from '../bean/schedule.outboxDispatch.ts';
export * from '../bean/schedule.providerOperationDispatch.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {

    export interface IScheduleRecord {
      'a-pay:outboxDispatch': IDecoratorScheduleOptions;
'a-pay:providerOperationDispatch': IDecoratorScheduleOptions;
    }


}
declare module 'vona-module-a-pay' {

        export interface ScheduleOutboxDispatch {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ScheduleOutboxDispatch {
            get $beanFullName(): 'a-pay.schedule.outboxDispatch';
            get $onionName(): 'a-pay:outboxDispatch';
            get $onionOptions(): IDecoratorScheduleOptions;
          }

        export interface ScheduleProviderOperationDispatch {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ScheduleProviderOperationDispatch {
            get $beanFullName(): 'a-pay.schedule.providerOperationDispatch';
            get $onionName(): 'a-pay:providerOperationDispatch';
            get $onionOptions(): IDecoratorScheduleOptions;
          }
}
/** schedule: end */
/** dto: begin */
export * from '../dto/paymentSessionStart.tsx';
export * from '../dto/paymentSessionView.tsx';
export * from '../dto/webhookReceipt.tsx';
import type { IDtoOptionsPaymentSessionStart } from '../dto/paymentSessionStart.tsx';
import type { IDtoOptionsPaymentSessionView } from '../dto/paymentSessionView.tsx';
import type { IDtoOptionsWebhookReceipt } from '../dto/webhookReceipt.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'a-pay:paymentSessionStart': IDtoOptionsPaymentSessionStart;
'a-pay:paymentSessionView': IDtoOptionsPaymentSessionView;
'a-pay:webhookReceipt': IDtoOptionsWebhookReceipt;
    }


}
declare module 'vona-module-a-pay' {

}
/** dto: end */
/** dto: begin */
import type { DtoPaymentSessionStart } from '../dto/paymentSessionStart.tsx';
import type { DtoPaymentSessionView } from '../dto/paymentSessionView.tsx';
import type { DtoWebhookReceipt } from '../dto/webhookReceipt.tsx';
declare module 'vona-module-a-pay' {

    export interface IDtoOptionsPaymentSessionStart {
      fields?: TypeEntityOptionsFields<DtoPaymentSessionStart, IDtoOptionsPaymentSessionStart[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsPaymentSessionView {
      fields?: TypeEntityOptionsFields<DtoPaymentSessionView, IDtoOptionsPaymentSessionView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsWebhookReceipt {
      fields?: TypeEntityOptionsFields<DtoWebhookReceipt, IDtoOptionsWebhookReceipt[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/paymentCallback.ts';
export * from '../controller/paymentSession.ts';
export * from '../controller/webhook.ts';
import type { IControllerOptionsPaymentCallback } from '../controller/paymentCallback.ts';
import type { IControllerOptionsPaymentSession } from '../controller/paymentSession.ts';
import type { IControllerOptionsWebhook } from '../controller/webhook.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'a-pay:paymentCallback': IControllerOptionsPaymentCallback;
'a-pay:paymentSession': IControllerOptionsPaymentSession;
'a-pay:webhook': IControllerOptionsWebhook;
    }


}
declare module 'vona-module-a-pay' {

        export interface ControllerPaymentCallback {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ControllerPaymentCallback {
            get $beanFullName(): 'a-pay.controller.paymentCallback';
            get $onionName(): 'a-pay:paymentCallback';
            get $onionOptions(): IControllerOptionsPaymentCallback;
          }

        export interface ControllerPaymentSession {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ControllerPaymentSession {
            get $beanFullName(): 'a-pay.controller.paymentSession';
            get $onionName(): 'a-pay:paymentSession';
            get $onionOptions(): IControllerOptionsPaymentSession;
          }

        export interface ControllerWebhook {
          /** @internal */
          get scope(): ScopeModuleAPay;
        }

          export interface ControllerWebhook {
            get $beanFullName(): 'a-pay.controller.webhook';
            get $onionName(): 'a-pay:webhook';
            get $onionOptions(): IControllerOptionsWebhook;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerPaymentCallback } from '../controller/paymentCallback.ts';
// @ts-ignore ignore
import type { ControllerPaymentSession } from '../controller/paymentSession.ts';
// @ts-ignore ignore
import type { ControllerWebhook } from '../controller/webhook.ts';
declare module 'vona-module-a-pay' {

    export interface IControllerOptionsPaymentCallback {
      actions?: TypeControllerOptionsActions<ControllerPaymentCallback>;
    }

    export interface IControllerOptionsPaymentSession {
      actions?: TypeControllerOptionsActions<ControllerPaymentSession>;
    }

    export interface IControllerOptionsWebhook {
      actions?: TypeControllerOptionsActions<ControllerWebhook>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/payment-callback/return': undefined;
'/payment-callback/cancel': undefined;
'/payment-session/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/payment-session/:id/start': undefined;
'/payment-session/:id/reconcile': undefined;
'/pay/webhook/:providerName/:clientName': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAPay extends BeanScopeBase {}

export interface ScopeModuleAPay {
  util: BeanScopeUtil;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
redlock: MetaRedlock;
queue: IModuleQueue;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-pay': ScopeModuleAPay;
  }

  export interface IBeanScopeContainer {
    pay: ScopeModuleAPay;
  }






}
/** scope: end */
