// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationHasMany } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/cart.tsx';
export * from '../entity/cartItem.tsx';
export * from '../entity/stockAudit.tsx';
export * from '../entity/stockBalance.tsx';
export * from '../entity/stockReservation.tsx';
import type { IEntityOptionsCart } from '../entity/cart.tsx';
import type { IEntityOptionsCartItem } from '../entity/cartItem.tsx';
import type { IEntityOptionsStockAudit } from '../entity/stockAudit.tsx';
import type { IEntityOptionsStockBalance } from '../entity/stockBalance.tsx';
import type { IEntityOptionsStockReservation } from '../entity/stockReservation.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'commerce-trade:cart': IEntityOptionsCart;
'commerce-trade:cartItem': IEntityOptionsCartItem;
'commerce-trade:stockAudit': IEntityOptionsStockAudit;
'commerce-trade:stockBalance': IEntityOptionsStockBalance;
'commerce-trade:stockReservation': IEntityOptionsStockReservation;
    }

  
}
declare module 'vona-module-commerce-trade' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityCart } from '../entity/cart.tsx';
import type { EntityCartItem } from '../entity/cartItem.tsx';
import type { EntityStockAudit } from '../entity/stockAudit.tsx';
import type { EntityStockBalance } from '../entity/stockBalance.tsx';
import type { EntityStockReservation } from '../entity/stockReservation.tsx';
export interface IModuleEntity {
  'cart': EntityCartMeta;
'cartItem': EntityCartItemMeta;
'stockAudit': EntityStockAuditMeta;
'stockBalance': EntityStockBalanceMeta;
'stockReservation': EntityStockReservationMeta;
}
/** entity: end */
/** entity: begin */
export type EntityCartTableName = 'commerceTradeCart';
export type EntityCartItemTableName = 'commerceTradeCartItem';
export type EntityStockAuditTableName = 'commerceTradeStockAudit';
export type EntityStockBalanceTableName = 'commerceTradeStockBalance';
export type EntityStockReservationTableName = 'commerceTradeStockReservation';
export type EntityCartMeta=TypeEntityMeta<EntityCart,EntityCartTableName>;
export type EntityCartItemMeta=TypeEntityMeta<EntityCartItem,EntityCartItemTableName>;
export type EntityStockAuditMeta=TypeEntityMeta<EntityStockAudit,EntityStockAuditTableName>;
export type EntityStockBalanceMeta=TypeEntityMeta<EntityStockBalance,EntityStockBalanceTableName>;
export type EntityStockReservationMeta=TypeEntityMeta<EntityStockReservation,EntityStockReservationTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'commerceTradeCart': EntityCartMeta;
'commerceTradeCartItem': EntityCartItemMeta;
'commerceTradeStockAudit': EntityStockAuditMeta;
'commerceTradeStockBalance': EntityStockBalanceMeta;
'commerceTradeStockReservation': EntityStockReservationMeta;
  }
}
declare module 'vona-module-commerce-trade' {
  
    export interface IEntityOptionsCart {
      fields?: TypeEntityOptionsFields<EntityCart, IEntityOptionsCart[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsCartItem {
      fields?: TypeEntityOptionsFields<EntityCartItem, IEntityOptionsCartItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockAudit {
      fields?: TypeEntityOptionsFields<EntityStockAudit, IEntityOptionsStockAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockBalance {
      fields?: TypeEntityOptionsFields<EntityStockBalance, IEntityOptionsStockBalance[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsStockReservation {
      fields?: TypeEntityOptionsFields<EntityStockReservation, IEntityOptionsStockReservation[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/cart.ts';
export * from '../model/cartItem.ts';
export * from '../model/stockAudit.ts';
export * from '../model/stockBalance.ts';
export * from '../model/stockReservation.ts';
import type { IModelOptionsCart } from '../model/cart.ts';
import type { IModelOptionsCartItem } from '../model/cartItem.ts';
import type { IModelOptionsStockAudit } from '../model/stockAudit.ts';
import type { IModelOptionsStockBalance } from '../model/stockBalance.ts';
import type { IModelOptionsStockReservation } from '../model/stockReservation.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'commerce-trade:cart': IModelOptionsCart;
'commerce-trade:cartItem': IModelOptionsCartItem;
'commerce-trade:stockAudit': IModelOptionsStockAudit;
'commerce-trade:stockBalance': IModelOptionsStockBalance;
'commerce-trade:stockReservation': IModelOptionsStockReservation;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ModelCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelCart {
            get $beanFullName(): 'commerce-trade.model.cart';
            get $onionName(): 'commerce-trade:cart';
            get $onionOptions(): IModelOptionsCart;
          }

        export interface ModelCartItem {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelCartItem {
            get $beanFullName(): 'commerce-trade.model.cartItem';
            get $onionName(): 'commerce-trade:cartItem';
            get $onionOptions(): IModelOptionsCartItem;
          }

        export interface ModelStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockAudit {
            get $beanFullName(): 'commerce-trade.model.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): IModelOptionsStockAudit;
          }

        export interface ModelStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockBalance {
            get $beanFullName(): 'commerce-trade.model.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): IModelOptionsStockBalance;
          }

        export interface ModelStockReservation {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ModelStockReservation {
            get $beanFullName(): 'commerce-trade.model.stockReservation';
            get $onionName(): 'commerce-trade:stockReservation';
            get $onionOptions(): IModelOptionsStockReservation;
          } 
}
/** model: end */
/** model: begin */
import type { ModelCart } from '../model/cart.ts';
import type { ModelCartItem } from '../model/cartItem.ts';
import type { ModelStockAudit } from '../model/stockAudit.ts';
import type { ModelStockBalance } from '../model/stockBalance.ts';
import type { ModelStockReservation } from '../model/stockReservation.ts';
export interface IModuleModel {
  'cart': ModelCart;
'cartItem': ModelCartItem;
'stockAudit': ModelStockAudit;
'stockBalance': ModelStockBalance;
'stockReservation': ModelStockReservation;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-trade.model.cart': ModelCart;
'commerce-trade.model.cartItem': ModelCartItem;
'commerce-trade.model.stockAudit': ModelStockAudit;
'commerce-trade.model.stockBalance': ModelStockBalance;
'commerce-trade.model.stockReservation': ModelStockReservation;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-commerce-trade' {
  export interface IModelOptionsCart {
        relations: {
          items: IModelRelationHasMany<'commerce-trade:cartItem', 'cartId', false, 'id'|'skuId'|'quantity', undefined, undefined, undefined>;
        };
      }
  export interface ModelCart {
      [SymbolKeyEntity]: EntityCart;
      [SymbolKeyEntityMeta]: EntityCartMeta;
      [SymbolKeyModelOptions]: IModelOptionsCart;
      get<T extends IModelGetOptions<EntityCart,ModelCart>>(where: TypeModelWhere<EntityCart>, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityCart,ModelCart>>(where: TypeModelWhere<EntityCart>, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCart,ModelCart>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCart, ModelCart, T>>;
      select<T extends IModelSelectParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCart, ModelCart, T>[]>;
      insert<T extends IModelInsertOptions<EntityCart,ModelCart>>(data?: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCart,ModelCart>>(data: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCart,ModelCart>>(where?: TypeModelWhere<EntityCart>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCart,ModelCart>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCart,ModelCart>>(data?: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCart,ModelCart>>(items: TypeModelMutateRelationData<EntityCart,ModelCart, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>[]>;
      count<T extends IModelSelectCountParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCart,ModelCart,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCart, T>[]>;
      getById<T extends IModelGetOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCart, ModelCart, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCart,ModelCart>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCart,ModelCart, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCart,ModelCart, T>>;
deleteById<T extends IModelDeleteOptions<EntityCart,ModelCart>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelCartItem {
      [SymbolKeyEntity]: EntityCartItem;
      [SymbolKeyEntityMeta]: EntityCartItemMeta;
      [SymbolKeyModelOptions]: IModelOptionsCartItem;
      get<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(where: TypeModelWhere<EntityCartItem>, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(where: TypeModelWhere<EntityCartItem>, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
      mget<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityCartItem, ModelCartItem, T>>;
      select<T extends IModelSelectParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T>[]>;
      insert<T extends IModelInsertOptions<EntityCartItem,ModelCartItem>>(data?: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(data: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[]>;
      delete<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(where?: TypeModelWhere<EntityCartItem>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityCartItem,ModelCartItem>>(data?: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityCartItem,ModelCartItem>>(items: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>[]>;
      count<T extends IModelSelectCountParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityCartItem,ModelCartItem,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityCartItem, T>[]>;
      getById<T extends IModelGetOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityCartItem, ModelCartItem, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>, options?: T): Promise<TypeModelMutateRelationData<EntityCartItem,ModelCartItem, T>>;
deleteById<T extends IModelDeleteOptions<EntityCartItem,ModelCartItem>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockAudit {
      [SymbolKeyEntity]: EntityStockAudit;
      [SymbolKeyEntityMeta]: EntityStockAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockAudit;
      get<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(where: TypeModelWhere<EntityStockAudit>, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(where: TypeModelWhere<EntityStockAudit>, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockAudit, ModelStockAudit, T>>;
      select<T extends IModelSelectParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockAudit,ModelStockAudit>>(data?: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(data: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(where?: TypeModelWhere<EntityStockAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockAudit,ModelStockAudit>>(data?: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockAudit,ModelStockAudit>>(items: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockAudit,ModelStockAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockAudit, T>[]>;
      getById<T extends IModelGetOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockAudit, ModelStockAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockAudit,ModelStockAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockAudit,ModelStockAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockBalance {
      [SymbolKeyEntity]: EntityStockBalance;
      [SymbolKeyEntityMeta]: EntityStockBalanceMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockBalance;
      get<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(where: TypeModelWhere<EntityStockBalance>, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(where: TypeModelWhere<EntityStockBalance>, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockBalance, ModelStockBalance, T>>;
      select<T extends IModelSelectParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockBalance,ModelStockBalance>>(data?: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(data: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(where?: TypeModelWhere<EntityStockBalance>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockBalance,ModelStockBalance>>(data?: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockBalance,ModelStockBalance>>(items: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockBalance,ModelStockBalance,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockBalance, T>[]>;
      getById<T extends IModelGetOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockBalance, ModelStockBalance, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockBalance,ModelStockBalance, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockBalance,ModelStockBalance>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelStockReservation {
      [SymbolKeyEntity]: EntityStockReservation;
      [SymbolKeyEntityMeta]: EntityStockReservationMeta;
      [SymbolKeyModelOptions]: IModelOptionsStockReservation;
      get<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(where: TypeModelWhere<EntityStockReservation>, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      getForUpdate<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(where: TypeModelWhere<EntityStockReservation>, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      getByIdForUpdate<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
      mget<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityStockReservation, ModelStockReservation, T>>;
      select<T extends IModelSelectParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T>[]>;
      insert<T extends IModelInsertOptions<EntityStockReservation,ModelStockReservation>>(data?: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(data: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[]>;
      delete<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(where?: TypeModelWhere<EntityStockReservation>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityStockReservation,ModelStockReservation>>(data?: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityStockReservation,ModelStockReservation>>(items: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>[]>;
      count<T extends IModelSelectCountParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityStockReservation,ModelStockReservation,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityStockReservation, T>[]>;
      getById<T extends IModelGetOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityStockReservation, ModelStockReservation, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>, options?: T): Promise<TypeModelMutateRelationData<EntityStockReservation,ModelStockReservation, T>>;
deleteById<T extends IModelDeleteOptions<EntityStockReservation,ModelStockReservation>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'commerce-trade:cart': ModelCart;
'commerce-trade:cartItem': ModelCartItem;
'commerce-trade:stockAudit': ModelStockAudit;
'commerce-trade:stockBalance': ModelStockBalance;
'commerce-trade:stockReservation': ModelStockReservation;
  }
}
/** model: end */
/** service: begin */
export * from '../service/cart.ts';
export * from '../service/stockAudit.ts';
export * from '../service/stockBalance.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'commerce-trade:cart': never;
'commerce-trade:stockAudit': never;
'commerce-trade:stockBalance': never;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ServiceCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceCart {
            get $beanFullName(): 'commerce-trade.service.cart';
            get $onionName(): 'commerce-trade:cart';
            
          }

        export interface ServiceStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceStockAudit {
            get $beanFullName(): 'commerce-trade.service.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            
          }

        export interface ServiceStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ServiceStockBalance {
            get $beanFullName(): 'commerce-trade.service.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceCart } from '../service/cart.ts';
import type { ServiceStockAudit } from '../service/stockAudit.ts';
import type { ServiceStockBalance } from '../service/stockBalance.ts';
export interface IModuleService {
  'cart': ServiceCart;
'stockAudit': ServiceStockAudit;
'stockBalance': ServiceStockBalance;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'commerce-trade.service.cart': ServiceCart;
'commerce-trade.service.stockAudit': ServiceStockAudit;
'commerce-trade.service.stockBalance': ServiceStockBalance;
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
      'commerce-trade:index': IMetaOptionsIndex;
'commerce-trade:version': never;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface MetaIndex {
            get $beanFullName(): 'commerce-trade.meta.index';
            get $onionName(): 'commerce-trade:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-trade.meta.version';
            get $onionName(): 'commerce-trade:version';
            
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/cartAddItem.tsx';
export * from '../dto/cartItem.tsx';
export * from '../dto/cartUpdateItem.tsx';
export * from '../dto/cartView.tsx';
export * from '../dto/stockAdjust.tsx';
export * from '../dto/stockAuditCreate.tsx';
export * from '../dto/stockAuditSelectReq.tsx';
export * from '../dto/stockAuditSelectRes.tsx';
export * from '../dto/stockAuditSelectResItem.tsx';
export * from '../dto/stockAuditUpdate.tsx';
export * from '../dto/stockAuditView.tsx';
export * from '../dto/stockBalanceCreate.tsx';
export * from '../dto/stockBalanceSelectReq.tsx';
export * from '../dto/stockBalanceSelectRes.tsx';
export * from '../dto/stockBalanceSelectResItem.tsx';
export * from '../dto/stockBalanceUpdate.tsx';
export * from '../dto/stockBalanceView.tsx';
import type { IDtoOptionsCartAddItem } from '../dto/cartAddItem.tsx';
import type { IDtoOptionsCartItem } from '../dto/cartItem.tsx';
import type { IDtoOptionsCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import type { IDtoOptionsCartView } from '../dto/cartView.tsx';
import type { IDtoOptionsStockAdjust } from '../dto/stockAdjust.tsx';
import type { IDtoOptionsStockAuditCreate } from '../dto/stockAuditCreate.tsx';
import type { IDtoOptionsStockAuditSelectReq } from '../dto/stockAuditSelectReq.tsx';
import type { IDtoOptionsStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { IDtoOptionsStockAuditSelectResItem } from '../dto/stockAuditSelectResItem.tsx';
import type { IDtoOptionsStockAuditUpdate } from '../dto/stockAuditUpdate.tsx';
import type { IDtoOptionsStockAuditView } from '../dto/stockAuditView.tsx';
import type { IDtoOptionsStockBalanceCreate } from '../dto/stockBalanceCreate.tsx';
import type { IDtoOptionsStockBalanceSelectReq } from '../dto/stockBalanceSelectReq.tsx';
import type { IDtoOptionsStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { IDtoOptionsStockBalanceSelectResItem } from '../dto/stockBalanceSelectResItem.tsx';
import type { IDtoOptionsStockBalanceUpdate } from '../dto/stockBalanceUpdate.tsx';
import type { IDtoOptionsStockBalanceView } from '../dto/stockBalanceView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'commerce-trade:cartAddItem': IDtoOptionsCartAddItem;
'commerce-trade:cartItem': IDtoOptionsCartItem;
'commerce-trade:cartUpdateItem': IDtoOptionsCartUpdateItem;
'commerce-trade:cartView': IDtoOptionsCartView;
'commerce-trade:stockAdjust': IDtoOptionsStockAdjust;
'commerce-trade:stockAuditCreate': IDtoOptionsStockAuditCreate;
'commerce-trade:stockAuditSelectReq': IDtoOptionsStockAuditSelectReq;
'commerce-trade:stockAuditSelectRes': IDtoOptionsStockAuditSelectRes;
'commerce-trade:stockAuditSelectResItem': IDtoOptionsStockAuditSelectResItem;
'commerce-trade:stockAuditUpdate': IDtoOptionsStockAuditUpdate;
'commerce-trade:stockAuditView': IDtoOptionsStockAuditView;
'commerce-trade:stockBalanceCreate': IDtoOptionsStockBalanceCreate;
'commerce-trade:stockBalanceSelectReq': IDtoOptionsStockBalanceSelectReq;
'commerce-trade:stockBalanceSelectRes': IDtoOptionsStockBalanceSelectRes;
'commerce-trade:stockBalanceSelectResItem': IDtoOptionsStockBalanceSelectResItem;
'commerce-trade:stockBalanceUpdate': IDtoOptionsStockBalanceUpdate;
'commerce-trade:stockBalanceView': IDtoOptionsStockBalanceView;
    }

  
}
declare module 'vona-module-commerce-trade' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoCartAddItem } from '../dto/cartAddItem.tsx';
import type { DtoCartItem } from '../dto/cartItem.tsx';
import type { DtoCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import type { DtoCartView } from '../dto/cartView.tsx';
import type { DtoStockAdjust } from '../dto/stockAdjust.tsx';
import type { DtoStockAuditCreate } from '../dto/stockAuditCreate.tsx';
import type { DtoStockAuditSelectReq } from '../dto/stockAuditSelectReq.tsx';
import type { DtoStockAuditSelectRes } from '../dto/stockAuditSelectRes.tsx';
import type { DtoStockAuditSelectResItem } from '../dto/stockAuditSelectResItem.tsx';
import type { DtoStockAuditUpdate } from '../dto/stockAuditUpdate.tsx';
import type { DtoStockAuditView } from '../dto/stockAuditView.tsx';
import type { DtoStockBalanceCreate } from '../dto/stockBalanceCreate.tsx';
import type { DtoStockBalanceSelectReq } from '../dto/stockBalanceSelectReq.tsx';
import type { DtoStockBalanceSelectRes } from '../dto/stockBalanceSelectRes.tsx';
import type { DtoStockBalanceSelectResItem } from '../dto/stockBalanceSelectResItem.tsx';
import type { DtoStockBalanceUpdate } from '../dto/stockBalanceUpdate.tsx';
import type { DtoStockBalanceView } from '../dto/stockBalanceView.tsx';
declare module 'vona-module-commerce-trade' {
  
    export interface IDtoOptionsCartAddItem {
      fields?: TypeEntityOptionsFields<DtoCartAddItem, IDtoOptionsCartAddItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartItem {
      fields?: TypeEntityOptionsFields<DtoCartItem, IDtoOptionsCartItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartUpdateItem {
      fields?: TypeEntityOptionsFields<DtoCartUpdateItem, IDtoOptionsCartUpdateItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCartView {
      fields?: TypeEntityOptionsFields<DtoCartView, IDtoOptionsCartView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAdjust {
      fields?: TypeEntityOptionsFields<DtoStockAdjust, IDtoOptionsStockAdjust[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditCreate {
      fields?: TypeEntityOptionsFields<DtoStockAuditCreate, IDtoOptionsStockAuditCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectReq {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectReq, IDtoOptionsStockAuditSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectRes {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectRes, IDtoOptionsStockAuditSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditSelectResItem {
      fields?: TypeEntityOptionsFields<DtoStockAuditSelectResItem, IDtoOptionsStockAuditSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditUpdate {
      fields?: TypeEntityOptionsFields<DtoStockAuditUpdate, IDtoOptionsStockAuditUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockAuditView {
      fields?: TypeEntityOptionsFields<DtoStockAuditView, IDtoOptionsStockAuditView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceCreate {
      fields?: TypeEntityOptionsFields<DtoStockBalanceCreate, IDtoOptionsStockBalanceCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectReq {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectReq, IDtoOptionsStockBalanceSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectRes {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectRes, IDtoOptionsStockBalanceSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceSelectResItem {
      fields?: TypeEntityOptionsFields<DtoStockBalanceSelectResItem, IDtoOptionsStockBalanceSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceUpdate {
      fields?: TypeEntityOptionsFields<DtoStockBalanceUpdate, IDtoOptionsStockBalanceUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsStockBalanceView {
      fields?: TypeEntityOptionsFields<DtoStockBalanceView, IDtoOptionsStockBalanceView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/cart.ts';
export * from '../controller/stockAudit.ts';
export * from '../controller/stockBalance.ts';
import type { IControllerOptionsCart } from '../controller/cart.ts';
import type { IControllerOptionsStockAudit } from '../controller/stockAudit.ts';
import type { IControllerOptionsStockBalance } from '../controller/stockBalance.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'commerce-trade:cart': IControllerOptionsCart;
'commerce-trade:stockAudit': IControllerOptionsStockAudit;
'commerce-trade:stockBalance': IControllerOptionsStockBalance;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface ControllerCart {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerCart {
            get $beanFullName(): 'commerce-trade.controller.cart';
            get $onionName(): 'commerce-trade:cart';
            get $onionOptions(): IControllerOptionsCart;
          }

        export interface ControllerStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerStockAudit {
            get $beanFullName(): 'commerce-trade.controller.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): IControllerOptionsStockAudit;
          }

        export interface ControllerStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface ControllerStockBalance {
            get $beanFullName(): 'commerce-trade.controller.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): IControllerOptionsStockBalance;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCart } from '../controller/cart.ts';
// @ts-ignore ignore
import type { ControllerStockAudit } from '../controller/stockAudit.ts';
// @ts-ignore ignore
import type { ControllerStockBalance } from '../controller/stockBalance.ts';
declare module 'vona-module-commerce-trade' {
  
    export interface IControllerOptionsCart {
      actions?: TypeControllerOptionsActions<ControllerCart>;
    }

    export interface IControllerOptionsStockAudit {
      actions?: TypeControllerOptionsActions<ControllerStockAudit>;
    }

    export interface IControllerOptionsStockBalance {
      actions?: TypeControllerOptionsActions<ControllerStockBalance>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/commerce/trade/cart': undefined;
'/commerce/trade/stockAudit': undefined;
'/commerce/trade/stockAudit/:id': undefined;
'/commerce/trade/stockBalance': undefined;
'/commerce/trade/stockBalance/:id': undefined;
    }
export interface IApiPathPostRecord{
        '/commerce/trade/cart/items': undefined;
'/commerce/trade/stockBalance/adjustStock': undefined;
    }
export interface IApiPathPatchRecord{
        '/commerce/trade/cart/items/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/commerce/trade/cart/items/:id': undefined;
'/commerce/trade/cart/items': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'commerce-trade:stockAudit': never;
'commerce-trade:stockBalance': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.stockAudit.ts';
export * from '../bean/ssrMenu.stockBalance.ts';
import type { ISsrMenuOptionsStockAudit } from '../bean/ssrMenu.stockAudit.ts';
import type { ISsrMenuOptionsStockBalance } from '../bean/ssrMenu.stockBalance.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'commerce-trade:stockAudit': ISsrMenuOptionsStockAudit;
'commerce-trade:stockBalance': ISsrMenuOptionsStockBalance;
    }

  
}
declare module 'vona-module-commerce-trade' {
  
        export interface SsrMenuStockAudit {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface SsrMenuStockAudit {
            get $beanFullName(): 'commerce-trade.ssrMenu.stockAudit';
            get $onionName(): 'commerce-trade:stockAudit';
            get $onionOptions(): ISsrMenuOptionsStockAudit;
          }

        export interface SsrMenuStockBalance {
          /** @internal */
          get scope(): ScopeModuleCommerceTrade;
        }

          export interface SsrMenuStockBalance {
            get $beanFullName(): 'commerce-trade.ssrMenu.stockBalance';
            get $onionName(): 'commerce-trade:stockBalance';
            get $onionOptions(): ISsrMenuOptionsStockBalance;
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
export class ScopeModuleCommerceTrade extends BeanScopeBase {}

export interface ScopeModuleCommerceTrade {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-trade': ScopeModuleCommerceTrade;
  }

  export interface IBeanScopeContainer {
    commerceTrade: ScopeModuleCommerceTrade;
  }
  
  

  export interface IBeanScopeLocale {
    'commerce-trade': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
