// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/couponAudit.tsx';
export * from '../entity/couponGrant.tsx';
export * from '../entity/couponTemplate.tsx';
import type { IEntityOptionsCouponAudit } from '../entity/couponAudit.tsx';
import type { IEntityOptionsCouponGrant } from '../entity/couponGrant.tsx';
import type { IEntityOptionsCouponTemplate } from '../entity/couponTemplate.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-promotion:couponAudit': IEntityOptionsCouponAudit;
'commerce-promotion:couponGrant': IEntityOptionsCouponGrant;
'commerce-promotion:couponTemplate': IEntityOptionsCouponTemplate;
    }

  
}
declare module 'vona-module-commerce-promotion' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityCouponAudit } from '../entity/couponAudit.tsx';
import type { EntityCouponGrant } from '../entity/couponGrant.tsx';
import type { EntityCouponTemplate } from '../entity/couponTemplate.tsx';
export interface IModuleEntity {
  'couponAudit': EntityCouponAuditMeta;
'couponGrant': EntityCouponGrantMeta;
'couponTemplate': EntityCouponTemplateMeta;
}
/** entity: end */
/** entity: begin */
export type EntityCouponAuditTableName = 'commercePromotionCouponAudit';
export type EntityCouponGrantTableName = 'commercePromotionCouponGrant';
export type EntityCouponTemplateTableName = 'commercePromotionCouponTemplate';
export type EntityCouponAuditMeta=TypeEntityMeta<EntityCouponAudit,EntityCouponAuditTableName>;
export type EntityCouponGrantMeta=TypeEntityMeta<EntityCouponGrant,EntityCouponGrantTableName>;
export type EntityCouponTemplateMeta=TypeEntityMeta<EntityCouponTemplate,EntityCouponTemplateTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commercePromotionCouponAudit': EntityCouponAuditMeta;
'commercePromotionCouponGrant': EntityCouponGrantMeta;
'commercePromotionCouponTemplate': EntityCouponTemplateMeta;
  }
}
declare module 'vona-module-commerce-promotion' {
  
    export interface IEntityOptionsCouponAudit {
      fields?: TypeEntityOptionsFields<EntityCouponAudit, IEntityOptionsCouponAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsCouponGrant {
      fields?: TypeEntityOptionsFields<EntityCouponGrant, IEntityOptionsCouponGrant[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsCouponTemplate {
      fields?: TypeEntityOptionsFields<EntityCouponTemplate, IEntityOptionsCouponTemplate[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/couponAudit.ts';
export * from '../model/couponGrant.ts';
export * from '../model/couponTemplate.ts';
import type { IModelOptionsCouponAudit } from '../model/couponAudit.ts';
import type { IModelOptionsCouponGrant } from '../model/couponGrant.ts';
import type { IModelOptionsCouponTemplate } from '../model/couponTemplate.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-promotion:couponAudit': IModelOptionsCouponAudit;
'commerce-promotion:couponGrant': IModelOptionsCouponGrant;
'commerce-promotion:couponTemplate': IModelOptionsCouponTemplate;
    }

  
}
declare module 'vona-module-commerce-promotion' {
  
        export interface ModelCouponAudit {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ModelCouponAudit {
            get $beanFullName(): 'commerce-promotion.model.couponAudit';
            get $onionName(): 'commerce-promotion:couponAudit';
            get $onionOptions(): IModelOptionsCouponAudit;
          }

        export interface ModelCouponGrant {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ModelCouponGrant {
            get $beanFullName(): 'commerce-promotion.model.couponGrant';
            get $onionName(): 'commerce-promotion:couponGrant';
            get $onionOptions(): IModelOptionsCouponGrant;
          }

        export interface ModelCouponTemplate {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ModelCouponTemplate {
            get $beanFullName(): 'commerce-promotion.model.couponTemplate';
            get $onionName(): 'commerce-promotion:couponTemplate';
            get $onionOptions(): IModelOptionsCouponTemplate;
          } 
}
/** model: end */
/** model: begin */
import type { ModelCouponAudit } from '../model/couponAudit.ts';
import type { ModelCouponGrant } from '../model/couponGrant.ts';
import type { ModelCouponTemplate } from '../model/couponTemplate.ts';
export interface IModuleModel {
  'couponAudit': ModelCouponAudit;
'couponGrant': ModelCouponGrant;
'couponTemplate': ModelCouponTemplate;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-promotion.model.couponAudit': ModelCouponAudit;
'commerce-promotion.model.couponGrant': ModelCouponGrant;
'commerce-promotion.model.couponTemplate': ModelCouponTemplate;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-promotion' {
  
  export interface ModelCouponAudit {
      [SymbolKeyEntity]: EntityCouponAudit;
      [SymbolKeyEntityMeta]: EntityCouponAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsCouponAudit;
      get<T extends IModelGetOptions<EntityCouponAudit,ModelCouponAudit>>(where: TypeModelWhere<EntityCouponAudit>, options?: T): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCouponAudit,ModelCouponAudit>>(where: TypeModelWhere<EntityCouponAudit>, options?: T): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCouponAudit,ModelCouponAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCouponAudit,ModelCouponAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCouponAudit, ModelCouponAudit, T>>;
      select<T extends IModelSelectParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityCouponAudit,ModelCouponAudit>>(data?: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCouponAudit,ModelCouponAudit>>(items: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCouponAudit,ModelCouponAudit>>(data: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCouponAudit,ModelCouponAudit>>(items: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCouponAudit,ModelCouponAudit>>(where?: TypeModelWhere<EntityCouponAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCouponAudit,ModelCouponAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCouponAudit,ModelCouponAudit>>(data?: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCouponAudit,ModelCouponAudit>>(items: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCouponAudit,ModelCouponAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCouponAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityCouponAudit,ModelCouponAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponAudit, ModelCouponAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCouponAudit,ModelCouponAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponAudit,ModelCouponAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityCouponAudit,ModelCouponAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelCouponGrant {
      [SymbolKeyEntity]: EntityCouponGrant;
      [SymbolKeyEntityMeta]: EntityCouponGrantMeta;
      [SymbolKeyModelOptions]: IModelOptionsCouponGrant;
      get<T extends IModelGetOptions<EntityCouponGrant,ModelCouponGrant>>(where: TypeModelWhere<EntityCouponGrant>, options?: T): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCouponGrant,ModelCouponGrant>>(where: TypeModelWhere<EntityCouponGrant>, options?: T): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCouponGrant,ModelCouponGrant>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCouponGrant,ModelCouponGrant>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCouponGrant, ModelCouponGrant, T>>;
      select<T extends IModelSelectParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T>[]>;
      insert<T extends IModelInsertOptions<EntityCouponGrant,ModelCouponGrant>>(data?: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCouponGrant,ModelCouponGrant>>(items: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCouponGrant,ModelCouponGrant>>(data: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCouponGrant,ModelCouponGrant>>(items: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCouponGrant,ModelCouponGrant>>(where?: TypeModelWhere<EntityCouponGrant>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCouponGrant,ModelCouponGrant>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCouponGrant,ModelCouponGrant>>(data?: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCouponGrant,ModelCouponGrant>>(items: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>[]>;
      count<T extends IModelSelectCountParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCouponGrant,ModelCouponGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCouponGrant, T>[]>;
      getById<T extends IModelGetOptions<EntityCouponGrant,ModelCouponGrant>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponGrant, ModelCouponGrant, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCouponGrant,ModelCouponGrant>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponGrant,ModelCouponGrant, T>>;
deleteById<T extends IModelDeleteOptions<EntityCouponGrant,ModelCouponGrant>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelCouponTemplate {
      [SymbolKeyEntity]: EntityCouponTemplate;
      [SymbolKeyEntityMeta]: EntityCouponTemplateMeta;
      [SymbolKeyModelOptions]: IModelOptionsCouponTemplate;
      get<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(where: TypeModelWhere<EntityCouponTemplate>, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(where: TypeModelWhere<EntityCouponTemplate>, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCouponTemplate, ModelCouponTemplate, T>>;
      select<T extends IModelSelectParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T>[]>;
      insert<T extends IModelInsertOptions<EntityCouponTemplate,ModelCouponTemplate>>(data?: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCouponTemplate,ModelCouponTemplate>>(items: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCouponTemplate,ModelCouponTemplate>>(data: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCouponTemplate,ModelCouponTemplate>>(items: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCouponTemplate,ModelCouponTemplate>>(where?: TypeModelWhere<EntityCouponTemplate>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCouponTemplate,ModelCouponTemplate>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCouponTemplate,ModelCouponTemplate>>(data?: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCouponTemplate,ModelCouponTemplate>>(items: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>[]>;
      count<T extends IModelSelectCountParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCouponTemplate, T>[]>;
      getById<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCouponTemplate,ModelCouponTemplate>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCouponTemplate,ModelCouponTemplate, T>>;
deleteById<T extends IModelDeleteOptions<EntityCouponTemplate,ModelCouponTemplate>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityCouponTemplate,ModelCouponTemplate>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityCouponTemplate,ModelCouponTemplate,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCouponTemplate, ModelCouponTemplate, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-promotion:couponAudit': ModelCouponAudit;
'commerce-promotion:couponGrant': ModelCouponGrant;
'commerce-promotion:couponTemplate': ModelCouponTemplate;
  }
}
/** model: end */
/** service: begin */
export * from '../service/coupon.ts';
export * from '../service/couponTemplate.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-promotion:coupon': never;
'commerce-promotion:couponTemplate': never;
    }

  
}
declare module 'vona-module-commerce-promotion' {
  
        export interface ServiceCoupon {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ServiceCoupon {
            get $beanFullName(): 'commerce-promotion.service.coupon';
            get $onionName(): 'commerce-promotion:coupon';
            
          }

        export interface ServiceCouponTemplate {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ServiceCouponTemplate {
            get $beanFullName(): 'commerce-promotion.service.couponTemplate';
            get $onionName(): 'commerce-promotion:couponTemplate';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceCoupon } from '../service/coupon.ts';
import type { ServiceCouponTemplate } from '../service/couponTemplate.ts';
export interface IModuleService {
  'coupon': ServiceCoupon;
'couponTemplate': ServiceCouponTemplate;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-promotion.service.coupon': ServiceCoupon;
'commerce-promotion.service.couponTemplate': ServiceCouponTemplate;
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
      'commerce-promotion:index': IMetaOptionsIndex;
'commerce-promotion:version': never;
    }

  
}
declare module 'vona-module-commerce-promotion' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-promotion.meta.index';
            get $onionName(): 'commerce-promotion:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-promotion.meta.version';
            get $onionName(): 'commerce-promotion:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/couponIssue.tsx';
export * from '../dto/couponMineItem.tsx';
export * from '../dto/couponTemplateCreate.tsx';
export * from '../dto/couponTemplateSelectReq.tsx';
export * from '../dto/couponTemplateSelectRes.tsx';
export * from '../dto/couponTemplateSelectResItem.tsx';
export * from '../dto/couponTemplateUpdate.tsx';
export * from '../dto/couponTemplateView.tsx';
import type { IDtoOptionsCouponIssue } from '../dto/couponIssue.tsx';
import type { IDtoOptionsCouponMineItem } from '../dto/couponMineItem.tsx';
import type { IDtoOptionsCouponTemplateCreate } from '../dto/couponTemplateCreate.tsx';
import type { IDtoOptionsCouponTemplateSelectReq } from '../dto/couponTemplateSelectReq.tsx';
import type { IDtoOptionsCouponTemplateSelectRes } from '../dto/couponTemplateSelectRes.tsx';
import type { IDtoOptionsCouponTemplateSelectResItem } from '../dto/couponTemplateSelectResItem.tsx';
import type { IDtoOptionsCouponTemplateUpdate } from '../dto/couponTemplateUpdate.tsx';
import type { IDtoOptionsCouponTemplateView } from '../dto/couponTemplateView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-promotion:couponIssue': IDtoOptionsCouponIssue;
'commerce-promotion:couponMineItem': IDtoOptionsCouponMineItem;
'commerce-promotion:couponTemplateCreate': IDtoOptionsCouponTemplateCreate;
'commerce-promotion:couponTemplateSelectReq': IDtoOptionsCouponTemplateSelectReq;
'commerce-promotion:couponTemplateSelectRes': IDtoOptionsCouponTemplateSelectRes;
'commerce-promotion:couponTemplateSelectResItem': IDtoOptionsCouponTemplateSelectResItem;
'commerce-promotion:couponTemplateUpdate': IDtoOptionsCouponTemplateUpdate;
'commerce-promotion:couponTemplateView': IDtoOptionsCouponTemplateView;
    }

  
}
declare module 'vona-module-commerce-promotion' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoCouponIssue } from '../dto/couponIssue.tsx';
import type { DtoCouponMineItem } from '../dto/couponMineItem.tsx';
import type { DtoCouponTemplateCreate } from '../dto/couponTemplateCreate.tsx';
import type { DtoCouponTemplateSelectReq } from '../dto/couponTemplateSelectReq.tsx';
import type { DtoCouponTemplateSelectRes } from '../dto/couponTemplateSelectRes.tsx';
import type { DtoCouponTemplateSelectResItem } from '../dto/couponTemplateSelectResItem.tsx';
import type { DtoCouponTemplateUpdate } from '../dto/couponTemplateUpdate.tsx';
import type { DtoCouponTemplateView } from '../dto/couponTemplateView.tsx';
declare module 'vona-module-commerce-promotion' {
  
    export interface IDtoOptionsCouponIssue {
      fields?: TypeEntityOptionsFields<DtoCouponIssue, IDtoOptionsCouponIssue[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponMineItem {
      fields?: TypeEntityOptionsFields<DtoCouponMineItem, IDtoOptionsCouponMineItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateCreate {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateCreate, IDtoOptionsCouponTemplateCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateSelectReq {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateSelectReq, IDtoOptionsCouponTemplateSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateSelectRes {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateSelectRes, IDtoOptionsCouponTemplateSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateSelectResItem {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateSelectResItem, IDtoOptionsCouponTemplateSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateUpdate {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateUpdate, IDtoOptionsCouponTemplateUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCouponTemplateView {
      fields?: TypeEntityOptionsFields<DtoCouponTemplateView, IDtoOptionsCouponTemplateView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/coupon.ts';
export * from '../controller/couponTemplate.ts';
import type { IControllerOptionsCoupon } from '../controller/coupon.ts';
import type { IControllerOptionsCouponTemplate } from '../controller/couponTemplate.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'commerce-promotion:coupon': IControllerOptionsCoupon;
'commerce-promotion:couponTemplate': IControllerOptionsCouponTemplate;
    }

  
}
declare module 'vona-module-commerce-promotion' {
  
        export interface ControllerCoupon {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ControllerCoupon {
            get $beanFullName(): 'commerce-promotion.controller.coupon';
            get $onionName(): 'commerce-promotion:coupon';
            get $onionOptions(): IControllerOptionsCoupon;
          }

        export interface ControllerCouponTemplate {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface ControllerCouponTemplate {
            get $beanFullName(): 'commerce-promotion.controller.couponTemplate';
            get $onionName(): 'commerce-promotion:couponTemplate';
            get $onionOptions(): IControllerOptionsCouponTemplate;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCoupon } from '../controller/coupon.ts';
// @ts-ignore ignore
import type { ControllerCouponTemplate } from '../controller/couponTemplate.ts';
declare module 'vona-module-commerce-promotion' {
  
    export interface IControllerOptionsCoupon {
      actions?: TypeControllerOptionsActions<ControllerCoupon>;
    }

    export interface IControllerOptionsCouponTemplate {
      actions?: TypeControllerOptionsActions<ControllerCouponTemplate>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/commerce/promotion/coupon/mine': undefined;
'/commerce/promotion/couponTemplate': undefined;
'/commerce/promotion/couponTemplate/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/commerce/promotion/coupon/issue': undefined;
'/commerce/promotion/couponTemplate': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/promotion/couponTemplate/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/promotion/couponTemplate/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-promotion:couponTemplate': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.couponTemplate.ts';
import type { ISsrMenuOptionsCouponTemplate } from '../bean/ssrMenu.couponTemplate.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'commerce-promotion:couponTemplate': ISsrMenuOptionsCouponTemplate;
    }

  
}
declare module 'vona-module-commerce-promotion' {
  
        export interface SsrMenuCouponTemplate {
          /** @internal */
          get scope(): ScopeModuleCommercePromotion;
        }

          export interface SsrMenuCouponTemplate {
            get $beanFullName(): 'commerce-promotion.ssrMenu.couponTemplate';
            get $onionName(): 'commerce-promotion:couponTemplate';
            get $onionOptions(): ISsrMenuOptionsCouponTemplate;
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
export class ScopeModuleCommercePromotion extends BeanScopeBase {}

export interface ScopeModuleCommercePromotion {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-promotion': ScopeModuleCommercePromotion;
  }

  export interface IBeanScopeContainer {
    commercePromotion: ScopeModuleCommercePromotion;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-promotion': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
